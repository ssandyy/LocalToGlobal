import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middleware/authAdmin";



// Get Dashboard data  for admin (total products, total revenue, total orders, total stores, total ratings, total earnings)

export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        // get total order
        const Orders = await prisma.order.count()

        // get total products
        const products = await prisma.product.count()

        // get total stores
        const stores = await prisma.store.count()

        // get total revenue
        const allOrders = await prisma.order.findMany({
            select: {
                createdAt: true,
                total: true
            }
        })

        // get total earnings/revenue
        let totalRevenue = 0;
        allOrders.forEach(order => {
            totalRevenue += order.total
        })
        const revenue = totalRevenue.toFixed(2)

        const dashboardData = {
            orders: Orders,
            products: products,
            stores: stores,
            revenue: revenue,
            allOrders: allOrders
        }
        return NextResponse.json({ dashboardData }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}