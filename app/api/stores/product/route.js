import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const formData = await req.formData();
        const storeId = await authSeller(userId)

        if (storeId) {
            return NextResponse.json({ storeId }, { status: 200 })
        }

        const name = formData.get('name');
        const category = formData.get('category');
        const price = Number(formData.get('price'));
        const mrp = Number(formData.get('mrp'));
        const images = formData.getAll('images');
        const description = formData.get('description');

        //all filed check 
        if (!name || !price || images.length < 1 || !description || !category || !mrp) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        // uploading multiple images in imagekit and getting url
        const imageUrls = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products"

            })

            const url = imagekit.url({
                path: response.filepath,
                transformations: [

                    {
                        quality: auto
                    },
                    {
                        format: webp
                    },
                    {
                        width: '1024'
                    }
                ]
            })
            return url;
        }));

        // every thing fine then store the complete data 
        await prisma.product.create({
            data: {
                name,
                description,
                category,
                price,
                mrp,
                images: imageUrls,
                storeId
            }
        })

        return NextResponse.json({ message: "Product created successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 || error.code })
    }
}


export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: "You don't have any store" }, { status: 400 })
        }

        const products = await prisma.product.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json({ products }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 || error.code })
    }
}