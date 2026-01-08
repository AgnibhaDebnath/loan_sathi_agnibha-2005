import { ModelContext } from "@/Contaxt/ModelContext";
import { useContext, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { X, CircleX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"
import { auth } from "../Firebase/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "./ui/button";

const Borrowerlogin = () => {
    const { Borrowerlogin, setBorrowerlogin } = useContext(ModelContext)
    const [mobileNo, setMobileNo] = useState('')
    const [OTPSend, setOTPSend] = useState(false);
    const [validOTP, setValidOTP] = useState(true)
    const [validmobileNo, setValidmobileNo] = useState(true)
    const [confirmationResult, setconfirmationResult] = useState("")
    const [formSubmit, setFormSubmit] = useState(false)
    const [otp, setotp] = useState('')
    const [seconds, setSeconds] = useState()

    const navigate = useNavigate();
    useEffect(() => {

        if (seconds <= 0) {
            console.log("run")
            setBorrowerlogin(true)
            setOTPSend(false)
            return
        }
        const timerID = setInterval(() => {
            setSeconds(prev => prev - 1)
        }, 1000)
        return () => clearInterval(timerID)
    }, [seconds])
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
            console.log(err)
            setFormSubmit(false)
        }
    };
    const verifyOtp = async () => {
        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;
            const token = await user.getIdToken()
            console.log(token)
            const res = await fetch("http://localhost:3000/api/borrower-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()
            const { message } = data
            if (res.ok) {
                toast.success(message, {
                    theme: "light",
                    position: "top-center",
                    autoClose: 5000
                })

                localStorage.setItem("token", token);

                setOTPSend(false)
                setotp('')
                setTimeout(() => {
                    setBorrowerlogin(false)
                    navigate("borrower/LoanStatusSection");
                }, 5000);

            }

        } catch (err) {
            console.log(err);
            setValidOTP(false)
        }
    }
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            setupRecaptcha();  // create only ONCE
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmit(true)
        try {
            const response = await fetch("http://localhost:3000/check-borrower-exist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ mobileNo })
            })
            const data = await response.json()
            const { exist } = data;
            if (!response.ok) {
                toast.error("Server error", {
                    autoClose: 5000,
                    position: "top-center",
                    theme: "light"
                })
                return
            }
            if (!exist) {
                toast.error("Mobile no is not registered", {
                    autoClose: 5000,
                    position: "top-center",
                    theme: "light"
                })
                setBorrowerlogin(true)
                setFormSubmit(false)
                return;
            }
            else {
                setupRecaptcha();
                setBorrowerlogin(false)
                const phoneNumber = '+91' + mobileNo;
                const appVerifier = window.recaptchaVerifier;
                try {
                    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                    setconfirmationResult(result)
                    window.confirmationResult = result
                    setOTPSend(true)
                    setSeconds(60)
                } catch (err) {
                    console.log(err)
                    alert(err.message)
                    setMobileNo('')
                    setBorrowerlogin(true)
                } finally {
                    setFormSubmit(false)
                }
            }
        } catch (err) {
            alert(err.message)
            setBorrowerlogin(true)
        }
    }
    return (
        <>
            <ToastContainer />
            <div id="recaptcha-container" className="hidden"></div>
            {Borrowerlogin && <div className="fixed top-20 md:top-36 left-1/2  transform -translate-x-1/2 w-4/5 sm:w-3/5 lg:w-2/5 bg-white p-5 rounded-xl shadow-2xl z-40">
                <div className="flex justify-end ">
                    <button onClick={() => {
                        setBorrowerlogin(!Borrowerlogin)
                        setMobileNo("")
                        setValidmobileNo(true)
                    }}>
                        <X />
                    </button>
                </div>
                <div className="flex justify-center my-2 py-2">
                    <h1 className="text-center font-bold text-xl sm:text-2xl md:text-3xl">Borrower Login</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center gap-2 text-base font-medium">
                        <Input onChange={e => {
                            setMobileNo(e.target.value.replace(/\D/g, ""))
                            if (e.target.value.length === 10) {
                                setValidmobileNo(true)
                            }
                            else {
                                setValidmobileNo(false)
                            }
                        }}

                            value={mobileNo} placeholder="Enter mobile no" className="lg:w-4/6 w-4/5 md:w-3/5 rounded-2xl  " />
                        {!validmobileNo &&
                            <div className="flex flex-row items-center gap-1">
                                <CircleX color="red" />
                                <p className="font-medium text-red-500">Enter valid mobile no</p>
                            </div>
                        }
                        <Button disabled={mobileNo.length !== 10 || OTPSend} type="submit" className="py-1 rounded-2xl px-5 bg-gradient-to-r text-white hover:scale-105 from-pink-600 to-red-500 transition duration-200">submit</Button>
                    </div>
                </form>
            </div>}
            {formSubmit && <div className="fixed inset-0  flex items-center justify-center bg-white/60 z-50">
                <Spinner className="size-20" color="white" />
            </div>}
            {OTPSend && <div className="fixed flex flex-col items-center justify-center gap-3 h-52 w-4/5 md:w-2/5 sm:w-1/2 top-32 left-1/2 transform -translate-x-1/2 bg-white  rounded-xl shadow-2xl z-50">
                <div>
                    <h1 className="font-medium  text-green-500">Vefify your mobile number</h1>
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
                        <p className="font-medium text-red-500">Wrong otp</p>
                    </div>
                }
                <button
                    onClick={verifyOtp}
                    disabled={otp.length !== 6}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-3 py-2 rounded-lg hover:scale-x-105 transition duration-200 disabled:opacity-50"
                >
                    Verify OTP
                </button>
                <p className="font-medium text-red-500">{seconds} seconds left</p>
            </div>}

        </>
    )
}
export default Borrowerlogin;