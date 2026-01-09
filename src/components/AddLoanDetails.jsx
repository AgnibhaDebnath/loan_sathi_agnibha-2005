import { useState, useRef } from "react"
import { Input } from "./ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "./ui/button"
import { format } from "date-fns"
import { CircleX, User, Phone, Loader, Info, Percent, Banknote, Hourglass, IdCard } from "lucide-react"
import { Calendar as CalendarIcon } from "lucide-react";
import formBackgroundImage from "../../src/assets/backround_borrower_lon_status.jpg"
import { ToastContainer, toast } from 'react-toastify';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
const AddLoanDetails = () => {
    const [date, setDate] = useState("")
    const [BorrowerName, setBorrowerName] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [mobileNoForLoanDetails, setMobileNoForLoanDetails] = useState("")
    const [loanAmount, setLoanAmount] = useState("")
    const [emiAmount, setEMIAmount] = useState("")
    const [loanTanure, setLoanTanure] = useState("")
    const [interestRate, setInterestRate] = useState("")
    const [borrowerID, setBorrowerID] = useState("")
    const [borrowerImage, setBorrowerImage] = useState(null);
    const [borrowerError, setBorrowerError] = useState({ nameError: "", imageError: "", numberError: "", borrowerIDError: "" })
    const [loanDetailsError, setLoanDetailsError] = useState({ mobileNoError: "", loanAmountError: "", interestError: "", loanTanureError: "", dateError: "", emiAmountError: "" })
    const [validMobileNo, setValidMobieNo] = useState(false)

    const [formSubmitted, setFormSubmitted] = useState(false)
    const fileInputRef = useRef(null);


    const handleBorrower_details = async (e) => {
        e.preventDefault()
        setFormSubmitted(true)
        const formData = new FormData()
        formData.append("BorrowerID", borrowerID)
        formData.append("BorrowerName", BorrowerName)
        formData.append("mobileNo", mobileNo)
        formData.append("image", borrowerImage)
        try {
            const res = await fetch("https://loan-sathi.onrender.com/borrower-Details", {
                method: "POST",
                body: formData
            })
            console.log(res.ok)
            if (res.ok) {
                const data = await res.json()
                const { message } = data
                setBorrowerName("")
                setMobileNo("")
                setBorrowerID('')
                setValidMobieNo(false)
                setBorrowerImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setFormSubmitted(false)
                console.log(message)
                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light"
                })
            }
            else if (res.status == 400) {
                const data = await res.json()
                const { error } = data
                setBorrowerImage(null)
                setFormSubmitted(false)
                toast.error(error, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light"
                })
            }
            else if (res.status == 409) {
                const data = await res.json()
                const { message } = data
                if (message == "Duplicate mobile no detected") {
                    setMobileNo("")
                } else {
                    setBorrowerID("")
                }


                setFormSubmitted(false)
                toast.error(message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light"
                })
            }
        } catch (err) {

        }

    }
    const handleSubmit_Of_LoanDetails = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://loan-sathi.onrender.com/loan-Details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "mobileNo": mobileNoForLoanDetails, "loanAmount": loanAmount, "emiAmount": emiAmount, "interestRate": interestRate, "loanTanure": loanTanure, "date": format(date, "yyyy-MM-dd") })
            })
            const data = await res.json()
            const { message } = data
            if (res.ok) {
                setEMIAmount("")

                setLoanTanure("")
                setDate("")
                setLoanAmount("")
                setInterestRate("")
                setMobileNoForLoanDetails("")
                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light"
                })

            }
            else {
                toast.error(message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light"
                })
            }

        } catch (err) {
            console.log(err)
        }


    }
    return (
        <>

            <div className=" w-full flex justify-center py-2 my-28 relative ">
                <div className=" md:w-3/4 w-11/12 rounded-2xl  my-1 ">
                    <div className="flex justify-center items-center">
                        <h1 className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent text-3xl sm:text-4xl font-bold md:text-5xl text-center font-[poppins]">Add Borrower Details</h1>
                    </div>
                    <form onSubmit={handleBorrower_details}>
                        <ToastContainer />
                        <div className="flex items-center flex-col gap-5 my-8 shadow-2xl py-8 rounded-3xl">
                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 flex justify-center border-2 rounded-2xl py-2 border-gray-400 items-center">
                                <h1 className="text-red-500 brightness-150 font-medium items-center"><span><Info className="inline mb-1 mx-1 " /></span>You must fill all four fields</h1>
                            </div>
                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative">
                                <IdCard className=" left-2 z-40 top-2  h-5 w-5  absolute" />
                                <Input
                                    value={borrowerID}
                                    onChange={(e) => {
                                        const borrower_ID = e.target.value;
                                        setBorrowerID(borrower_ID);
                                        if (!borrower_ID) {
                                            setBorrowerError(prev => ({ ...prev, borrowerIDError: "Borrower id is required" }))
                                        } else {
                                            setBorrowerError(prev => ({ ...prev, borrowerIDError: "" }))
                                        }

                                    }
                                    }
                                    placeholder="Borrower id"

                                    className="font-medium rounded-2xl  px-8 "
                                />

                            </div>
                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative">
                                <User className=" left-2 z-40 top-2  h-5 w-5  absolute" />
                                <Input
                                    value={BorrowerName}
                                    onChange={(e) => {
                                        const borrower = e.target.value;
                                        setBorrowerName(borrower);
                                        const nameRegex = /^[A-Za-z\s]+$/;
                                        if (!nameRegex.test(borrower)) {
                                            setBorrowerError(prev => ({ ...prev, nameError: "Name must contain only letters and spaces" }));
                                        } else { setBorrowerError(prev => ({ ...prev, nameError: "" })) };
                                    }
                                    }
                                    placeholder="Borrower name"

                                    className="font-medium rounded-2xl px-8 "
                                />

                            </div>
                            <div className="flex justify-center px-9">
                                {borrowerError.nameError && <p className="text-red-500 font-medium  "><span className="mx-1"><CircleX className="inline" /></span>{borrowerError.nameError}</p>}
                            </div>
                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative">
                                <Phone className=" left-2 z-40 top-2  h-5 w-5  absolute" />
                                <Input
                                    value={mobileNo}
                                    onChange={e => {
                                        const onlyDigit = e.target.value.replace(/\D/g, "")
                                        setMobileNo(onlyDigit)
                                        if (!onlyDigit) {
                                            setBorrowerError(prev => ({ ...prev, numberError: "Phone no is required" }));
                                            setValidMobieNo(false);
                                        } else if (onlyDigit.length !== 10) {
                                            setBorrowerError(prev => ({ ...prev, numberError: "Phone no must be exactly 10 digits" }));
                                            setValidMobieNo(false);
                                        } else {
                                            setBorrowerError(prev => ({ ...prev, numberError: "" })); setValidMobieNo(true);
                                        }
                                    }}

                                    placeholder="Enter mobile no"
                                    className="font-medium rounded-2xl  px-8"
                                />
                            </div>
                            {borrowerError.numberError && <p className="text-red-500 font-medium "><CircleX className="inline" />{borrowerError.numberError}</p>}
                            <label
                                className="
    w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12
    flex items-center justify-center
    px-4 py-1 cursor-pointer
   
       rounded-2xl
    border-2 border-dashed border-black
    bg-white/5 backdrop-blur-md
    font-medium
    transition-all duration-300
    hover:border-pink-400 hover:bg-pink-500/10 hover:scale-105
    focus:outline-none
  "
                            >
                                {borrowerImage ? borrowerImage.name : "Upload Borrower Image"}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) {
                                                setBorrowerError(prev => ({
                                                    ...prev, imageError: "Image must be less than 2MB"
                                                }))
                                                setBorrowerImage(null);
                                            }
                                            else {
                                                setBorrowerImage(file)
                                                setBorrowerError(prev => ({ ...prev, imageError: "" }))
                                            }
                                        }

                                    }}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                            </label>
                            {borrowerImage && (<img src={URL.createObjectURL(borrowerImage)} alt="Preview" className="mt-3 h-24 w-24 object-cover rounded-lg border border-white/30" />)}

                            {borrowerError.imageError && <p className="text-red-500 font-medium"><CircleX className="inline mx-2" />{borrowerError.imageError}</p>}


                            <Button disabled={!(borrowerID && validMobileNo && mobileNo.trim() && borrowerImage && BorrowerName.trim()) || formSubmitted} type="submit" className="bg-gradient-to-r from-pink-400 to-red-500 hover:scale-x-105 transition duration-150">{formSubmitted ? <Loader className="animate-spin  inline mx-6" /> : "Add Borrower details"}</Button>

                        </div>
                    </form>


                    <form onSubmit={handleSubmit_Of_LoanDetails}>
                        <div className="flex items-center flex-col gap-5 my-8 rounded-3xl shadow-2xl py-10 bg-gradient-to-b from-gray-100 to-white ">
                            <div className="flex justify-center ">
                                <h1 className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent text-4xl font-bold md:text-5xl font-[poppins]">Add Loan Details</h1>
                            </div>
                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 flex justify-center border-2 rounded-2xl py-2 border-gray-400 items-center">
                                <h1 className="text-red-500 brightness-150 font-medium items-center"><span><Info className="inline mb-1 mx-1 " /></span>You must fill all six fields</h1>
                            </div>
                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative">
                                <Phone className=" left-2 z-40 top-2  h-5 w-5  absolute" />
                                <Input
                                    value={mobileNoForLoanDetails}
                                    onChange={e => {
                                        const onlyDigit = e.target.value.replace(/\D/g, "")
                                        setMobileNoForLoanDetails(onlyDigit)
                                        if (!onlyDigit) {
                                            setLoanDetailsError(prev => ({ ...prev, mobileNoError: "Phone no is required" }));
                                            setValidMobieNo(false);
                                        } else if (onlyDigit.length !== 10) {
                                            setLoanDetailsError(prev => ({ ...prev, mobileNoError: "Phone no must be exactly 10 digits" }));
                                            setValidMobieNo(false);
                                        } else {
                                            setLoanDetailsError(prev => ({ ...prev, mobileNoError: "" })); setValidMobieNo(true);
                                        }
                                    }}

                                    placeholder="Enter mobile no"
                                    className="font-medium rounded-2xl px-8"
                                />
                            </div>
                            {loanDetailsError.mobileNoError && <p className="text-red-500 font-medium"><CircleX className="inline" />{loanDetailsError.mobileNoError}</p>}
                            <div className=" w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative">
                                <Banknote className=" top-2 left-2 absolute z-40 text-gray-600" />
                                <Input
                                    value={loanAmount}
                                    onChange={e => {
                                        const onlyDigit = e.target.value.replace(/\D/g, "")
                                        setLoanAmount(onlyDigit)
                                        if (!onlyDigit) {
                                            setLoanDetailsError(prev => ({ ...prev, loanAmountError: "Loan amount is required" }))
                                        } else {
                                            setLoanDetailsError(prev => ({ ...prev, loanAmountError: "" }));
                                        }
                                    }}
                                    placeholder="Loan amount "
                                    className="w-full  font-medium rounded-2xl px-9"
                                />
                            </div>
                            {loanDetailsError.loanAmountError && <p className="text-red-500 font-medium"><CircleX className="inline" />{loanDetailsError.loanAmountError}</p>}
                            <div className="w-4/5  sm:w-7/12 md:w-7/12 lg:w-5/12 relative ">
                                <Banknote className=" top-2 left-2 absolute z-40 " />
                                <Input
                                    value={emiAmount}
                                    onChange={e => {
                                        const onlyDigit = e.target.value.replace(/[^0-9.]/g, "")
                                        setEMIAmount(onlyDigit)
                                        if (!onlyDigit) {
                                            setLoanDetailsError(prev => ({ ...prev, emiAmountError: "EMI amount is required" }))
                                        } else {
                                            setLoanDetailsError(prev => ({ ...prev, emiAmountError: "" }));
                                        }

                                    }}
                                    placeholder="EMI amount"
                                    className="w-full  font-medium rounded-2xl   px-9"
                                />
                            </div>
                            {loanDetailsError.emiAmountError && <p className="text-red-500 font-medium"><CircleX className="inline" />{loanDetailsError.emiAmountError}</p>}

                            <div className="w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative ">
                                <Percent className="absolute  left-2 top-2 z-50 h-5 w-5" strokeWidth={3} />
                                <Input
                                    value={interestRate}
                                    onChange={e => {
                                        const onlyDigit = e.target.value.replace(/\D/g, "")
                                        setInterestRate(onlyDigit)
                                        if (!onlyDigit) {
                                            setLoanDetailsError(prev => ({ ...prev, interestError: "Interest rate is required" }))
                                        } else {
                                            setLoanDetailsError(prev => ({ ...prev, interestError: "" }));
                                        }

                                    }}
                                    placeholder="Interest rate"
                                    className=" w-full  font-medium rounded-2xl  px-9"
                                />
                            </div>

                            {loanDetailsError.interestError && <p className="text-red-500 font-medium"><CircleX className="inline" />{loanDetailsError.interestError}</p>}
                            <div className=" w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12 relative">
                                <Hourglass className=" top-2 left-2 absolute z-50 h-5" />
                                <Input
                                    value={loanTanure}
                                    onChange={e => {
                                        const onlyDigit = e.target.value.replace(/\D/g, "")
                                        setLoanTanure(onlyDigit)
                                        if (!onlyDigit) {
                                            setLoanDetailsError(prev => ({ ...prev, loanTanureError: "Loan tanure is required" }))
                                        } else {
                                            setLoanDetailsError(prev => ({ ...prev, loanTanureError: "" }));
                                        }

                                    }}
                                    placeholder="Laon tenure(month) "
                                    className="w-full  font-medium rounded-2xl    px-9"
                                />
                            </div>
                            {loanDetailsError.loanTanureError && <p className="text-red-500 font-medium"><CircleX className="inline" />{loanDetailsError.loanTanureError}</p>}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className=" w-4/5 sm:w-7/12 md:w-7/12 lg:w-5/12
             rounded-2xl border-2 border-gray-700 border-dashed
             bg-white/10 backdrop-blur-md 
             hover:bg-white/20 
            
             transition-all duration-200 outline-none text-[15px] tracking-wide hover:scale-105 hover:border-pink-500  px-9 font-[poppins] font-semibold" >
                                        <CalendarIcon className=" left-2 z-50 top-2 h-8  absolute" />
                                        {date ? format(date, "PPP") : "Select EMI Starting Date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        captionLayout="dropdown"
                                        className=" rounded-xl border border-white/20 "
                                        fromYear={new Date().getFullYear()}
                                        // ✅ earliest year allowed 
                                        toYear={new Date().getFullYear() + 5}
                                        disabled={(day) => day < new Date().setHours(0, 0, 0, 0)}
                                        fromDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Button disabled={!(emiAmount && loanAmount && interestRate && loanTanure && date && validMobileNo)} type="submit" className="bg-gradient-to-r from-pink-400 to-red-500 hover:scale-x-105 transition duration-200 px-8">Add Loan
                                details</Button>
                        </div>
                    </form>



                </div>
                {/* <div className="absolute inset-0 z-0 w-full h-full"> <img src={formBackgroundImage} alt="Form background" className="w-full h-full object-cover  " /> </div> */}
            </div >

        </>
    )
}
export default AddLoanDetails