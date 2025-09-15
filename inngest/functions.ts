import prisma from "@/lib/prisma";
import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//     { id: "hello-world" },
//     { event: "test/hello.world" },
//     async ({ event, step }) => {
//         await step.sleep("wait-a-moment", "1s");
//         return { message: `Hello ${event.data.email}!` };
//     },
// );


export const SyncUserCreation = inngest.createFunction(
    { id: 'Sync-User-Creation' },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })
    }
)

export const SyncUserUpdation = inngest.createFunction(
    { id: 'Sync-User-Updation' },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })
    }
)

export const SyncUserDeletion = inngest.createFunction(
    { id: 'Sync-User-Deletion' },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event
        await prisma.user.delete({
            where: {
                id: data.id
            }
        })
    }
)