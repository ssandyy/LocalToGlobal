import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {


    try {
        if (!userId) return false;

        // if user is admin
        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        // return user.roles.includes('admin')

        // if email is added in admin email list 
        return process.env.ADMIN_EMAILS.includes(user.emailAddresses[0], emailAddresses)
    } catch (error) {
        console.log(error);
        return false
    }
}
export default authAdmin