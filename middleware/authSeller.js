import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const authSeller = async (req) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            include: {
                store: true
            }
        })

        if (user.store) {
            if (user.store.status === 'approved') {
                return user.store.id
            }
            return false
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export default authSeller;