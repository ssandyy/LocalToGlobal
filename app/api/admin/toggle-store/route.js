import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import authSeller from "./middleware/authSeller"

// Toggle store active and inActive
export async function POST(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        const storeId = await authSeller(userId)
        if (!storeId) {
            return NextResponse.json({ error: "You don't have any store" }, { status: 400 })
        }

        const store = await prisma.store.findUnique({ where: { id: storeId } })
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 })
        }

        await prisma.store.update({
            where: { id: storeId },
            data: { isActive: !store.isActive }
        })
        return NextResponse.json({ message: "Store status updated successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}