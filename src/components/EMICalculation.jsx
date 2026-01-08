import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleX, Calculator } from "lucide-react";
const FloatingEMICalculator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState("");
    const [months, setMonths] = useState("");
    const [emi, setEmi] = useState(null);
    const [calculaterError, setCalculaterError] = useState({ loanAmountError: "", interestRateError: "", loanTenureError: "" })

    const calculateEMI = (e) => {
        e.preventDefault();


        const principal = parseFloat(amount);
        const monthlyRate = parseFloat(rate) / 12 / 100;
        const tenure = parseInt(months);

        const emiValue =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1);

        setEmi(emiValue.toFixed(2));

    };

    return (
        <>

            <button
                onClick={() => {
                    if (isOpen) {
                        setAmount("");
                        setRate("");
                        setMonths("");
                        setEmi("");

                    }
                    setIsOpen(!isOpen)
                }
                }
                className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-2xl z-50 transition-all font-medium text-base animate-greenpulse"
            >
                <Calculator className="inline" />{isOpen ? "Close EMI Calculator" : "EMI Calculator"}
            </button>


            {isOpen && (
                <div className="fixed bottom-20 right-6 bg-white p-5 rounded-2xl shadow-2xl w-80 z-50 border border-gray-200">
                    <div className="flex justify-center">
                        <h3 className="w-full font-bold bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text text-transparent 
                 tracking-wide inline-block mb-3 text-center text-xl">
                            EMI Calculator
                        </h3>
                    </div>
                    <form className="flex flex-col gap-3 items-center" onSubmit={calculateEMI}>
                        <Input
                            type="text"
                            placeholder="Loan Amount (₹)"
                            value={amount}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, "")
                                setAmount(onlyDigits)
                                if (!onlyDigits) {
                                    setCalculaterError(prev => ({
                                        ...prev, loanAmountError: "Loan Amount required"
                                    }))
                                }
                                else if (onlyDigits < 10000) {
                                    setCalculaterError(prev => ({
                                        ...prev, loanAmountError: "Loan amount must be at least ₹10,000"
                                    }))
                                }
                                else {
                                    setCalculaterError(prev => ({
                                        ...prev, loanAmountError: ""
                                    }))
                                }

                            }}
                            className="rounded-xl font-medium"
                        />
                        {calculaterError.loanAmountError && <p className="text-red-500 font-medium text-sm"><span className="mx-1"><CircleX className="inline" /></span>{calculaterError.loanAmountError}</p>}
                        <Input
                            type="text"
                            placeholder="Interest Rate (%)"
                            value={rate}
                            onChange={e => {
                                const onlyDigits = e.target.value.replace(/[^0-9.]/g, "")
                                setRate(onlyDigits)
                                if (!onlyDigits) {
                                    setCalculaterError(prev => ({
                                        ...prev, interestRateError: "Interest rate is required"
                                    }))
                                }
                                else if (onlyDigits == 0) {
                                    setCalculaterError(prev => ({
                                        ...prev, interestRateError: "Interest rate can not be 0"
                                    }))
                                }
                                else {
                                    setCalculaterError(prev => ({
                                        ...prev, interestRateError: ""
                                    }))
                                }
                            }}
                            className="rounded-xl font-medium"
                        />
                        {calculaterError.interestRateError && <p className="text-red-500 font-medium text-sm"><span className="mx-1"><CircleX className="inline" /></span>{calculaterError.interestRateError}</p>}
                        <Input
                            type="text"
                            placeholder="Tenure (Months)"
                            value={months}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, "")
                                setMonths(onlyDigits)
                                if (!onlyDigits) {
                                    setCalculaterError(prev => ({
                                        ...prev, loanTenureError: "Loan tenure is required"
                                    }))
                                }
                                else if (onlyDigits == 0) {
                                    setCalculaterError(prev => ({
                                        ...prev, loanTenureError: "Loan taenure can not be 0"
                                    }))
                                }
                                else {
                                    setCalculaterError(prev => ({
                                        ...prev, loanTenureError: ""
                                    }))
                                }


                            }}
                            className="rounded-xl font-medium"
                        />
                        {calculaterError.loanTenureError && <p className="text-red-500 font-medium text-sm"><span className="mx-1"><CircleX className="inline" /></span>{calculaterError.loanTenureError}</p>}
                        <Button
                            type="submit"
                            disabled={(!amount || calculaterError.loanAmountError || !rate || calculaterError.interestRateError || !months || calculaterError.loanTenureError)}
                            className=" bg-gradient-to-r from-emerald-800 to-green-500 text-white py-2 rounded-lg   text-base font-medium w-1/2  transition duration-200 hover:scale-x-105"
                        >
                            Calculate
                        </Button>
                    </form>

                    {emi && (
                        <div className="mt-3 text-center font-medium text-green-700">
                            Monthly EMI: ₹{emi}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FloatingEMICalculator;
