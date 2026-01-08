import { useEffect, useState } from "react";
import backgroundImage from "../../src/assets/backround_borrower_lon_status.jpg"

import { Loader, CircleX, BriefcaseBusiness, User, IndianRupee, CheckCircle } from "lucide-react"
const LoanStatus = () => {
    const [yourLoanStatus, setYourLoanStatus] = useState()

    useEffect(() => {

        const fetchData = async () => {
            const token = localStorage.getItem("token")

            try {
                const res = await fetch("http://localhost:3000/loan-status", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                const data = await res.json()
                const { user } = data;

                setYourLoanStatus(user)

            } catch (err) {
                console.log(err)
            }

        }
        fetchData();

    }, [])
    return (
        <>

            <div className={`w-full ${yourLoanStatus?.length > 1 ? "h-auto" : "h-[92vh]"} relative  min-[954px]:h-[92vh] overflow-hidden `}>
                {(!yourLoanStatus) && <p>Loading...</p>}
                <div className="flex justify-center  z-10 absolute w-full ">
                    <h1 className="text-blue-600 text-3xl sm:text-4xl md:text-5xl font-[poppins] font-bold py-10 text-center">Loan Application Status</h1>
                </div>
                <div className="relative flex flex-wrap  flex-row justify-center gap-10  pt-32 ">

                    {yourLoanStatus?.map((Item, index) => (

                        <div key={index} className="  h-full w-full min-[450px]:w-10/12 rounded-3xl sm:w-[460px] shadow-2xl z-10 bg-white mb-5  ">
                            <div className="overflow-hidden  p-3  ">

                                <div className="flex flex-col gap-4 py-5 px-3 flex-wrap">
                                    <div className="text-base font-medium flex tracking-wide">
                                        <span className="text-black mr-1">Name:</span> <h1 className="text-cyan-500 "> {Item.first_name} {Item.last_name}</h1>
                                    </div>
                                    <div className="text-base font-medium">
                                        <h1 className="text-cyan-500"> <span className="text-black">Application Date:</span> {Item.submitted_at ? new Date(Item.submitted_at).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}</h1>
                                    </div>

                                    <div className="text-base font-medium">
                                        <h1 className="text-gray-200 flex items-center">
                                            <span className="text-black mr-2">Loan Status:</span>

                                            {Item.loan_status === "pending" && (
                                                <><div className="bg-yellow-100 py-1.5 px-2.5 rounded-3xl  flex items-center">
                                                    <Loader className="text-yellow-600 animate-spin inline-block" size={20} aria-label="pending" />

                                                    <span className="ml-1 capitalize text-yellow-600 pb-1">
                                                        {Item.loan_status}
                                                    </span>
                                                </div>
                                                </>
                                            )}
                                            {Item.loan_status === "approved" && (
                                                <>
                                                    <div className="bg-green-100 overflow-hidden flex items-center  rounded-3xl px-2 py-1.5">
                                                        <CheckCircle className="text-green-500 inline-block" size={20} aria-label="approved" strokeWidth={3} />
                                                        <span className="ml-1 capitalize text-green-500 block pb-1">
                                                            {Item.loan_status}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                            {Item.loan_status === "rejected" && (
                                                <>
                                                    <div className="bg-red-500 overflow-hidden flex items-center brightness-110 rounded-3xl px-2 py-1.5">
                                                        <CircleX className="text-white inline-block" strokeWidth={3} size={20} aria-label="rejected" />
                                                        <span className="ml-1 capitalize text-white pb-1">
                                                            {Item.loan_status}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                        </h1>
                                    </div>
                                </div>
                                <div className="flex flex-col py-5 justify-between px-3 flex-wrap gap-4">
                                    <div className="text-base font-medium">
                                        <ul>
                                            {Item.loan_status === "approved" && (
                                                <li className="">Approved on: <span className="text-green-400 brightness-110">{Item.decision_at ? new Date(Item.decision_at).toLocaleString(undefined, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: '2-digit' }) : ''}</span></li>
                                            )}
                                            {Item.loan_status === "rejected" && (
                                                <li className="">Rejected on: <span className="text-red-500">{Item.decision_at ? new Date(Item.decision_at).toLocaleString(undefined, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: '2-digit' }) : ''}</span></li>
                                            )}
                                            {Item.loan_status === "pending" && (
                                                <li className="list-disc brightness-110 list-inside text-yellow-500 text-lg">Your loan application is under review</li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="text-base font-medium">
                                        <h1><span className="text-black">Loan type:</span>
                                            {Item.loan_type == "Business" && (<BriefcaseBusiness className="inline-block mx-2 text-blue-500" />)}
                                            {Item.loan_type == "Personal" && (<User className="inline-block mx-2 text-green-500" />)}
                                            {Item.loan_type == "Personal" && <span className="text-green-400">{Item.loan_type}</span>}
                                            {Item.loan_type == "Business" && <span className="text-blue-500">{Item.loan_type}</span>}
                                        </h1>
                                    </div>
                                    <div className="text-base font-medium ">
                                        <h1><span className="text-black">Your loan amount:</span>
                                            <IndianRupee className="inline-block mx-1 text-black" size={18} />
                                            <span className="text-green-500">{Item.loan_amount}</span>

                                        </h1>
                                    </div>
                                </div>
                            </div>

                        </div >

                    ))

                    }
                </div>

                <img src={backgroundImage} className="absolute inset-0 w-full h-full object-cover z-0" />

            </div>

        </>
    )
}
export default LoanStatus;