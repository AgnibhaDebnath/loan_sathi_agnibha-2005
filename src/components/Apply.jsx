import { useContext, useState, useEffect } from "react";
import { ModelContext } from "../Contaxt/ModelContext";
import { X } from 'lucide-react';
import { CircleX } from 'lucide-react'
import { auth } from "../Firebase/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { Input } from "@/components/ui/input"
import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "./ui/button";
import { getText } from "@/i18n/useLanguage";
const Apply = () => {
    const { isOpen, setIsOpen } = useContext(ModelContext);
    const { Borrowerlogin, setBorrowerlogin } = useContext(ModelContext);


    const text = getText()
    const currentLanguage = localStorage.getItem("lang") || "en"

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("")
    const [mobileNO, setMobileNo] = useState("");
    const [loanType, setLoanType] = useState("");
    const [loanAmount, setLoanAmount] = useState("");

    const [error, setError] = useState({ firstNameError: "", lastNameError: "", mobileNoError: "", loanAmountError: "" });

    const [popup, setPopup] = useState(false);
    const [OTPsend, setOTPSend] = useState(false)
    const [otp, setotp] = useState("")
    const [isverified, setIsVerified] = useState(false)
    const [confirmationResult, setconfirmationResul] = useState("")
    const [recaptchaerror, setRecaptchaerror] = useState("")
    const [validOTP, setValidOTP] = useState(true)
    const [validMobileNo, setValidmobileNo] = useState(false)
    const [message, setMessage] = useState("")
    const [formSubmit, setFormSubmit] = useState(false)



    // Setup reCAPTCHA (required by Firebase)
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
                callback: (response) => {
                    console.log("reCAPTCHA verified ✅");
                },

            });
            window.recaptchaVerifier.render().then((widgetId) => {
                window.recaptchaWidgetId = widgetId;
            });

        }
    };
    // Submit form data
    const submitFormData = async () => {
        try {
            const response = await fetch("http://localhost:3000/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Borrower: [firstName, lastName], MobileNo: mobileNO, LoanType: loanType, LoanAmount: loanAmount })
            })
            const data = await response.json()
            const { message } = data;

            if (response.ok) {
                setMessage(message);
                // Reset form
                setFirstName("");
                setLastName("");
                setMobileNo("");
                setLoanType("");
                setLoanAmount("");
                setRecaptchaerror("");
                setotp("");
                setOTPSend(false);
                setValidOTP(true);
                setPopup(true);
                setTimeout(() => {
                    setPopup(false);
                    setIsVerified(false);
                    setBorrowerlogin(true)
                }, 3000);
            } else {
                setIsOpen(true)
                setotp("")

            }
        } catch (err) {
            console.error(err);
            setotp("");
            setOTPSend(false);
            setValidOTP(true)
            alert("Failed to submit loan application");
        }
    }

    // Verify OTP
    const verifyOtp = async () => {
        try {
            await confirmationResult.confirm(otp);
            setIsVerified(true);
            submitFormData()
            setOTPSend(false)

        } catch (err) {
            console.error(err);
            setIsVerified(false);
            setValidOTP(false)

        }

    };
    useEffect(() => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
        setupRecaptcha();
    }, []);
    // Handle loan form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setupRecaptcha();
        setIsOpen(!isOpen);
        setFormSubmit(true)
        const phoneNumber = '+91' + mobileNO;
        const appVerifier = window.recaptchaVerifier;

        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            setconfirmationResul(result)
            window.confirmationResult = confirmationResult
            setOTPSend(true)
            setFormSubmit(false)
        } catch (err) {
            console.log(err)
            alert(err)
            setIsOpen(!isOpen)

        } finally {
            setFormSubmit(false)
        }
    };
    return (
        <>
            <div id="recaptcha-container" className="hidden"></div>
            {isOpen && (
                <div className="fixed top-20 md:top-36 left-1/2  transform -translate-x-1/2 w-5/6 sm:w-3/5 md:w-1/2 bg-white p-5 rounded-2xl shadow-2xl z-40">
                    <div className={`flex justify-end `}>
                        <button disabled={OTPsend} onClick={() => {
                            setIsOpen(false);
                            setError({});
                            setFirstName("");
                            setLastName("")
                            setMobileNo("");
                            setLoanType("");
                            setLoanAmount("");
                            setRecaptchaerror("")
                            setValidmobileNo(true)
                            setotp("");
                            setOTPSend(false);

                        }}>
                            <X />
                        </button>
                    </div>

                    <h2 className={`text-center  font-bold bg-gradient-to-r from-emerald-900 to-green-500 bg-clip-text text-transparent tracking-wide ${currentLanguage == "en" ? " text-2xl md:text-4xl" : "font-bengali text-2xl md:text-5xl font-semibold py-4"}`}>
                        {text.Apply.apply_heading}
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col  mt-4 items-center gap-2">
                        <Input
                            type="text"
                            placeholder={`${text.Apply.first_name_input}`}
                            className={`w-11/12 p-2 md:w-4/6 lg:w-3/6 rounded-2xl pl-3 text-base font-medium ${currentLanguage == "en" ? "" : "font-bengali"}`}
                            value={firstName}
                            onChange={e => {
                                const onlyEnglishLetter = e.target.value.replace(/[^A-Za-z]/g, "")

                                setFirstName(onlyEnglishLetter)
                                if (!onlyEnglishLetter) {
                                    setError(prev => ({ ...prev, firstNameError: "First name is required" }))
                                } else {
                                    setError(prev => ({ ...prev, firstNameError: "" }))
                                }
                            }}
                        />
                        <div className="flex justify-center  w-4/5  gap-1">
                            {error.firstNameError && <p className="text-red-500 text-sm w-4/5  md:w-3/5 items-center font-medium"><span className="mr-1 mb-1"><CircleX className="inline" size={18} /></span>{error.firstNameError}</p>}
                        </div>
                        <Input
                            type="text"
                            placeholder={`${text.Apply.last_name_input}`}
                            className=" w-11/12 p-2 md:w-4/6 lg:w-3/6 rounded-2xl pl-3 text-base font-medium font-bengali"
                            value={lastName}
                            onChange={e => {
                                const onlyEnglishLetter = e.target.value.replace(/[^A-Za-z]/g, "")

                                setLastName(onlyEnglishLetter)
                                if (!onlyEnglishLetter) {
                                    setError(prev => ({ ...prev, lastNameError: "Last name is required" }))
                                } else {
                                    setError(prev => ({ ...prev, lastNameError: "" }))
                                }

                            }}
                        />
                        <div className="flex justify-start md:justify-center w-4/5 items-center gap-1">

                            {error.lastNameError && <p className="text-red-500 text-sm w-4/5  md:w-3/5  font-medium"><span className="mr-1 mb-1"><CircleX color="red" className="inline" size={18} /></span>{error.lastNameError}</p>}
                        </div>

                        <Input
                            type="text"
                            placeholder={`${text.Apply.mobile_no_input}`}
                            className="w-11/12 md:w-4/6 lg:w-3/6 pl-3  rounded-2xl  text-base font-medium font-bengali"
                            value={mobileNO}
                            onChange={e => {
                                const onlyDigits = e.target.value.replace(/\D/g, "")
                                setMobileNo(onlyDigits)
                                if (!onlyDigits) {
                                    setError(prev => ({ ...prev, mobileNoError: "Mobile no required" }))
                                } else if (onlyDigits.length !== 10) {
                                    setError(prev => ({ ...prev, mobileNoError: "Mobile no must be exact 10 digits" }))
                                    setValidmobileNo(false)
                                }
                                else {
                                    setError(prev => ({ ...prev, mobileNoError: "" }))
                                    setValidmobileNo(true)
                                }
                            }}

                        />
                        <div className="flex justify-start md:justify-center w-11/12 md:3/5 items-center gap-1">

                            {error.mobileNoError && <p className="text-red-500 text-xs w-11/12  md:w-3/5  font-medium "><span className="mr-1 mb-1"><CircleX color="red" className="inline mb-1" size={18} /></span>{error.mobileNoError}</p>}
                        </div>
                        <Select value={loanType} onValueChange={setLoanType}>
                            <SelectTrigger className=" w-11/12 md:w-4/6 lg:w-3/6 p-2 rounded-2xl  text-base font-bengali font-medium">
                                <SelectValue placeholder={text.Apply.select_input_ui} />
                            </SelectTrigger>
                            <SelectContent modal={false} className={`text-base ${currentLanguage == "en" ? "font-[poppins] font-semibold" : " font-bengali"}`} position="popper">
                                <SelectGroup>
                                    <SelectLabel>{text.Apply.loan}</SelectLabel>
                                    <SelectItem value="Personal">{text.Apply.loan_Type.personal}</SelectItem>
                                    <SelectItem value="Business">{text.Apply.loan_Type.Business}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex justify-start md:justify-center w-4/5 items-center gap-1">
                            {error.loan && <CircleX color="red" size={15} />}
                            {error.loan && <p className="text-red-500 text-sm w-4/5  md:w-3/5 items-center font-medium">{error.loan}</p>}
                        </div>
                        <Input
                            type="text"
                            placeholder={text.Apply.loan_amount_input}
                            className="w-11/12 md:w-4/6 lg:w-3/6 pl-3 rounded-2xl focus:outline-none   text-base font-medium font-bengali"
                            value={loanAmount}
                            onChange={e => {
                                const onlyDigits = e.target.value.replace(/\D/g, "")
                                setLoanAmount(onlyDigits)
                                if (!onlyDigits) {
                                    setError(prev => ({ ...prev, loanAmountError: "Loan amount  is required" }))
                                } else {
                                    setError(prev => ({ ...prev, loanAmountError: "" }))
                                }

                            }}
                        />
                        <div className="flex justify-start md:justify-center w-4/5 items-center gap-1">

                            {error.loanAmountError && <p className="text-red-500 text-sm w-11/12  md:w-3/5 items-center font-medium"><span className="mr-1 mb-1"><CircleX color="red" className="inline" size={18} /></span>{error.loanAmountError}</p>}
                        </div>

                        <Button disabled={OTPsend || !validMobileNo || !(firstName && lastName && mobileNO && loanAmount && loanType)} type="submit" className="bg-gradient-to-r from-pink-400 to-red-500 text-white font-medium px-9 py-1.5 transition duration-200 rounded-2xl hover:scale-105" >
                            Apply
                        </Button>
                        {recaptchaerror && <p className="text-red-500 text-sm w-4/5 p-2 md:w-3/5 items-center font-medium">{recaptchaerror}</p>}
                    </form>
                </div >
            )}
            {
                formSubmit && <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                    <Spinner className="size-20" color="white" />
                </div>
            }

            {
                OTPsend && <div className="fixed flex flex-col items-center justify-center gap-3 h-52 w-4/5 md:w-2/5 sm:w-1/2 top-32 left-1/2 transform -translate-x-1/2 bg-white  rounded-xl shadow-2xl z-50">
                    <div>
                        <h1 className="font-medium text-green-500">Vefify your modible number</h1>
                    </div>
                    <input
                        type="text"
                        maxlength={6}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => {
                            const onlyDigits = e.target.value.replace(/\D/g, "")
                            setotp(onlyDigits)
                        }}
                        className="w-4/5 sm:w-4/5 md:w-3/5  tracking-widest px-4 py-2 border-b-2 border-b-gray-300  focus:outline-none focus:border-b-green-500 text-center shadow-sm text-base font-medium"
                    />
                    {!validOTP && <p className="text-red-500 text-sm w-4/5 p-2 md:w-3/5 items-center font-medium">Enter valid OTP</p>}
                    <button
                        onClick={verifyOtp}
                        disabled={otp.length !== 6}
                        className="bg-green-500 text-white font-medium px-3 py-2 rounded disabled:opacity-50"
                    >
                        Verify OTP
                    </button>
                </div>
            }

            {
                popup && isverified && (
                    <div className="fixed flex justify-center items-center h-40 w-4/5 sm:w-3/5 md:w-1/2 top-32 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-xl shadow-2xl z-50">
                        <h1 className="text-center text-green-500 md:text-2xl font-medium">
                            {message}
                        </h1>
                    </div>
                )
            }
        </>
    );
};

export default Apply;

