import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET() {
    try {
        //get store username from query param 
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username').toLowerCase();

        if (!username) {
            return NextResponse.json({ error: "missing username..!" }, { status: 400 })
        }


        //get storeinfo, inStock, products with rating
        const store = await prisma.store.findUnique({
            where: {
                username
            },
            include: {
                products: {
                    include: {
                        inStock: true,
                        rating: true
                    }
                }
            }
        })

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 })
        }

        return NextResponse.json({ store }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}