import { clerkClient, currentUser } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {


    try {
        if (!userId) return false;

        // Prefer currentUser(); fall back to clerkClient if available
        let user = await currentUser()
        if (!user && clerkClient?.users?.getUser) {
            user = await clerkClient.users.getUser(userId)
        }

        const primaryId = user?.primaryEmailAddressId
        const primaryObj = user?.emailAddresses?.find((e) => e.id === primaryId)
        const primaryEmail = (primaryObj?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "").trim().toLowerCase()

        // Support either ADMIN_EMAIL (single) or ADMIN_EMAILS (comma-separated)
        const single = (process.env.ADMIN_EMAIL || "").trim()
        const list = (process.env.ADMIN_EMAILS || "").trim()

        const adminEmails = [single, ...list.split(",")]
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean)

        if (adminEmails.length === 0) return false

        return adminEmails.includes(primaryEmail)

    } catch (error) {
        console.log(error);
        return false
    }
}
export default authAdmin