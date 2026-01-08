
import { Loader, IndianRupee, Menu, Handshake, LogOut } from 'lucide-react';
import useStore from "../Store/store"

import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
    const navigate = useNavigate()

    const { TotalLoanAmount, TotalEMIAmount, TotalActiveBorrowers, EMIPending, pendingCount, approvedCount, rejectedCount } = useStore()
    const CardData = [
        { label: "Total Loan amount", icon: "💰", value: TotalLoanAmount },
        { label: "Total EMI received", icon: "💰", value: TotalEMIAmount },
        { label: "Total active borrowers", icon: "👥", value: TotalActiveBorrowers },
        { label: "EMI pending this month", icon: "⏳", value: EMIPending },
        { label: "Application", icon: "📄", value: [pendingCount, approvedCount, rejectedCount] }

    ]

    return (
        <>

            <div className='pt-16'>
                <div style={{ background: 'radial-gradient(circle, #e0f2fe 0%, #90cdf4 100%)' }} className=' mx-5 shadow-xl  my-7 rounded-3xl py-10 flex flex-wrap items-center justify-center  gap-4 brightness-105 '>

                    {CardData.map((item, index) =>
                        <div key={index} className="  font-medium text-[1.1rem]  rounded-2xl shadow-xl py-2 px-5 h-28 w-72 hover:scale-105 transition duration-200 my-3 bg-white  hover:shadow-2xl drop-shadow backdrop-blur-sm bg-white/30 border border-white/20">
                            <div className='flex justify-center bg-cyan-500 p-1 rounded-full items-center brightness-125'>
                                <h1 className='text-center '><span className="inline-block text-2xl ">{item.icon}</span>{item.label}</h1>
                            </div>
                            <div className="flex flex-row items-center justify-center">

                                {item.label === "Application" ? <>
                                    <div className='grid grid-cols-2 '>
                                        <p className=''><Loader className="inline text-yellow-300 animate-spin " />pending:<span className='ml-1'>{item.value[0]}</span></p>
                                        <p className=''>✅approved:<span className='ml-1'>{item.value[1]}</span></p>
                                        <p className=''>❌rejected:<span className='ml-1'>{item.value[2]}</span></p>
                                    </div>

                                </> : item.value}
                                {(index == 0 || index == 1) ? <IndianRupee size={15} /> : null
                                }

                            </div>
                        </div>
                    )}


                </div>
            </div>



        </>
    )
}
export default AdminDashboard;