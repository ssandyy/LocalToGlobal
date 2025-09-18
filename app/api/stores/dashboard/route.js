// get Dashboard data for sellers (total products, total revenue, total orders, total stores, total ratings, total earnings)

import prisma from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const storeId = await authSeller(userId)
        if (!storeId) {
            return NextResponse.json({ error: "You don't have any store" }, { status: 400 })
        }

        const orders = await prisma.order.findMany({
            where: { storeId }
        })

        const products = await prisma.product.findMany({
            where: { storeId }
        })

        const rating = await prisma.rating.findMany({
            where: {
                productId: {
                    in: products.map(product => product.id)
                }
            },
            include: {
                user: true,
                product: true
            }
        })

        const dashboardData = {
            products: products.length,
            revenue: orders.reduce((total, order) => total + order.totalPrice, 0),
            orders: orders.length,
            stores: stores.length,
            ratings: rating,
            totalEarnings: rating.reduce((total, rating) => total + rating.rating, 0)
        }

        return NextResponse.json({ dashboardData }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}