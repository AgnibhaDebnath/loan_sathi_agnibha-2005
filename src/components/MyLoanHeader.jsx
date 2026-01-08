import { Link, Navigate } from "react-router-dom";
import { Handshake, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/Firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
const MyLoanHeader = () => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const handleSignout = async () => {
        try {
            await signOut(auth)
            navigate("/")
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <>
            <header className="fixed w-full top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-700 via-green-100 to-green-600 brightness-110 sm:px-8    ">

                <nav className="flex justify-between">
                    <div className='text-3xl font-bold justify-between w-full flex items-center py-2 px-3 gap-2'>
                        <div className="flex flex-row items-center gap-3">
                            <div className='h-12 w-12 rounded-full bg-white flex justify-center items-center'>
                                <Handshake color='blue' />
                            </div>
                            <h1 className=' text-white font-[poppins]  tracking-wide '>Loan Sathi</h1>
                        </div>
                        <ul className="hidden md:flex">
                            <div className="flex flex-row items-center gap-16 text-white sm:text-base font-semibold text-sm">
                                <li className="hover:scale-105 transition duration-200 font-[poppins]  hover:text-yellow-300"><a href="/borrower/LoanStatusSection">Loan Status</a></li>
                                <li className="hover:scale-105 hover:text-yellow-300 transition duration-200 tracking-wide font-semibold font-[poppins]"><a href="/borrower/EMISection">EMI Section</a></li>
                                <li>
                                    <button onClick={handleSignout} className="flex flex-row hover:scale-105 transition duration-200 font-[poppins]"><LogOut className="text-red-300" />Logout</button>
                                </li>
                            </div>
                        </ul>
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)}>
                                <Menu color="white" />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* spacer so page content isn't hidden under the fixed header */}
            <div className="h-14" aria-hidden="true" />

            {isOpen && (
                <div className="fixed bg-white  right-0 top-16 w-40 flex justify-center p-2 shadow-2xl  rounded-xl z-50 md:hidden">
                    <ul className="flex flex-col gap-4 text-black font-semibold text-sm px-4 py-2 font-[poppins]">
                        <li className="hover:scale-105 transition duration-200 "><a href="/borrower/LoanStatusSection ">Loan status</a></li>
                        <li className="hover:scale-105 transition duration-200 font-[poppins] "><a className="" href="/borrower/EMISection">EMI section</a></li>
                        <li className="flex flex-row items-center gap-1 font-[poppins]">
                            <LogOut color="red" />
                            <button onClick={handleSignout}>Logout</button>
                        </li>
                    </ul>
                </div>
            )}
        </>
    )


}
export default MyLoanHeader;