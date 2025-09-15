import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "LocalToGlobal. - Admin",
    description: "LocalToGlobal. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
