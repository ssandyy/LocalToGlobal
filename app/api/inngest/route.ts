import { CouponExpiry, SyncUserCreation, SyncUserDeletion, SyncUserUpdation } from "@/inngest/functions";
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";



// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        SyncUserCreation,
        SyncUserUpdation,
        SyncUserDeletion,
        CouponExpiry
    ],
});