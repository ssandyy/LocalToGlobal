'use client'

import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
