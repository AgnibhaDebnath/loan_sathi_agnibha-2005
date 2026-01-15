
import { Loader, IndianRupee, TrendingUp } from 'lucide-react';
import useStore from "../Store/store"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,

} from "@/components/ui/chart"
"use client"
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, Cell, YAxis } from "recharts"

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate()

    const { TotalLoanAmount, TotalEMIAmount, TotalActiveBorrowers, EMIPending, pendingCount, approvedCount, rejectedCount } = useStore()
    const CardData = [
        { label: "Borrower", icon: "🧑‍🤝‍🧑 ", value: [{ category: "Borrower", new: 2, existing: 6 }] },
        { label: "EMI", icon: " 💳", value: [{ status: "not paid", count: 2 }, { status: "paid", count: 3 }] },

        { label: "Application", icon: "📄", value: [{ status: "pending", count: pendingCount }, { status: "Approved", count: approvedCount }, { status: "rejected", count: rejectedCount }] }
    ]
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    }
    return (
        <>

            <div className='pt-16'>
                <div style={{ background: 'radial-gradient(circle, #e0f2fe 0%, #90cdf4 100%)' }} className=' mx-5 shadow-xl  my-7 rounded-3xl py-10 flex flex-wrap items-center justify-center  gap-4 brightness-105 '>

                    {CardData.map((item, index) =>
                        <div key={index} className="font-medium text-[1.1rem] rounded-2xl  shadow-xl  hover:scale-105 transition duration-200 my-3  hover:shadow-2xl drop-shadow backdrop-blur-sm ">

                            {item.label === "Application" ? <>
                                <div className='bg-yellow-100 py-5 px-5 h-60 w-72 min-[390px]:w-80 rounded-2xl min-[480px]:w-96 '>
                                    <div className='flex justify-center bg-yellow-500 text-white font-[poppins] p-1 rounded-full items-center  font-semibold'>
                                        <h1 className='text-center '><span className="inline-block text-2xl ">{item.icon}</span>{item.label}</h1>
                                    </div>
                                    <div className='flex items-center flex-col '>
                                        <div className='flex flex-row items-center justify-center'>
                                            <div className='grid grid-cols-2 '>
                                                <p className=''>⏳pending:<span className='ml-1'>{item.value[0].count}</span></p>
                                                <p className=''>✅approved:<span className='ml-1'>{item.value[1].count}</span></p>
                                                <p className=''>❌rejected:<span className='ml-1'>{item.value[2].count}</span></p>

                                            </div>
                                        </div>
                                        <ChartContainer config={chartConfig} className="h-28 w-60" >
                                            <BarChart accessibilityLayer data={item.value}>
                                                <CartesianGrid vertical={true} />
                                                <XAxis
                                                    dataKey="status"
                                                    tickLine={false}
                                                    tickMargin={10}


                                                />
                                                <YAxis type='number' />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel />}
                                                />
                                                <Bar LabelList barSize={25} dataKey="count" fill="var(--color-desktop)" radius={4}  >

                                                    {item.value.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.status === "pending" ? "#F59E0B" : entry.status == "Approved" ? "#22C55E" : "#EF4444"} />))}
                                                </Bar>
                                            </BarChart>
                                        </ChartContainer>
                                    </div>
                                </div>
                            </> : item.label == "EMI" ? <>
                                <div className='py-5 px-5 h-60 w-72 min-[390px]:w-80 min-[480px]:w-96 rounded-2xl bg-green-100'>
                                    <div className='flex justify-center bg-green-500  text-white font-[poppins] p-1 rounded-full items-center  font-semibold'>
                                        <h1 className='text-center '><span className="text-2xl inline">{item.icon}</span>EMI details per month</h1>
                                    </div>
                                    <div className='flex items-center flex-col '>
                                        <div className='flex flex-row items-center justify-center'>
                                            <div className='grid grid-cols-2 '>
                                                <p className=''>📊Total:<span className='ml-1'>{item.value[0].count + item.value[1].count}</span></p>
                                                <p className=''>✅paid :<span className='ml-1'>{item.value[1].count}</span></p>
                                                <p className=''>❌Not paid :<span className='ml-1'>{item.value[0].count}</span></p>

                                            </div>
                                        </div>
                                        <ChartContainer config={chartConfig} className="h-28 w-60" >
                                            <BarChart accessibilityLayer data={item.value}>
                                                <CartesianGrid vertical={true} />

                                                <XAxis
                                                    type="category"
                                                    dataKey="status"
                                                    tickLine={false}
                                                    tickMargin={10}
                                                />
                                                <YAxis type='number' />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel />}
                                                />

                                                <Bar dataKey="count" barSize={23} radius={4} >{item.value.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.status === "paid" ? "#4CAF50" : "red"} />))}
                                                </Bar>
                                            </BarChart>
                                        </ChartContainer>

                                    </div>
                                </div>
                            </> : item.label == "Borrower" ? <>
                                <div className='py-5 px-5 h-60 w-72 min-[390px]:w-80 min-[480px]:w-96 rounded-2xl bg-blue-100'>
                                    <div className='flex justify-center bg-blue-500 text-white font-[poppins] p-1 rounded-full items-center  font-semibold'>
                                        <h1 className='text-center '><span className="text-2xl inline">{item.icon}</span>Borrower insights </h1>
                                    </div>
                                    <div className='flex items-center flex-col '>
                                        <div className='flex flex-row items-center justify-center'>
                                            <div className='grid grid-cols-2 '>
                                                <p className='text-gray-800'>👥Active:<span className='ml-1'>{item.value[0].new + item.value[0].existing}</span></p>
                                                <p className='text-blue-600'>🆕New :<span className='ml-1'>{item.value[0].new}</span></p>
                                                <p className='text-green-500'>👤 Existing :<span className='ml-1'>{item.value[0].existing}</span></p>
                                            </div>
                                        </div>
                                        <ChartContainer config={chartConfig} className="h-28 w-60" >
                                            <BarChart layout="horizontal" width={300} height={200} data={item.value}  >
                                                <CartesianGrid vertical={false} />

                                                <XAxis type="category" dataKey="category" />
                                                <YAxis type="number" />
                                                <Bar barSize={25} dataKey="existing" stackId="a" fill="#4CAF50" radius={[0, 0, 0, 0]} />
                                                <Bar barSize={25} dataKey="new" stackId="a" fill="#2196F3" radius={[0, 0, 0, 0]} />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel />}
                                                />
                                            </BarChart>
                                        </ChartContainer>

                                    </div>
                                </div>
                            </> : ""}



                        </div >
                    )}


                </div >
            </div >



        </>
    )
}
export default AdminDashboard;










