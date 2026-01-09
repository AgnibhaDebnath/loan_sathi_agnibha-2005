import { useEffect, useState } from "react"
import { IndianRupee, Hash, ChevronsRight, ChevronsLeft, Calendar, Phone, IdCard, User, X, CircleX } from "lucide-react"
import { Input } from "./ui/input"
import { toast, ToastContainer } from "react-toastify"

const AdminEMISection = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [emi, setEMI] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [ispaymentFormOpen, setIsPaymentFormOpen] = useState(false)
    const [loanID, setLoanID] = useState("")
    const [installmentNo, setInstallmentNo] = useState('')
    const [payment, setPayment] = useState("")
    const [paymentError, setPaymentError] = useState("")
    useEffect(() => {
        async function fetchData() {
            const emi_per_page = 2
            const skip = (currentPage - 1) * emi_per_page
            const res = await fetch(`https://loan-sathi.onrender.com/get-emi-for-admin?limit=${emi_per_page}&skip=${skip}`, {
                method: "GET"
            })
            const date = await res.json()
            const { message, emiDetails, totalEMI } = date
            setEMI(emiDetails)
            setTotalPage(totalEMI[0]["COUNT(*)"] / emi_per_page)

        }
        fetchData()
    }, [currentPage])
    const update_payment = async (e) => {
        try {


            e.preventDefault()
            const res = await fetch("https://loan-sathi.onrender.com/update-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ loanID, installmentNo, payment })
            })
            const data = await res.json()
            const { success, message } = data
            console.log(success)
            if (res.ok && success) {
                setPayment("")
                setIsPaymentFormOpen(false)
                toast.success(message, {
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })
            } else {
                toast.error(message, {
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })
                return
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="flex justify-center  py-2 items-center mt-16">
                <h1 className="text-5xl text-black block font-bold font-[poppins]">EMI Section</h1>
            </div>
            <div className="">

                <div className="flex flex-col items-center pb-3">

                    <div className="p-5  rounded-3xl mx-4 md:w-4/5 w-11/12 border-gray-400 border-2">

                        <div className=" w-full overflow-x-auto">
                            <table className="border-collapse border-2 border-green-200 min-w-[990px] w-full">
                                <thead className="bg-gradient-to-r from-teal-500 to-cyan-500  brightness-125 font-[poppins]">
                                    <tr className="font-semibold ">
                                        <th className="border-r border-gray-300 p-2 text-left text-base ">Borrower Info</th>
                                        <th className="border-r border-gray-300 p-2 text-left text-base ">Loan Details</th>
                                        <th className="border-r border-gray-300 p-2 text-left text-base ">EMI Schedule</th>

                                        <th className="border-r border-gray-300 p-2 text-left text-base ">Outstanding</th>
                                        <th className="border-r border-gray-300 p-2 text-left text-base ">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emi && emi.map((emi) => (
                                        <tr key={emi.loan_id} className="border-2 text-gray-800 p-2 text-left text-base font-medium">
                                            <td className="border-r bg-white  border-gray-300 pl-3"><span className="block"><User className="inline " />{emi.borrower_name}</span><span> <IdCard className="inline" /> {emi.borrower_id}</span><span className="block"><Phone className="inline text-green-400" size={18} />  {emi.mobile_no}</span></td>
                                            <td className="border-r  border-gray-300 pl-3 py-1 bg-gray-100">
                                                <span className="block">Loan ID : {emi.loan_id.split("-")[4]}</span>
                                            </td>
                                            <td className="border-r pl-2 ">
                                                <span className="block"><span><Hash className="inline" strokeWidth={3} size={17} /></span>Installment no: {emi.installment_no}</span>

                                                <span className="block">EMI : <span><IndianRupee className="inline" size={17} strokeWidth={3} />
                                                </span>{emi.emi_amount}
                                                    <span className={`ml-2 px-2 py-1 text-sm font-semibold ${emi.amount_paid == emi.emi_amount ? 'bg-green-100 text-green-500 rounded-2xl px-5' : emi.amount_paid == 0.00 ? 'bg-red-50 text-red-500 rounded-2xl' : emi.amount_paid < emi.emi_amount ? 'bg-yellow-50 text-yellow-400' : emi.amount_paid > emi.emi_amount ? 'bg-blue-100 text-blue-700' : ''}`} > {emi.amount_paid == emi.emi_amount ? 'Paid' : emi.amount_paid == 0.00 ? 'Unpaid' : emi.amount_paid < emi.emi_amount ? 'Partial' : emi.amount_paid > emi.emi_amount ? 'Excess' : ''} </span>
                                                </span>
                                                <span className="block"><Calendar className="inline text-blue-400 mb-1" size={18} />Due date: {new Date(emi.due_date).toLocaleDateString(undefined, { month: "long", year: "numeric", day: "numeric" })}</span>
                                                <span className=""> <Calendar className="inline text-blue-400 mb-1" size={18} /> payment date:{" "} {emi.payment_date ? new Date(emi.payment_date).toLocaleDateString(undefined, { month: "long", year: "numeric", day: "numeric", }) : "Not paid yet"} </span>
                                            </td>
                                            <td className="bg-gray-100 pl-2">
                                                <span className="block">Due this month :  <IndianRupee className="inline" size={17} strokeWidth={2.5} />{parseFloat(emi.penalty) + parseFloat(emi.emi_amount) - parseFloat(emi.amount_paid)}</span>
                                                <span>Includes penalty : <span><IndianRupee className="inline" n size={17} strokeWidth={2.5} /></span>{emi.penalty}</span>

                                            </td>
                                            <td className="flex py-1 flex-col items-center  gap-2">
                                                <button onClick={() => {
                                                    setIsPaymentFormOpen(true)
                                                    setLoanID(emi.loan_id)
                                                    setInstallmentNo(emi.installment_no)
                                                }} className="md:text-base  bg-green-100 text-green-500 p-2 rounded-3xl hover:scale-105 transition duration-200 text-sm ">💰Update  payment</button>
                                                <button className="text-base bg-blue-100 font-[poppins] text-blue-500 p-2 rounded-3xl hover:scale-105 transition duration-200 font-semibold">🔍View details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex justify-center   w-full">
                <div className="flex justify-center gap-10 shadow-2xl w-96 py-5 px-2">
                    <button disabled={totalPage && totalPage <= currentPage} onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-300 px-4 py-1.5 rounded-lg font-bold font-[poppins] hover:scale-105 transition duration-200 hover:bg-gray-500 disabled:opacity-50  disabled:cursor-not-allowed "><ChevronsLeft className="inline" />Older</button>
                    <button disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)} className="bg-gray-300 px-3 py-1.5 rounded-lg font-[poppins] font-bold transition duration-200 hover:scale-105 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">Newer< ChevronsRight className="inline" /></button>
                </div>
            </div>

            {ispaymentFormOpen &&
                < div className="bg-opacity-50 bg-black inset-0 z-50 fixed ">
                    <div className="absolute top-32 inset-0  h-80 rounded-2xl  left-1/2 transform -translate-x-1/2 lg:w-5/12 md:w-6/12 sm:w-96 w-11/12 px-7 py-6 flex items-center flex-col justify-start bg-white gap-4" >

                        <div className="flex justify-end w-full">

                            <button onClick={() => {
                                setIsPaymentFormOpen(false)
                                setPaymentError("")
                                setPayment("")
                            }}><X /></button></div>
                        <div className=" flex justify-center">
                            <h2 className="text-3xl font-bold text-gray-800 "> Update Payment </h2>
                        </div>
                        <div className="flex md:justify-centre md:flex-row flex-col items-center">
                            <p>Loan ID : {loanID.split("-")[4]}</p>
                            <p className="hidden md:block mx-2">|</p>
                            <p>Installment no : {installmentNo}</p>
                        </div>
                        <div >
                            <form className="flex flex-col items-center gap-4">
                                <div className="flex justify-center w-72 min-w[400px]:w-80 ">

                                    <Input value={payment} placeholder="Amount received" className="rounded-2xl font-medium " onChange={e => {
                                        const onlyDigit = e.target.value.replace(/[^0-9.]/g, "")
                                        setPayment(onlyDigit)
                                        if (!onlyDigit) {
                                            setPaymentError("Payment is required")
                                        } else {
                                            setPaymentError("")
                                        }
                                    }} />
                                </div>
                                {paymentError && <p className="text-red-500 font-medium"><span><CircleX className="inline mx-1" /></span>{paymentError}</p>}
                                <button type="submit" onClick={update_payment} disabled={!payment} className="px-5 py-1 rounded-xl bg-blue-500 hover:bg-blue-700 font-semibold font-[poppins] text-white disabled:cursor-not-allowed">Confirm Payment</button>
                            </form>
                        </div>

                    </div>
                </div >}
        </>
    )

}
export default AdminEMISection