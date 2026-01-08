import { ModelContext } from "@/Contaxt/ModelContext";
import { useContext, useState } from "react";
import { Input } from "./ui/input";
import { X, CircleX, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "../Firebase/firebaseConfig";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Spinner } from "@/components/ui/spinner"
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const navigate = useNavigate()
    const { LoginFormOpen, setLoginFormOpen } = useContext(ModelContext)
    const [mobileNo, setMobileNO] = useState("")

    const [password, setPassword] = useState("")


    const [adminName, setAdminName] = useState("")
    const [error, setError] = useState({ adminNameError: "", mobileNoError: "", passwordError: "", mobileNoORNameMismatchError: "", passwordMismatchError: "" })
    const [validMobileNo, setValidMobileNo] = useState(false)
    const [confirmationResult, setconfirmationResult] = useState()
    const [OTPSend, setOTPSend] = useState(false)
    const [otp, setotp] = useState('')
    const [validOTP, setValidOTP] = useState(true)
    const [formSubmit, setFormSubmit] = useState(false)
    const setupRecaptcha = () => {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    size: "invisible",
                    callback: () => console.log("reCAPTCHA verified ✅"),
                });

                window.recaptchaVerifier.render().then((widgetId) => {
                    window.recaptchaWidgetId = widgetId;
                });
            } else {
                // ✅ Reset existing widget if already rendered
                window.grecaptcha.reset(window.recaptchaWidgetId);
            }
        } catch (err) {
            toast.error(err.message, {
                position: "top-center",
                theme: "light",
                autoClose: 5000
            })
            setFormSubmit(false)
        }
    };

    const verifyOtp = async () => {
        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;
            const token = await user.getIdToken()
            const res = await fetch("http://localhost:3000/api/admin-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            const { message } = data
            console.log(res.ok)
            if (res.ok) {
                setOTPSend(false)
                setotp('')
                setValidOTP(true)
                localStorage.setItem("token", token);
                toast.success(message, {
                    toastId: "otpSuccess",
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })

                navigate("/admin")



            }
            else if (res.status == 500) {
                toast.error(message, {
                    toastId: "otpError500",
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })
            } else if (res.status == 404) {
                toast.error(message, {
                    toastId: "otpError404",
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })
            }
        } catch (err) {
            console.log(err);
            setValidOTP(false)
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmit(true)
        try {
            const res = await fetch("http://localhost:3000/verify-admin-mobileNo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ adminName, mobileNo })
            })

            const data = await res.json()
            const { success, message, error } = data
            if (!res.ok || !success) {
                setFormSubmit(false)
                setError(prev => ({ ...prev, mobileNoORNameMismatchError: message }))
                toast.error(error, {
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })
                return
            } else {
                setError(prev => ({ ...prev, mobileNoORNameMismatchError: "" }))
                const responce = await fetch("http://localhost:3000/verify-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ password, mobileNo })

                })
                const responceData = await responce.json()
                console.log(responceData)
                const { verify, inform, error } = responceData
                console.log(error)
                if (!responce.ok || !verify) {
                    setError(prev => ({ ...prev, passwordMismatchError: inform }))
                    toast.error(error, {
                        theme: "light",
                        position: "top-center",
                        autoClose: 5000
                    })
                    return
                } else {
                    setError(prev => ({ ...prev, passwordMismatchError: "" }))
                    toast.success("All credentials verified", {
                        autoClose: 5000,
                        theme: "light",
                        position: "top-center"
                    })

                    setupRecaptcha()
                    const phoneNumber = '+91' + mobileNo;
                    const appVerifier = window.recaptchaVerifier;
                    try {
                        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                        setconfirmationResult(result)
                        window.confirmationResult = result
                        setOTPSend(true)

                    } catch (err) {
                        toast.error(err.message, {
                            theme: "light",
                            position: "top-center",
                            autoClose: 5000
                        })

                    } finally {
                        setFormSubmit(false)

                    }
                }
            }

        } catch (err) {
            console.log(err)
        } finally {
            setFormSubmit(false)
        }

    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover />
            <div id="recaptcha-container" className="hidden"></div>
            {LoginFormOpen && <div className="fixed top-20 md:top-36 left-1/2  transform -translate-x-1/2 w-4/5 sm:w-3/5 lg:w-2/5 bg-white p-5 rounded-2xl shadow-2xl z-40">
                <div className="flex justify-end ">
                    <button onClick={() => {
                        setLoginFormOpen(!LoginFormOpen)
                        setError("")

                        setMobileNO("")
                        setPassword("")
                        setAdminName("")
                    }}>
                        <X />
                    </button>
                </div>
                <div className="flex justify-center my-2 py-2">
                    <h1 className="text-center font-bold text-2xl sm:text-2xl md:text-3xl">Admin login from</h1>
                </div>
                {(error.mobileNoORNameMismatchError || error.passwordMismatchError) && <div className="my-2 flex justify-center  w-full">
                    <div className=" py-3 border-2 rounded-2xl lg:w-4/6 w-4/5 md:w-3/5 flex justify-center flex-col items-center ">
                        {error.mobileNoORNameMismatchError && <h3 className="text-red-500 font-semibold"><span>< TriangleAlert className="inline mr-1 mb-1" size={20} /></span>{error.mobileNoORNameMismatchError}</h3>}

                        {error.passwordMismatchError && <h3 className="text-red-500 font-semibold"><span>< TriangleAlert className="inline mr-1 mb-1" size={20} /></span>{error.passwordMismatchError}</h3>}
                    </div>
                </div>}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center justify-center gap-2 text-base font-medium">
                        <Input placeholder="Admin name"
                            onChange={e => {
                                const onlyLetterAndSpace = e.target.value.replace(/[^a-zA-Z\s]/g, "")
                                setAdminName(onlyLetterAndSpace)
                                if (!onlyLetterAndSpace) {
                                    setError(prev => ({ ...prev, adminNameError: "Admin name is required" }))
                                } else {
                                    setError(prev => ({ ...prev, adminNameError: "" }))
                                }
                            }}
                            value={adminName}
                            className="lg:w-4/6 w-4/5 md:w-3/5 rounded-2xl" />
                        {error.adminNameError && <p className="text-red-500"><span><CircleX size={20} className="inline mb-1" /></span>{error.adminNameError}</p>}

                        <Input placeholder="Mobile no"
                            type="text"
                            onChange={e => {
                                const onlyDigits = e.target.value.replace(/\D/g, "")
                                setMobileNO(onlyDigits)
                                if (!onlyDigits) {
                                    setError(prev => ({ ...prev, mobileNoError: "Mobile no is required" }))
                                }
                                else if (onlyDigits.length !== 10) {
                                    setError(prev => ({ ...prev, mobileNoError: "Mobile no must be exact 10 digits" }))
                                    setValidMobileNo(false)
                                }
                                else {
                                    setError(prev => ({ ...prev, mobileNoError: "" }))
                                    setValidMobileNo(true)
                                }
                            }}
                            value={mobileNo}
                            className="lg:w-4/6 w-4/5 md:w-3/5 rounded-2xl" />
                        {error.mobileNoError && <p className="text-red-500 lg:w-4/6 w-4/5 md:w-3/5"><span className=""><CircleX size={20} className="inline mb-1" /></span><span className="">{error.mobileNoError}</span></p>}

                        <Input placeholder=" Password"
                            type="password"
                            onChange={e => {
                                const password = e.target.value;
                                setPassword(password)
                                if (!password) {
                                    setError(prev => ({ ...prev, passwordError: "Password is required" }))
                                } else {
                                    setError(prev => ({ ...prev, passwordError: "" }))
                                }

                            }}
                            value={password}
                            className="lg:w-4/6 w-4/5 md:w-3/5 rounded-2xl" />
                        {error.passwordError && <p className="text-red-500"><span><CircleX size={20} className="inline mb-1" /></span>{error.passwordError}</p>}
                        <Button disabled={!(adminName && mobileNo && password) || !validMobileNo} className="py-1 rounded-2xl px-9 bg-gradient-to-r text-white hover:scale-105 from-pink-600 to-red-500 transition duration-200">Verify</Button>
                    </div>
                </form>
            </div>}
            {formSubmit && <div className="fixed inset-0  flex items-center justify-center bg-white/60 z-50">
                <Spinner className="size-20" color="black" />
            </div>}
            {OTPSend && <div className="fixed flex flex-col items-center justify-center gap-3 h-52 w-4/5 md:w-2/5 sm:w-1/2 top-32 left-1/2 transform -translate-x-1/2 bg-white  rounded-xl shadow-2xl z-50">
                <div>
                    <h1 className="font-medium  text-green-500">Vefify mobile number</h1>
                </div>
                <input

                    maxlength={6}
                    placeholder="Enter OTP"
                    type="password"
                    value={otp}
                    onChange={e => {
                        const onlyDigits = e.target.value.replace(/\D/g, "")
                        setotp(onlyDigits)
                    }}
                    className="w-4/5 sm:w-4/5 md:w-3/5  tracking-widest px-4 py-2 border-b-2 border-b-gray-300  focus:outline-none focus:border-b-green-500 text-center shadow-sm text-base font-medium"
                />
                {!validOTP &&
                    <div className="flex flex-row items-center gap-1">
                        <CircleX color="red" />
                        <p className="font-medium text-red-500">Enter valid otp</p>
                    </div>
                }
                <button
                    onClick={verifyOtp}
                    disabled={otp.length !== 6}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-3 py-2 rounded-lg hover:scale-x-105 transition duration-200 disabled:opacity-50"
                >
                    Verify OTP
                </button>
            </div>}

        </>
    )
}
export default AdminLogin;