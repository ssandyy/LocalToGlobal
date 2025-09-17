import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import authAdmin from "./middleware/authAdmin"

// Approve seller store
export async function POST(req) {
    try {

        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        const { status, storeId } = await req.json()

        if (status == 'approved') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "approved", approvedAt: new Date(), isActive: true }
            })
        } else if (status == 'rejected') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "rejected", rejectedAt: new Date() }
            })
        }

        return NextResponse.json({ status: status + "success" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


// get all pending and rejected store

export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        const store = await prisma.store.findMany({
            where: { status: { in: ["pending", "rejected"] } },
            include: { user: true }
        })
        return NextResponse.json({ store }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}