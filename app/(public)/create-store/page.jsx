'use client'
import { assets } from "@/assets/assets"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function CreateStore() {
    const { user } = useUser()
    const router = useRouter()
    const { getToken } = useAuth()
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const [errors, setErrors] = useState({})

    const validateForm = () => {
        let valid = true
        const newErrors = {}

        if (!storeInfo.name.trim()) {
            newErrors.name = "Store name is required"
            valid = false
        }

        if (!storeInfo.username.trim()) {
            newErrors.username = "Username is required"
            valid = false
        }

        if (!storeInfo.description.trim()) {
            newErrors.description = "Description is required"
            valid = false
        } else if (storeInfo.description.length < 20) {
            newErrors.description = "Description should be at least 20 characters"
            valid = false
        }

        if (!storeInfo.email.trim()) {
            newErrors.email = "Email is required"
            valid = false
        } else if (!/^\S+@\S+\.\S+$/.test(storeInfo.email)) {
            newErrors.email = "Please enter a valid email address"
            valid = false
        }

        if (!storeInfo.contact.trim()) {
            newErrors.contact = "Contact number is required"
            valid = false
        }

        if (!storeInfo.address.trim()) {
            newErrors.address = "Address is required"
            valid = false
        }

        if (!storeInfo.image) {
            newErrors.image = "Store logo is required"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setStoreInfo({ ...storeInfo, [name]: value })

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const fetchSellerStatus = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/stores/create", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // Check if data exists and has a status property
            if (data && data.status) {
                setAlreadySubmitted(true)
                setStatus(data.status)

                // Convert to lowercase for comparison
                const statusLower = data.status.toLowerCase();

                switch (statusLower) {
                    case 'approved':
                        setMessage("Your store has been approved. You can now start selling your products.")
                        setTimeout(() => router.push('/store'), 5000)
                        break;
                    case 'pending':
                        setMessage("Your store is under review. You will be notified once it is approved.")
                        break;
                    case 'rejected':
                        setMessage("Your store has been rejected. Please try again with correct details.")
                        break;
                    default:
                        // Handle unexpected status values
                        setMessage(`Current status: ${data.status}`)
                        break;
                }
            } else {
                setAlreadySubmitted(false)
            }
        } catch (error) {
            console.error("Error fetching seller status:", error)
            // Handle 404 specifically (no store exists)
            if (error.response?.status === 404) {
                setAlreadySubmitted(false)
            } else {
                toast.error(error?.response?.data?.message || error.message || "Failed to fetch store status")
            }
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("Please fix the errors in the form")
            return
        }

        if (!user) {
            return toast.error("You need to be logged in to submit your store.")
        }

        setIsSubmitting(true)
        try {
            const token = await getToken()
            const formData = new FormData()
            formData.append("name", storeInfo.name)
            formData.append("username", storeInfo.username)
            formData.append("description", storeInfo.description)
            formData.append("email", storeInfo.email)
            formData.append("contact", storeInfo.contact)
            formData.append("address", storeInfo.address)
            formData.append("image", storeInfo.image)

            const { data } = await axios.post("/api/stores/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            toast.success(data.message)
            await fetchSellerStatus() // This should now correctly update the status

        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to create store")
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSellerStatus()
        }
    }, [user])

    if (!user) {
        return (
            <div className="mx-6 min-h-[70vh] my-16">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-slate-500">
                    <h1 className="text-3xl ">You need to be logged in first, to create your store..!</h1>
                </div>
            </div>
        )
    }

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={onSubmitHandler} className="max-w-3xl mx-auto flex flex-col items-start gap-4 text-slate-600">
                        {/* Title */}
                        <div className="w-full mb-4">
                            <h1 className="text-3xl font-bold text-slate-800">Create Your Store</h1>
                            <p className="mt-2 max-w-lg">To become a seller on LocalToGlobal, submit your store details for review. Your store will be activated after admin verification.</p>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium">
                                        Store Logo <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Image
                                                src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area}
                                                className="rounded-lg h-24 w-24 object-cover border-2 border-dashed border-slate-300"
                                                alt="Store logo preview"
                                                width={96}
                                                height={96}
                                            />
                                            {storeInfo.image && (
                                                <button
                                                    type="button"
                                                    onClick={() => setStoreInfo({ ...storeInfo, image: "" })}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <div>
                                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors">
                                                Choose Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
                                        </div>
                                    </div>
                                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="username"
                                        onChange={onChangeHandler}
                                        value={storeInfo.username}
                                        type="text"
                                        placeholder="e.g. mystore123"
                                        className={`border ${errors.username ? 'border-red-500' : 'border-slate-300'} outline-slate-400 w-full p-3 rounded-lg`}
                                    />
                                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Store Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        onChange={onChangeHandler}
                                        value={storeInfo.name}
                                        type="text"
                                        placeholder="Enter your store name"
                                        className={`border ${errors.name ? 'border-red-500' : 'border-slate-300'} outline-slate-400 w-full p-3 rounded-lg`}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="email"
                                        onChange={onChangeHandler}
                                        value={storeInfo.email}
                                        type="email"
                                        placeholder="store@example.com"
                                        className={`border ${errors.email ? 'border-red-500' : 'border-slate-300'} outline-slate-400 w-full p-3 rounded-lg`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="contact"
                                        onChange={onChangeHandler}
                                        value={storeInfo.contact}
                                        type="text"
                                        placeholder="+1 234 567 8900"
                                        className={`border ${errors.contact ? 'border-red-500' : 'border-slate-300'} outline-slate-400 w-full p-3 rounded-lg`}
                                    />
                                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        onChange={onChangeHandler}
                                        value={storeInfo.description}
                                        rows={4}
                                        placeholder="Tell us about your store, products, and what makes it special..."
                                        className={`border ${errors.description ? 'border-red-500' : 'border-slate-300'} outline-slate-400 w-full p-3 rounded-lg resize-none`}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        onChange={onChangeHandler}
                                        value={storeInfo.address}
                                        rows={3}
                                        placeholder="Enter your complete store address"
                                        className={`border ${errors.address ? 'border-red-500' : 'border-slate-300'} outline-slate-400 w-full p-3 rounded-lg resize-none`}
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-slate-800 disabled:bg-slate-500 text-white px-8 py-3 rounded-lg mt-6 mb-20 active:scale-95 hover:bg-slate-900 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : "Submit Store Application"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-2xl text-center">
                        <div className={`rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 ${status === "approved" ? "bg-green-100 text-green-600" :
                            status === "pending" ? "bg-amber-100 text-amber-600" :
                                "bg-red-100 text-red-600"
                            }`}>
                            {status === "approved" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : status === "pending" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            {status === "approved" ? "Store Approved!" :
                                status === "pending" ? "Application Under Review" :
                                    "Application Rejected"}
                        </h2>
                        <p className="text-slate-600 mb-6">{message}</p>

                        {status === "rejected" && (
                            <button
                                onClick={() => {
                                    setAlreadySubmitted(false)
                                    setStatus("")
                                }}
                                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                            >
                                Try Again
                            </button>
                        )}

                        {status === "approved" && (
                            <div className="mt-4 text-slate-500 text-sm">
                                <p>Redirecting to your store dashboard in <span className="font-semibold">5 seconds</span></p>
                                <button
                                    onClick={() => router.push('/store')}
                                    className="text-slate-800 underline mt-2"
                                >
                                    Go now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    ) : (<Loading />)
}

export const dynamic = 'force-dynamic'