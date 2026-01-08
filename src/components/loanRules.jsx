const LoanRules = () => {
    const loanRules = [{
        title: "1️⃣ Borrower Eligibility & Verification ",
        points: ["The borrower must be between 18 and 50 years of age at the time of loan approval.", "Borrower verification is completed in person by the lender or authorized staff.", "A valid government-issued identity document must be shown during verification", "Accepted documents include Aadhaar Card, PAN Card, Voter ID, or Driving License.", "Borrower must declare a regular income source (job, business, pension, or other income)."],
        startingNumber: "1"
    },
    {
        title: "2️⃣ Loan Availability & Structure ",
        points: ["A borrower may take multiple loans, subject to lender approval.", "The loan amount, interest rate, EMI, and tenure are fixed at the time of approval."],
        startingNumber: "6"
    },
    {
        title: "3️⃣ EMI & Repayment Rules",
        points: ["EMI includes both principal and interest; no extra interest is charged separately.", "EMI must be paid once every month on the scheduled due date.", "EMI amount remains the same throughout the loan period."],
        startingNumber: "8"
    },
    {
        title: "4️⃣ Grace Period & Penalty",
        points: ["A 7-day grace period is provided after the EMI due date.", "No penalty is charged during the grace period.", "If EMI is not paid after the grace period, a flat late fee of ₹100 is applied.", "The late fee is charged only once per EMI, not daily."],
        startingNumber: "11"
    },
    {
        title: "5️⃣ Payments, Excess & Loan Closure",
        points: ["Partial payments are allowed at any time during the loan period.", "Any excess payment reduces the outstanding principal of the loan.", "Penalty payments do not reduce principal.", "The loan is considered closed only when both outstanding principal and total outstanding become zero."],
        startingNumber: "15"
    }
    ]
    return (
        <>
            <div className="flex justify-center flex-col items-center bg-gray-50">
                <div className="flex justify-center py-3 mb-2 ">
                    <h1 className="text-center font-extrabold font-[poppins] text-[1.7rem] min-[500px]:text-4xl md:text-5xl tracking-wide text-gray-800">
                        Loan Terms & Conditions
                    </h1>
                </div>
                {loanRules.map((section, index) => (

                    < div key={index} className=" min-[465px]:pl-10 min-[775px]:pl-20 py-4 w-10/12 min-[775px]:w-[750px]">
                        <details className="">
                            <summary className=" cursor-pointer hover:hover:text-blue-600 font-bold text-[1rem] sm:text-xl text-gray-800 mb-4 font-[poppins]">{section.title} </summary>

                            <ol start={section.startingNumber} className="list-decimal px-5 list-inside text-gray-700 text-sm font-medium space-y-2">

                                {section.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}


                            </ol>

                        </details>
                    </div>
                ))}

            </div >
        </>
    )
}
export default LoanRules