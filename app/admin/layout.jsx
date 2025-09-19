import AdminLayout from "@/components/admin/AdminLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";



export const metadata = {
    title: "LocalToGlobal. - Admin",
    description: "LocalToGlobal. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <SignedIn>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-2xl sm:text-4xl font-semibold m-2 text-slate-400">You are not authorized to access this page</h1>
                    <hr />
                    <SignIn fallbackRedirectUrl="/" routing="hash" />
                </div>
            </SignedOut>
        </>
    );
}
