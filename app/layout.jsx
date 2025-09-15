
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "LocalToGlobal",
    description: "Shop smarter - Local to Global Reach",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <Toaster />
                        {children}
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
