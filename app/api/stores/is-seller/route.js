import { prisma } from "@/lib/prisma";
import authSeller from "@/middleware/authSeller.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ error: "You don't have any store, Not Authorized to access" }, { status: 401 })
        }

        const storeInfo = await prisma.store.findUnique({ where: { userId } })

        return NextResponse.json({ storeInfo, isSeller }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}