import prisma from "@/lib/prisma"
import authAdmin from "@/middleware/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Toggle store active and inActive - ADMIN ENDPOINT
export async function POST(req) {
    try {
        console.log("Toggle store endpoint hit")

        const { userId } = getAuth(req)
        console.log("User ID:", userId)

        const isAdmin = await authAdmin(userId)
        console.log("Is admin:", isAdmin)

        if (!isAdmin) {
            console.log("User is not admin")
            return NextResponse.json({ error: "You are not authorized to access this resource" }, { status: 401 })
        }

        // Get the storeId from the request body
        const body = await req.json()
        console.log("Request body:", body)

        const { storeId } = body

        if (!storeId) {
            console.log("No storeId provided")
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
        }

        console.log("Looking for store:", storeId)
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        })

        console.log("Store found:", store)

        if (!store) {
            console.log("Store not found")
            return NextResponse.json({ error: "Store not found" }, { status: 404 })
        }

        // Toggle the isActive status
        console.log("Toggling isActive from:", store.isActive, "to:", !store.isActive)
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { isActive: !store.isActive }
        })

        console.log("Store updated successfully:", updatedStore)
        return NextResponse.json({
            message: "Store status updated successfully",
            isActive: updatedStore.isActive
        }, { status: 200 })

    } catch (error) {
        console.error("Toggle store error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}