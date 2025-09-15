'use client'
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { DoorClosedIcon, Search, ShoppingCart, User2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const { user } = useUser();
    const router = useRouter();
    const { openSignIn } = useClerk();
    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">
                    <Link href="/" className="relative text-2xl font-semibold text-slate-700">
                        <span className="text-green-600">Local</span>To<span className="text-green-600 text-2xl leading-0">Global</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-purple-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {!user ?
                            (
                                <button onClick={openSignIn} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Login
                                </button>

                            ) : (
                                <UserButton >

                                    <UserButton.MenuItems>
                                        {/* <UserButton.Action label="My Profile" labelIcon={<User2Icon size={18} />} onClick={() => router.push('/profile')}> Profile</UserButton.Action> */}
                                        <UserButton.Action label="My Orders" labelIcon={<ShoppingCart size={18} />} onClick={() => router.push('/orders')} />
                                        {/* <UserButton.Action label="Logout" labelIcon={<DoorClosedIcon size={18} />} onClick={() => router.push('/logout')} /> */}
                                    </UserButton.MenuItems>
                                </UserButton>
                            )
                        }

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        {user ? (<UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label="My Profile" labelIcon={<User2Icon size={18} />} onClick={() => router.push('/profile')} />
                                <UserButton.Action label="My Orders" labelIcon={<ShoppingCart size={18} />} onClick={() => router.push('/orders')} />
                                <UserButton.Action label="Logout" labelIcon={<DoorClosedIcon size={18} />} onClick={() => router.push('/logout')} />
                            </UserButton.MenuItems>
                        </UserButton>) : (
                            <button className="px-5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Login
                            </button>
                        )}

                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar