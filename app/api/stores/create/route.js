import imagekit from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();

        const name = (formData.get("name") || "").toString().trim();
        const description = (formData.get("description") || "").toString().trim();
        const username = (formData.get("username") || "").toString().trim();
        const email = (formData.get("email") || "").toString().trim();
        const contact = (formData.get("contact") || "").toString().trim();
        const address = (formData.get("address") || "").toString().trim();
        const image = formData.get("image");

        // Check if any field details are missing
        if (!name || !description || !username || !email || !contact || !address || !image) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Perform user upsert and duplicate-store check in a single transaction to avoid FK issues
        await prisma.$transaction(async (tx) => {
            // Ensure a corresponding User exists to satisfy FK (upsert using provided form fields)
            await tx.user.upsert({
                where: { id: userId },
                update: {
                    name: name || "User",
                    email: email,
                    image: ""
                },
                create: {
                    id: userId,
                    name: name || "User",
                    email: email,
                    image: ""
                }
            });

            // Check if user already has a registered store
            const existing = await tx.store.findFirst({ where: { userId } });
            if (existing) {
                throw new Error("You already have a store");
            }

            return null;
        });

        // Check if username is taken
        const usernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase(),
            },
        });

        if (usernameTaken) {
            return NextResponse.json({ error: "Username already taken! Please try a different one." }, { status: 400 });
        }

        // Image upload to ImageKit (handle multipart File)
        let uploadBuffer;
        let uploadFileName = "store-logo";
        if (typeof image === "string") {
            // base64 string fallback
            uploadBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
        } else {
            // image is a File (Blob) from multipart form-data
            const arrayBuffer = await image.arrayBuffer();
            uploadBuffer = Buffer.from(arrayBuffer);
            uploadFileName = image.name || uploadFileName;
        }

        const response = await imagekit.upload({
            file: uploadBuffer,
            fileName: uploadFileName,
            folder: "store-logos",
            useUniqueFileName: true,
        });

        const optimizedImage = imagekit.url({
            src: response.url,
            transformation: [{ width: 300, height: 300, quality: "auto", crop: "auto" }],
        });

        // Create the new store via relation to guarantee FK
        const createdUserWithStore = await prisma.user.update({
            where: { id: userId },
            data: {
                store: {
                    create: {
                        name,
                        description,
                        username: username.toLowerCase(),
                        email,
                        contact,
                        address,
                        logo: optimizedImage,
                    }
                }
            },
            select: { store: { select: { id: true, status: true, name: true, username: true, logo: true } } }
        });
        const createdStore = createdUserWithStore.store;

        // Link store to user - This part needs to be adjusted based on your User model
        // Your User model doesn't have a direct storeId field, so this might not be needed
        // as the relation is already established through the userId in the Store model

        return NextResponse.json(
            { message: "Store created successfully", store: createdStore },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating store:", error);
        if (error.message === "You already have a store") {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
};

// Check if user has already registered a store and if yes, return the store
export const GET = async (req) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const store = await prisma.store.findFirst({
            where: {
                userId,
            },
        });

        if (!store) {
            // No store yet: return 200 with empty body to avoid client-side 404 errors
            return NextResponse.json({}, { status: 200 });
        }

        // Return minimal status info plus id if needed by clients
        return NextResponse.json({ id: store.id, status: store.status }, { status: 200 });
    } catch (error) {
        console.error("Error fetching store:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
};