import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { productId } = await request.json();

        // const formData = await request.formData();
        // const productId = formData.get('productId');
        // const inStock = formData.get('stock');

        if (!productId || !stock) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        //check if user have store
        const storeId = await authSeller(userId)
        if (!storeId) {
            return NextResponse.json({ error: "You don't have any store" }, { status: 400 })
        }

        //check if product exist
        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                inStock: !product.inStock
            }
        })

        return NextResponse.json({ message: "Stock updated successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 || error.code })
    }
};