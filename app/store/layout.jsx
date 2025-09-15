import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "LocalToGlobal. - Store Dashboard",
    description: "LocalToGlobal. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
