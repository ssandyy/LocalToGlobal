'use client'
import { useAuth } from "@clerk/nextjs"
import { Skeleton } from "@mui/material"
import axios from "axios"
import { format } from "date-fns"
import { DeleteIcon, Search, TicketPercent } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminCoupons() {
    const { getToken } = useAuth()

    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    })

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(search.toLowerCase()) ||
        coupon.description.toLowerCase().includes(search.toLowerCase())
    )

    const fetchCoupons = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/coupon', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCoupons(data?.coupons || [])
        } catch (error) {
            return toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken()
            newCoupon.discount = Number(newCoupon.discount)
            newCoupon.expiresAt = new Date(newCoupon.expiresAt)

            const { data } = await axios.post('/api/admin/coupon', { coupon: newCoupon }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message)
            await fetchCoupons()

            setNewCoupon({
                code: '',
                description: '',
                discount: '',
                forNewUser: false,
                forMember: false,
                isPublic: false,
                expiresAt: new Date()
            })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const deleteCoupon = async (code) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this coupon?")
            if (!confirm) return

            const token = await getToken()
            const { data } = await axios.delete(`/api/admin/coupon?code=${code}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message)
            await fetchCoupons()
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    return (
        <div className="text-slate-700 mb-40 p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-6">

            {/* Add Coupon - Left side 30% */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 lg:col-span-3">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                    <TicketPercent className="w-6 h-6 text-indigo-600" />
                    Add Coupon
                </h2>
                <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="mt-6 grid gap-4">
                    <input type="text" placeholder="Coupon Code" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" name="code" value={newCoupon.code} onChange={handleChange} required />
                    <input type="number" placeholder="Discount (%)" min={1} max={100} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" name="discount" value={newCoupon.discount} onChange={handleChange} required />

                    <input type="text" placeholder="Description" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" name="description" value={newCoupon.description} onChange={handleChange} required />

                    <div>
                        <label className="block mb-1 font-medium">Expiry Date</label>
                        <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" name="expiresAt" value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="forNewUser" checked={newCoupon.forNewUser} onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })} className="w-4 h-4" />
                            <span>For New Users</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="forMember" checked={newCoupon.forMember} onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })} className="w-4 h-4" />
                            <span>For Members</span>
                        </label>
                    </div>

                    <button className="mt-2 p-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition active:scale-95">Add Coupon</button>
                </form>
            </div>

            {/* List Coupons - Right side 70% */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 lg:col-span-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">Coupons List</h2>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search Coupons" className="w-full pl-10 pr-3 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {search && (
                    <p className="mt-2 text-sm text-slate-500">
                        Showing {filteredCoupons.length} of {coupons.length} coupons
                    </p>
                )}

                <div className="overflow-y-auto mt-6 rounded-lg border border-slate-200"
                    style={{ maxHeight: "500px" }}>
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                {["Code", "Description", "Discount", "Expires At", "New User", "Member", "Action"].map((head) => (
                                    <th key={head} className="py-3 px-4 text-left font-semibold text-slate-600">{head}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {filteredCoupons.length > 0 || loading ? (
                                Array.from({ length: loading ? 5 : filteredCoupons.length }).map((_, index) => {
                                    const coupon = loading ? null : filteredCoupons[index];

                                    return (
                                        <tr key={loading ? index : coupon.code} className="hover:bg-slate-50 transition">
                                            <td className="py-3 px-4 font-medium text-slate-800">
                                                {loading ? <Skeleton variant="text" animation="wave" /> : coupon.code}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loading ? <Skeleton variant="text" animation="wave" /> : coupon.description}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loading ? <Skeleton variant="text" animation="wave" /> : `${coupon.discount}%`}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loading ? <Skeleton variant="text" animation="wave" /> : format(new Date(coupon.expiresAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loading ? <Skeleton variant="text" animation="wave" /> : (coupon.forNewUser ? 'Yes' : 'No')}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loading ? <Skeleton variant="text" animation="wave" /> : (coupon.forMember ? 'Yes' : 'No')}
                                            </td>
                                            <td className="py-3 px-4">
                                                {loading ? <Skeleton variant="circular" width={20} height={20} animation="wave" /> : (
                                                    <DeleteIcon onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Deleting coupon..." })} className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" />
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-6 px-4 text-center text-slate-500">
                                        {search ? 'No coupons found matching your search' : 'No coupons available'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
