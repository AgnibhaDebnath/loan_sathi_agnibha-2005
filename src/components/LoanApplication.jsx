import { useContext, useEffect, useState } from "react";
import { Loader, Check, X, Phone, CircleX, ChevronsLeft, ChevronsRight, IndianRupee, CalendarDays, User } from "lucide-react";
import { ModelContext } from "@/Contaxt/ModelContext";
import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select"
import { Button } from "./ui/button";
import useStore from "../Store/store"
import { toast, ToastContainer } from "react-toastify";

const LoanApplications = () => {
    const [loanApplications, setLoanApplications] = useState([]);
    const { popUp, setPopUp } = useContext(ModelContext)

    const [message, setmessage] = useState(null)

    const [number, setnumber] = useState(null)

    const [statusFilter, setStatusFilter] = useState("")
    const [loanTypeFilter, setLoanTypeFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const [statusUpdated, setStatusUpdated] = useState(false)

    const calculateCounts = (count) => {

        const pending = count.pending[0]["COUNT(*)"]
        const approved = count.approved[0]["COUNT(*)"]
        const rejected = count.rejected[0]["COUNT(*)"]

        setTotalPage((pending + approved + rejected) / 2)

        useStore.getState().setApplicationCount({
            pending,
            approved,
            rejected
        })
    }
    useEffect(() => {

        const token = localStorage.getItem("token")
        const loan_application_per_page = 2
        const skip = (currentPage - 1) * loan_application_per_page
        fetch(`http://localhost:3000/loan-application?limit=${loan_application_per_page}&skip=${skip}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ statusFilter, loanTypeFilter })


        })
            .then(res => res.json())
            .then(data => {
                console.log("Fetched loan data:", data); // ✅ should show actual data
                const { loans, count } = data;

                setLoanApplications(loans)
                calculateCounts(count)
            })
            .catch(err => {
                console.error("Fetch error:", err);
            }).finally(() => {
                setStatusUpdated(false)
            })
    }, [currentPage, statusFilter, loanTypeFilter, statusUpdated]);



    const updateStatus = async (permission) => {
        if (permission) {
            try {
                const res = await fetch("http://localhost:3000/update-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        number,
                        status: message,
                    }),
                });
                const data = await res.json()
                const { successMessage } = data
                setPopUp(false)
                setStatusUpdated(true)
                toast.success(successMessage, {
                    autoClose: 5000,
                    theme: "light",
                    position: "top-center",
                    toastId: "statusUpdateMessage"
                })

            } catch (err) {
                setPopUp(true);
                console.error("Update error:", err);
            }
        } else {
            setPopUp(false)
            setmessage(null)
            return
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col items-center mt-3 py-3 bg-gradient-to-r from-gray-100 via-white to-gray-100 ">
                <div className="p-5  rounded-3xl mx-4 md:w-3/4 w-11/12 shadow-2xl bg-white">
                    <div className="flex flex-col items-center my-2 gap-3 ">
                        <h2 className=" text-xl md:text-4xl font-bold mb-4 tracking-wide inline-block text-center bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text brightness-110 font-[poppins]"><span className="text-3xl animate-pulse text-red-500 pb-1 ">🔴</span>Live Loan Applications</h2>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="sm:w-80 w-72
               font-medium rounded-3xl 
               bg-white/10 backdrop-blur-md text-gray-600
               hover:bg-white/20 
               transition-all duration-200 outline-none shadow-2xl ">
                                <SelectValue placeholder="Loan status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-white/30 bg-black/80 backdrop-blur-md shadolg">
                                <SelectGroup>
                                    <SelectLabel className="font-medium text-gray-300 px-2 py-1 ">Select loan status</SelectLabel>
                                    <SelectItem value="pending" className="font-medium text-yellow-300 hover:bg-yellow-400/10 rounded-md px-2 py-2 transition-colors">pending</SelectItem>
                                    <SelectItem value="approved" className="font-medium text-green-500 hover:bg-green-500/10 rounded-md px-2 py-2 transition-colors">Approved</SelectItem>
                                    <SelectItem value="rejected" className="font-medium text-red-500 hover:bg-red-500/10 rounded-md px-2 py-2 transition-colors">Rejected</SelectItem>
                                </SelectGroup>
                            </SelectContent>

                        </Select>
                        <Button onClick={() => setStatusFilter("")} className="bg-gradient-to-r from-yellow-400 to-red-500  px-6 hover:scale-x-105 transition duration-200">Reset Status filter</Button>
                        <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                            <SelectTrigger className="sm:w-80 w-72
               font-medium rounded-3xl 
               bg-white/10 backdrop-blur-md 
               hover:bg-white/20 focus:ring-2
               transition-all duration-200 outline-none shadow-2xl ">
                                <SelectValue placeholder="Loan type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-white/20 bg-black/80 backdrop-blur-md shadow-lg ">
                                <SelectGroup>
                                    <SelectLabel className="font-medium text-white ">Select loan type</SelectLabel>
                                    <SelectItem value="Personal" className="font-medium text-white">Parsonal</SelectItem>
                                    <SelectItem value="Business" className="font-medium text-white">Business</SelectItem>

                                </SelectGroup>
                            </SelectContent>

                        </Select>
                        <Button onClick={() => setLoanTypeFilter("")} className="bg-gradient-to-r from-pink-400 to-red-500  hover:scale-105 transition duration-200">Reset loan type filter</Button>
                    </div >
                    <div className="p-4 border-2 rounded-3xl border-gray-400">
                        <div className="overflow-x-auto w-full">
                            <table className=" border-collapse border-2 border-green-200 min-w-[890px] w-full ">
                                <thead className="bg-gradient-to-r from-teal-500 to-cyan-500  brightness-125">
                                    <tr  >
                                        <th className="border-r border-gray-300 p-2 text-left text-base font-bold font-[poppins]">Name</th>
                                        <th className="border-r border-gray-300 p-2 text-left text-base font-bold font-[poppins]">Type</th>
                                        <th className="border-r border-gray-300 p-2 text-left text-base font-bold font-[poppins]">Amount</th>
                                        <th className="border-r border-gray-300 p-2 text-left text-base font-bold font-[poppins]">Status</th>
                                        <th className="border-r border-gray-300 p-2 text-lefttext-base font-bold font-[poppins] ">Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        loanApplications.length === 0 ? (
                                            <tr>
                                                <td className="p-4 text-center" colSpan={5}>
                                                    No loan application found
                                                </td>
                                            </tr>
                                        ) : [...loanApplications].reverse().map((loan) => (

                                            <tr key={loan.id} className="border text-gray-800">
                                                <td className="border-r  border-gray-300 p-2 text-left text-base font-medium"><span className="block">
                                                    <User className="inline" />{loan.first_name} {loan.last_name}
                                                </span>
                                                    <span className="block"><Phone className="inline-block text-green-500" size={18} />{loan.mobile_no}</span>
                                                </td>
                                                <td className="border-r border-gray-300 p-2 text-left text-base font-medium bg-gray-100">{loan.loan_type}</td>
                                                <td className="border-r border-gray-300 p-2 text-left text-base font-medium"><span><IndianRupee className="inline " size={17} strokeWidth={2.5} /></span>{loan.loan_amount}</td>
                                                <td className="border-r border-gray-300 p-2 text-left text-base font-medium bg-gray-100">
                                                    {(loan.loan_status == "pending") && (<><Loader className="inline-block animate-spin brightness-110 text-yellow-400 " strokeWidth={2.5} />  <span className="text-yellow-400">{loan.loan_status}</span></>)}

                                                    {(loan.loan_status == "approved") && (<>  <span className="text-green-500"><Check className="inline" />Approved on<span className="ml-1">:</span><span className="text-blue-500 ml-1">{loan.decision_at ? new Date(loan.decision_at).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}</span></span></>)}

                                                    {(loan.loan_status == "rejected") && (<>  <span className="text-red-500">
                                                        <CircleX className="inline text-red-500 mx-1" />Rejected on<span className="ml-1">:</span><span className="text-blue-500 ml-1">{loan.decision_at ? new Date(loan.decision_at).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span></span></>)}
                                                    <br />

                                                    <CalendarDays className="inline mx-1" size={20} strokeWidth={2.6} />Application date<span className="mx-1">:</span> {loan.submitted_at ? new Date(loan.submitted_at).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                                                </td>
                                                <td className="p-2 ">
                                                    {loan.loan_status == "pending" && (
                                                        <>
                                                            <Button
                                                                onClick={() => {
                                                                    setmessage("approved")
                                                                    setPopUp(true)
                                                                    setnumber(loan.mobile_no)
                                                                }}
                                                                name="approve"
                                                                className="bg-gradient-to-r from-emerald-500 to-green-500 my-2 text-white font-medium px-2 py-1.5 rounded-md mr-2 hover:scale-105 transition duration-150"
                                                            >
                                                                <Check className="inline" strokeWidth={3} />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setmessage("rejected")
                                                                    setPopUp(true)
                                                                    setnumber(loan.mobile_no)
                                                                }}
                                                                name="reject"
                                                                className="bg-gradient-to-r from-yellow-400 to-red-500 text-white  font-medium px-4 py-1.5 rounded-md hover:scale-105 transition duration-150"
                                                            >
                                                                <CircleX className="inline" strokeWidth={3} />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {loan.loan_status === "approved" &&
                                                        (<p
                                                            // onClick={() => approveLoan(loan.id)}
                                                            className="bg-gray-700 my-2 text-green-500 font-medium px-3 py-2 rounded-full mr-2 cursor-text flex justify-center items-center "
                                                        >
                                                            <Check className="block" strokeWidth={3} />
                                                            <span className="block">Approved</span>

                                                        </p>)
                                                    }
                                                    {loan.loan_status === "rejected" &&
                                                        (<p
                                                            // onClick={() => approveLoan(loan.id)}
                                                            className="bg-gray-700 my-2 text-red-500 rounded-full font-medium px-3 py-2  mr-2 flex justify-center cursor-text"
                                                        >
                                                            <CircleX className="block" strokeWidth={3} />
                                                            <span className="block mx-1 ">Rejected</span>
                                                        </p>)
                                                    }
                                                </td>
                                            </tr>



                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">
                        <div className="flex justify-center gap-6 my-4 py-5 w-96 px-6 shadow-2xl">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="bg-gray-800 text-white rounded-md px-4 py-1 font-medium  shadow-sm hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentPage === 1} > <ChevronsLeft className="inline mr-1 mb-1" size={18} strokeWidth={3} /> Previous </button>
                            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage >= totalPage} className="bg-gray-700 text-white rounded-md px-7 py-1 font-medium  shadow-sm hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"  > Next <ChevronsRight className="inline ml-1 mb-0.5" size={18} strokeWidth={3} /> </button>
                        </div>
                    </div>
                </div >
            </div >
            {popUp &&
                <div className="fixed  inset-0   bg-opacity-50 flex justify-center items-start z-50">



                    <div className="mt-20 border-2 border-gray-400 p-2 rounded-2xl sm:w-96 w-auto shadow-lg font-medium bg-white">
                        <div className="flex justify-end">
                            <button onClick={() => {
                                setPopUp(false)

                            }}><X color="black" /></button>
                        </div>

                        <h1 className="px-5 text-center ">
                            Do you want to  {message == "approved" ? <span className="text-green-500 ">approve</span> : <span className="text-red-500 ">reject</span>} the application?
                        </h1>
                        <div className="mt-4 flex justify-center space-x-10 p-7">
                            <Button onClick={() => {
                                updateStatus(true)

                            }} className="px-8 py-2 hover:scale-105 transition duration-150 bg-gradient-to-r  from-green-600 to-emerald-300 text-white rounded-lg ">Yes</Button>
                            <Button onClick={() => {
                                updateStatus(false)

                            }} className="px-8 py-2 hover:scale-105 transition duration-150 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg">No</Button>
                        </div>
                    </div>
                </div>
            }


        </>
    )
}
export default LoanApplications;