import { Link } from "react-router-dom";
import man from "../../src/assets/aboutSection.jpg"
import { ArrowRight } from "lucide-react";
import { ModelContext } from "../Contaxt/ModelContext";
import { useContext } from "react";

const About = () => {
    const { isOpen, setIsOpen } = useContext(ModelContext)



    return (
        <>
            <section id="about" className="py-4">

                <div className="w-full  flex flex-wrap bg-green-50" >
                    <div className="inset-0">
                        <div className="py-5 flex justify-center  " >
                            <h1 className="relative md:text-6xl sm:text-4xl text-3xl font-bold text-center 
                 bg-gradient-to-r from-emerald-800 via-green-500 to-emerald-800 bg-clip-text text-transparent 
                 tracking-wide inline-block mx-auto animate-shine brightness-110 [background-size:200%_auto]">
                                About Our Microfinance Platform

                            </h1>
                        </div>
                        <div className=" flex flex-row flex-wrap mx-2 md:mx-4 rounded-lg  items-start justify-center">
                            <div className="  w-3/4 md:w-2/3 px-5 py-5 mx-2 rounded-lg my-4 text-black justify-center">
                                <p className=" text-base sm:text-lg leading-relaxed mb-4">
                                    We help
                                    <span className="  font-semibold bg-gradient-to-r from-white via-green-500 to-white px-2 text-transparent bg-clip-text animate-shine [background-size:200%_auto]">individuals</span> and
                                    <span className="  font-semibold bg-gradient-to-r from-white via-green-500 to-white px-2 text-transparent bg-clip-text animate-shine [background-size:200%_auto]">small businesses</span>
                                    unlock financial freedom through fast, fair credit.
                                    Whether you're starting a business or managing personal needs — we're here to support your growth
                                </p>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3 font-medium text-sm">
                                    <li>Quick approvals and minimal paperwork.</li>
                                    <li>Affordable interest rates tailored to your needs.</li>
                                    <li>Trusted by hundreds of local borrowers.</li> </ul>
                                <div className="text-white flex">
                                    <button onClick={() => {
                                        if (isOpen) {
                                            return
                                        }
                                        else {
                                            setIsOpen(!isOpen)
                                        }
                                    }} className=" bg-green-600 px-4 py-2 rounded-md hover:bg-green-700  gap-2 font-medium flex flex-row items-center hover:scale-105 transition duration-200">
                                        Apply Now
                                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                                            <ArrowRight size={20} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center my-2">
                                <img src={man} alt="" className="object-cover w-68 h-56 rounded-2xl shadow-2xl border-2 border-gray-300" />
                            </div>

                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}
export default About;