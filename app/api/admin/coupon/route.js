import prisma from "@/lib/prisma"
import authAdmin from "@/middleware/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"




// Add new coupon
export async function POST(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        const { coupon } = await req.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({ data: coupon })

        return NextResponse.json({ coupon, message: "Coupon created successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        const coupons = await prisma.coupon.findMany({})
        return NextResponse.json({ coupons }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not authorised to access..!" }, { status: 401 })
        }

        const { searchParams } = req.nextUrl;

        const code = searchParams.get('code')
        await prisma.coupon.delete({
            where: { code: code }
        })

        return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}