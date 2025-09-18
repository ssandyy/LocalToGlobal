'use client'
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

const AdminNavbar = () => {
    const { user } = useUser()

    console.log("user data:", user);
    console.log("user firstName:", user.firstName);



    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/" className="relative text-2xl font-semibold text-slate-700">
                <span className="text-green-600">Local</span>To<span className="text-green-600 text-2xl leading-0">Global</span>
                <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p>Hi, {user?.firstName}</p>
                <UserButton />
            </div>
        </div>
    )
}

export default AdminNavbar