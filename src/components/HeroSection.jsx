import { Link } from "react-router-dom";
import money from "../../src/assets/heroSection.jpg"
import { ArrowRight } from 'lucide-react';
import { ModelContext } from "../Contaxt/ModelContext";
import { useContext } from "react";
import BlurText from "./ui/BlurText";
import { getText } from "@/i18n/useLanguage";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
const HeroSection = () => {
    const currentLanguage = localStorage.getItem("lang") || "en"
    const text = getText()
    const { isOpen, setIsOpen } = useContext(ModelContext)
    return (
        <>

            <div className="relative  h-[70vh] sm:h-screen mx-0 md:mx-4 md:rounded-b-2xl md:rounded-t-xl  overflow-hidden ">
                {/* Background Image */}
                <img
                    src={money}
                    alt="Money background"
                    className="absolute inset-0 w-full h-full object-cover "
                />


                <div className="absolute inset-0 bg-black bg-opacity-50 ">


                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white">
                        <div >
                            <BlurText
                                text={`${text.home.hero_title}`}
                                delay={400}
                                animateBy="words"
                                direction="top"
                                className="text-3xl py-5 sm:text-4xl md:text-5xl xl:text-6xl  font-bold   brightness-150  "
                            />
                        </div>

                        <p className={`text-lg mb-6  ${currentLanguage == "en" ? "font-[poppins] font-semibold" : 'font-bengali text-xl'}`}>{text.home.hero_subtitle}</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger >
                                    <button onClick={() => {
                                        if (isOpen) {
                                            return
                                        } else {
                                            setIsOpen(!isOpen)
                                        }
                                    }} className={`bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1.5 rounded-lg   gap-2  flex flex-row items-center hover:scale-105 transition duration-200 ${currentLanguage == "en" ? "font-[poppins] font-semibold" : "font-bengali font-semibold"}`}>
                                        {text.home.CTA}
                                        <ArrowRight size={20} strokeWidth={3} />
                                    </button>
                                    <TooltipContent className="font-medium px-4 py-3 hidden md:block">
                                        <p>Click to start you loan application</p>
                                        <TooltipArrow></TooltipArrow>
                                    </TooltipContent>
                                </TooltipTrigger>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

            </div>


        </>
    )
}
export default HeroSection;