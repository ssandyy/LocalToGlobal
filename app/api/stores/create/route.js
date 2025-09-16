import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export const POST = async (req) => {
    try {
        const { userId } = getAuth(req);
        const formData = await req.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const username = formData.get('username');
        const email = formData.get('email');
        const contact = formData.get('contact');
        const address = formData.get('address');
        const image = formData.get('image');

        //check if any filed details missing
        if (!name || !description || !username || !email || !contact || !address || !image) {
            return new NextResponse(JSON.stringify({ error: "All fields are required" }), { status: 400 })
        }

        //check if user already register store
        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        })

        if (store) {
            return new NextResponse(JSON.stringify({ error: "You already have a store" }), { status: 400 })
        }

        //check username taken or available
        const usernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase()
            }
        })

        if (usernameTaken) {
            return new NextResponse(JSON.stringify({ error: "Username already taken!!, please try diffrent one..!" }), { status: store.status })
        }


        // image upload to image kit
        const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const response = await imagekit.upload({
            file: buffer,
            fileName: "store-logo",
            folder: "store-logos",
            useUniqueFileName: true
        })

        const optimizedImage = imagekit.url({
            path: response.path,
            transformations: [{ width: 300, height: 300, quality: auto, gravity: "auto" }]
        })

        const newStore = await prisma.store.create({
            data: {
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                image: optimizedImage,
                userId
            }
        })

        //link store to user
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                store: {
                    id: newStore.id
                }
            }
        })

        return new NextResponse(JSON.stringify({ name, description, username, email, contact, address, image, userId }), { message: "Store created successfully" }, { status: 201 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message } || "Something went wrong"), { status: error.code })
    }
}


//check if user has already register  store and if yes then send the status of store 

export const GET = async (req) => {
    try {
        const { userId } = getAuth(req);
        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        })
        if (!store) {
            return new NextResponse(JSON.stringify({ error: "You don't have any store" }), { status: store.status })
        }
        return new NextResponse(JSON.stringify(store), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message } || "Something went wrong"), { status: error.code })
    }
}