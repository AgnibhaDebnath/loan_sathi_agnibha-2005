import { BriefcaseBusiness } from 'lucide-react'
import { Wallet } from "lucide-react";
import { ArrowRight } from "lucide-react"
import personalLoanImage from "../../src/assets/personal.png"
import BusinessLoanImage from "../../src/assets/Business.png"
import { ModelContext } from '../Contaxt/ModelContext';
import { useContext } from 'react';
const LoanServices = () => {
    const services = [
        {
            id: 1,
            title: "Personal Loan",
            description: "Quick, secure, and affordable loans for your personal needs.",
            interestRate: "16-25%",
            tenure: "12 - 36 months",
            amount: "₹10,000 - ₹1,00,000",
            imagURL: personalLoanImage
        },
        {
            id: 2,
            title: "Business Loan",
            description: "Empowering small businesses with fast and reliable  loans.",
            interestRate: "12-20%",
            tenure: "6 - 48 months",
            amount: "₹25,000 - ₹5,00,000",
            imagURL: BusinessLoanImage
        }

    ]
    const { isOpen, setIsOpen } = useContext(ModelContext)
    return (
        <>
            <section>
                <div className="py-4 flex justify-center from-emerald-800 via-green-500 to-emerald-800 bg-clip-text text-transparent bg-gradient-to-r bg-white">
                    <h1 className="md:text-6xl sm:text-5xl text-4xl font-bold  
                 bg-gradient-to-r   animate-shine [background-size:200%_auto]  bg-clip-text text-transparent 
                 tracking-wide inline-block mx-auto ">Loan services</h1>
                </div>

                <div className="flex flex-wrap gap-4 justify-center ">
                    <div className="flex items-center gap-2  font-medium  text-green-500"> <span className="text-2xl">🏛️</span> Serving Local Families </div>
                    <div className="flex items-center gap-2  font-medium  text-green-500"> <span className="text-2xl">⏱️</span> 24-HouLoan Servicesr Approval </div>
                    <div className="flex items-center gap-2 font-medium  text-green-500"> <span className="text-2xl">🔍</span> No Hidden Charges </div> </div>

                <div className="flex  flex-row py-10 flex-wrap justify-evenly mb-4 bg-gradient-to-r bg-white mx-4 rounded-lg ">
                    {services.map(item =>
                        <div key={item.id} className={`${item.id == 1 ? "bg-green-50" : "bg-blue-50"}  shadow-2xl  py-4 px-4 rounded-2xl my-3 `}>
                            <div className="flex justify-center flex-row items-center ">
                                {item.id == 1 ? <Wallet className='text-green-600 ' /> : <BriefcaseBusiness className='text-blue-500 ' />}
                                <h1 className={`${item.id == 1 ? "text-green-600" : "text-blue-500"} text-2xl font-bold  pl-3`}>{item.title}</h1>


                            </div>
                            <div className="flex justify-center flex-row px-3  ">
                                <ul className='list-disc'>
                                    <li className="text-base text-gray-500 ">{item.description}</li>
                                    <li className='text-base text-gray-500'>Interest Rate: <span className='font-semibold bg-gradient-to-r from-red-600 via-red-300 to-red-600 animate-shine [background-size:200%_auto] text-transparent bg-clip-text mx-1'>{item.interestRate} per year</span></li>
                                    <li className='text-base text-gray-500 '>Lone tenure: <span className='font-semibold mx-1'>{item.tenure}</span></li>
                                    <li className='text-base text-gray-500 '>Amount:<span className='font-semibold mx-1'>{item.amount}</span> </li>
                                </ul>

                            </div>
                            <div className='overflow-hidden flex justify-center items-center py-2'>
                                <img src={item.imagURL} className='w-full object-contain max-w-xs max-h-40 rounded-md' alt="personal loan img" />
                            </div>
                            <div className='flex justify-center text-white py-2'>

                                <button key={item.id} onClick={() => {
                                    if (isOpen) {
                                        return
                                    }
                                    else {
                                        setIsOpen(!isOpen)
                                    }
                                }} className=" bg-green-600 px-4 py-2 rounded-md hover:bg-green-700  gap-2 font-medium flex flex-row items-center hover:scale-105 transition duration-200">
                                    {item.id == 1 ? "Apply for personal loan" : "Apply for Business loan"}
                                    <ArrowRight className='animate-out' size={20} />
                                </button>
                            </div>


                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
export default LoanServices;