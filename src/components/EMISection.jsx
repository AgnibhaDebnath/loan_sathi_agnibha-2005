import { useEffect, useState } from "react";

import { Progress } from "./ui/progress";
import { IdCard, IndianRupee, Calendar, Hourglass, Banknote, ChevronsRight, ChevronsLeft, Hash, AlarmClock, CalendarDays, TriangleAlert, Clock, CircleCheckBig } from 'lucide-react';
const EMISection = () => {
    const [loanData, setLoanData] = useState([])
    const [emiData, setemiData] = useState([])
    const [emiPages, setEMIpages] = useState({})

    const [loanstats, setLoanStats] = useState([])

    const token = localStorage.getItem("token")
    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:3000/get-loan-details", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            const { loanDetails } = data
            setLoanData(loanDetails)
            if (loanDetails.length > 0) {
                const initialPages = loanDetails.map(loan => ({
                    loanID: loan.loan_id,
                    pageNumber: 1
                }))
                setEMIpages(initialPages)
            }
            loanDetails.forEach(loan => {
                fetchLatestEMIforLoan(loan.loan_id, 1)
            });

        }
        fetchData()
    }, [])
    const updatePage = (loanID, newPage) => {
        setEMIpages(prev =>
            prev.map(l => l.loanID === loanID ? ({ ...l, pageNumber: newPage }) : l
            )
        )
        fetchLatestEMIforLoan(loanID, newPage)
    }
    async function fetchLatestEMIforLoan(loanID, pageNumber) {
        const emi_per_page = 1
        const skip = (pageNumber - 1) * emi_per_page
        const res = await fetch(`http://localhost:3000/get-emi-details?limit=${emi_per_page}&skip=${skip}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loanID })
        })
        const data = await res.json()

        const { emiDetails, paidorUnpaidEMINumber } = data
        setemiData(prev => ({ ...prev, [loanID]: emiDetails, }))

        setLoanStats(prev => ({ ...prev, [loanID]: paidorUnpaidEMINumber[0], }))

    }


    return (
        <>
            {loanData == null && <div className="flex justify-center items-center h-screen">
                <h1 className="font-bold text-4xl">No loan details found</h1>
            </div>
            }
            {loanData && <div className="flex justify-start py-10 mx-5 font-bold">
                <h1 className=" sm:text-3xl text-2xl md:text-5xl text-green-600 font-[poppins] tracking-wide mb-4">👋Welcome, <span >{loanData[0]?.borrower_name}</span></h1>
            </div>}
            {loanData && [...loanData].reverse().map((loan) => {
                const stat = loanstats[loan.loan_id]

                const emiDataForloan = emiData[loan.loan_id]
                const pageObj = emiPages.find(lp => lp.loanID === loan.loan_id)
                const currentPage = pageObj?.pageNumber || 1;
                return (
                    <>
                        <div className="w-full shadow-2xl mb-16 rounded-3xl py-6 bg-gradient-to-b from-gray-100 to-white">
                            <div className="w-full flex justify-center">
                                <div className="lg:w-3/6 md:w-3/5 w-96 xl:w-2/6 py-5 shadow-2xl px-1.5 sm:px-3 md:px-6 rounded-2xl ">
                                    <div className="md:flex-row flex justify-center gap-3 items-center flex-col ">
                                        <div className="flex justify-center">

                                            <img src={`../../Backend/Uploads/${loan.image_url}`} alt="Borrower photo" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-md" /> </div>
                                        <div className="flex justify-center ">
                                            <h2 className="text-center font-[poppins] font-bold text-2xl sm:text-3xl tracking-wide py-4 text-blue-500">Loan summery</h2>
                                        </div>
                                    </div>
                                    <p className=" text-gray-700"><span className="drop-shadow-2xl font-medium"><IdCard className="inline" />Loan ID :</span> LN-<span>{new Date().getFullYear()}-</span><span>{loan.loan_id.split("-")[4]}<span className="bg-green-100 text-green-500 rounded-2xl px-3 py-1 ml-1 font-medium">{loan.status}</span></span></p>

                                    <p className="text-gray-700 "><span className="drop-shadow-2xl text-gray-800 font-medium mr-2"><Banknote className="inline text-gray-800" />Loan Amount :</span><span className="font-medium"><IndianRupee className="inline" size={15} /></span> {loan.original_principal}</p>

                                    <p className="text-gray-700 "><span className="drop-shadow-2xl text-gray-800  font-medium mr-2">🟦Interest rate  :</span>{loan.interest_rate}%</p>

                                    <p className="text-gray-700"><span className="drop-shadow-2xl text-gray-800  font-medium mr-2"><Hourglass className="inline " />Loan tenure :</span>{loan.loan_tenure}  months</p>

                                    <p className="text-gray-700">
                                        <span className="drop-shadow-2xl text-gray-800 font-medium mr-1"><Calendar className="inline" size={20} strokeWidth={2.6} />Loan starting date :</span>{new Date(loan.starting_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", })}
                                        {new Date().getTime() >= new Date(loan.starting_date).getTime() && <span className="ml-1.5 text-center  rounded-3xl pt-1.5 pb-2 px-2.5 sm:px-3 bg-green-100 text-green-700 font-medium">started</span>}

                                        {new Date().getTime() < new Date(loan.starting_date).getTime() && <span className="ml-1.5 text-center  rounded-3xl pt-1.5 pb-2 px-2 sm:px-3 bg-gray-100 text-gray-700 font-medium">not started</span>}
                                    </p>

                                    <p className="text-gray-700 mt-1"><span className="drop-shadow-2xl text-gray-800  font-medium mr-2 "><Banknote className="inline" />Amount to Pay this month:</span><span className="font-medium">₹</span> {loan.total_outstanding}</p>

                                    {stat &&
                                        <div>
                                            <p className="text-gray-700"><span className="text-gray-800 font-medium mr-2">🟦EMI paid:</span><span>{stat.paid_emi}</span></p>

                                            <p className="text-gray-700"><span className="text-gray-800 font-medium mr-2">🟦Total EMI :</span><span>{stat.total_emi}</span></p>
                                            <Progress value={(stat.paid_emi / stat.total_emi) * 100} className="h-3 mt-3 " />
                                            <p className="text-xs text-gray-600 text-center mt-1 font-medium">
                                                {stat.paid_emi} of {parseFloat(stat.total_emi)} EMIs paid ({((stat.paid_emi / stat.total_emi) * 100).toFixed(1)}%)
                                            </p>
                                        </div>}
                                </div>
                            </div>
                            {emiData && emiData.length == 0 ?
                                <div className="py-10 flex justify-center font-bold sm:text-4xl text-2xl ">
                                    <h1>
                                        No EMI Schedule yet
                                    </h1>
                                </div>
                                : (emiDataForloan && emiDataForloan.map((emi) => (
                                    <>
                                        {new Date().getTime() < new Date(loan.starting_date).getTime() ? <div className="sm:text-4xl text-2xl font-bold flex justify-center my-8">
                                            <h1>No emi schedule yet</h1>
                                        </div>
                                            : <div className="w-full flex justify-center mt-16 mb-10">

                                                <div className="w-[970px] shadow-2xl py-1  px-4 rounded-2xl">
                                                    <div className="flex justify-center">
                                                        <h1 className="font-bold text-2xl sm:text-4xl tracking-wide font-[poppins] py-5">EMI summery</h1>
                                                    </div>
                                                    <div className="min-[783px]:grid-cols-3 min-[590px]:grid-cols-2 grid-cols-1 grid gap-3 py-5 pl-7 min-[550px]:px-0">

                                                        <div className="flex min-[783px]:justify-start justify-start">
                                                            <h3 className="font-semibold text-[1.05rem]   font-[poppins] text-blue-400"><Hash className="inline" size={18} strokeWidth={2.7} />  Installment No : <span>{emi.installment_no}</span></h3>
                                                        </div>
                                                        <div className="flex min-[783px]:justify-start justify-start ">
                                                            <h3 className="font-semibold text-[1.05rem]   font-[poppins]"><Banknote className="inline text-gray-800" />EMI amount : <span>₹ {emi.emi_amount}</span></h3>
                                                        </div>
                                                        <div className="flex min-[783px]:justify-cnetre justify-start ">
                                                            <h3 className="font-semibold text-[1.05rem]   font-[poppins] text-gray-700"><Calendar className="inline" size={20} />Due date : <span>{new Date(emi.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", })}</span></h3>
                                                        </div>

                                                        <div className="flex min-[783px]:justify-start justify-start ">
                                                            <h3 className="font-semibold  text-[1rem]  font-[poppins]"><Banknote className="inline text-green-500 mr-1" />paid this month:<span className="font-sans text-green-500 "><IndianRupee className="inline" strokeWidth={2.5} size={17} />{emi.amount_paid}</span></h3>
                                                        </div>
                                                        <div className="flex min-[783px]:justify-start justify-start ">
                                                            <h3 className="font-semibold text-[.9rem] font-[poppins]"><span><Banknote className="inline text-gray-700" />Remaining for this month: </span><span>{emi.emi_amount - emi.amount_paid}</span></h3>
                                                        </div>
                                                        <div className="flex min-[783px]:justify-centre justify-start">
                                                            {emi.amount_paid == 0 && <h3 className="font-semibold text-[1.05rem]   font-[poppins]"><TriangleAlert className="inline  text-gray-500 mr-0.5" size={19} />Payment status: <span className="p-2 bg-gray-100 text-gray-600 text-sm rounded-3xl">Unpaid</span></h3>}

                                                            {emi.amount_paid == emi.emi_amount && <h3 className="font-semibold text-[1.05rem] text-gray-800  font-[poppins]"><CircleCheckBig className="inline text-green-500 mr-1" />Payment status:<span className="bg-green-100 text-green-500 px-4 py-1 text-sm rounded-3xl">Paid</span></h3>}

                                                            {emi.amount_paid < emi.emi_amount && emi.amount_paid != 0 && <h3 className="font-semibold text-[1.05rem]   font-[poppins]">🟦Payment status:<span className=" p-2 text-sm rounded-3xl">Partial</span></h3>}

                                                            {emi.amount_paid > emi.emi_amount && emi.amount_paid != 0 && <h3 className="font-semibold text-[1.05rem]   font-[poppins]">🟦Payment status:<span className=" p-2 text-sm rounded-3xl">Overpaid</span></h3>}
                                                        </div>
                                                        <div className="flex min-[783px]:justify-centre justify-start">
                                                            {emi.amount_paid == emi.emi_amount && <h3 className="font-semibold text-[1.05rem]   font-[poppins]"><CircleCheckBig className="inline mr-1 text-green-500" />EMI Status: <span className="px-3 py-1 text-sm rounded-3xl bg-green-100 text-green-500">paid</span></h3>}

                                                            {new Date().setHours(0, 0, 0, 0) < new Date(emi.due_date).setHours(0, 0, 0, 0) && <h3 className="font-semibold text-[1.05rem]   font-[poppins]"><CalendarDays className="inline text-gray-500" />EMI Status: <span className="p-2 text-sm rounded-3xl bg-gray-100 text-gray-700">Upcoming</span></h3>}

                                                            {new Date().setHours(0, 0, 0, 0) === new Date(emi.due_date).setHours(0, 0, 0, 0) && <h3 className="font-semibold text-[1.05rem]   font-[poppins]"><AlarmClock className="inline mb-1" />EMI Status: <span className="p-2 text-sm rounded-3xl bg-blue-100 text-blue-600">Due today</span></h3>}

                                                            {emi.amount_paid == 0.00 && new Date().setHours(0, 0, 0, 0) > new Date(emi.due_date).setHours(0, 0, 0, 0) &&
                                                                new Date().setHours(0, 0, 0, 0) <= (() => {
                                                                    const d = new Date(emi.due_date);

                                                                    d.setHours(0, 0, 0, 0);

                                                                    d.setDate(d.getDate() + 7)

                                                                    return d.getTime();
                                                                })() && <h3 className="font-semibold text-[1.05rem]   font-[poppins]">< Clock className="inline text-orange-400" />EMI Status: <span className="p-2 text-sm bg-orange-100 text-orange-600 rounded-3xl">Grace period</span></h3>}

                                                            {new Date().setHours(0, 0, 0, 0) > (() => {
                                                                const d = new Date(emi.due_date);

                                                                d.setHours(0, 0, 0, 0);

                                                                d.setDate(d.getDate() + 7)

                                                                return d.getTime();
                                                            })() && <h3 className="font-semibold text-[1.05rem]   font-[poppins]">🟦EMI Status: <span className="p-2 text-sm rounded-3xl">Overdue</span></h3>}
                                                        </div>
                                                        <div>
                                                            <h1 className="font-semibold text-[1.05rem]   font-[poppins]">🟦penalty: {emi.penalty}</h1>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>}


                                    </>



                                )))}
                            <div className="flex justify-center gap-10 pb-5">
                                <button disabled={stat ? currentPage >= (Number(stat?.paid_emi) + Number(stat?.unpaid_emi)) : false} onClick={() => updatePage(loan.loan_id, currentPage + 1)} className=" font-semibold font-[poppins] text-[1rem] hover:scale-x-105 transition duration-200 bg-gray-300 hover:bg-gray-500 px-5 py-1 rounded-md disabled:cursor-not-allowed" ><span><ChevronsLeft className="inline" size={25} strokeWidth={3} /></span>Older</button>
                                <button disabled={currentPage <= 1} className="text-[1rem] font-semibold font-[poppins] px-4 py-1 rounded-md  hover:scale-x-105 transition duration-200 bg-gray-300 hover:bg-gray-500 disabled:cursor-not-allowed" onClick={() => updatePage(loan.loan_id, currentPage - 1)}>Newer<span><ChevronsRight strokeWidth={3} className="inline" size={25} /></span></button>
                            </div>

                        </div>
                    </>

                )
            })}

        </>
    )
}
export default EMISection;