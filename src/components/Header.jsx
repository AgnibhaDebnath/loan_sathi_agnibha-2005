
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useContext, useRef, useState, useEffect } from "react";
import { ModelContext } from '../Contaxt/ModelContext';
import { Handshake, Globe } from 'lucide-react';
import { getText } from '@/i18n/useLanguage';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';
const Header = () => {
    const text = getText()
    const Links = [
        {
            LinkName: text.nav.about,
            LinkTo: "#about",

        },
        {
            id: 1,
            buttonName: text.nav.apply,

        },
        {
            id: 2,
            buttonName: text.nav.my_loan,

        },
        {
            LinkName: text.nav.contact,
            LinkTo: "#contact"
        },
        {
            buttonName: text.nav.admin,

        },
        {
            buttonName: "bengali",

        },



    ]
    const currentLanguage = localStorage.getItem("lang") || "en"
    const changeLanguage = () => {
        const newlang = currentLanguage === "en" ? "bn" : "en"
        localStorage.setItem("lang", newlang)
        window.location.reload()
    }
    const navRef = useRef();
    const scrollLeft = () => {
        navRef.current.scrollBy({ left: -150, behavior: "smooth" })
    }
    const scrollRight = () => {
        navRef.current.scrollBy({ left: 150, behavior: "smooth" })
    }

    const { isOpen, setIsOpen } = useContext(ModelContext);
    const { LoginFormOpen, setLoginFormOpen } = useContext(ModelContext)
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1000);
    const { Borrowerlogin, setBorrowerlogin } = useContext(ModelContext)
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 1000);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (

        <header className="sticky brightness-125 z-50 top-0 bg-gradient-to-r from-emerald-700 via-green-100 to-green-600">
            {isWideScreen &&
                <div className=' font-extrabold flex items-center py-2 px-3  gap-2 '>
                    <div className='h-12 w-12 rounded-full bg-white flex justify-center items-center'>
                        <  Handshake color='blue' />

                    </div>
                    <a className={`${currentLanguage == "en" ? "text-3xl inline-block font-[poppins]" : "font-bengali text-4xl"}  text-white  `} href="/"><span  >{text.app_name}</span></a>
                    <div className="min-[1230px]:w-10/12 w-9/12 flex items-center justify-end gap-3">
                        <Globe className="h-5 w-5 text-white opacity-80" aria-hidden="true" />
                        <button onClick={changeLanguage}
                            type="button"
                            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-base text-gray-200 shadow-sm backdrop-blur
               transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                        >
                            <span className={`${currentLanguage == "en" ? "font-bengali text-[1.3rem]" : "font-[poppins] font-semibold "}`}>{currentLanguage === "en" ? "বাংলা" : "English"}</span>
                        </button>
                    </div>

                </div>
            }
            <nav className="w-full flex justify-center items-center py-2  ">

                <button
                    onClick={scrollLeft}
                    className="bg-gray-100 p-2 sm:p-2.5 rounded-l-full z-10 min-[1085px]:hidden"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className='min-[1085px]:p-[3px] sm:bg-gradient-to-r from-white via-yellow-400 to-white w-2/3 flex min-[1085px]:rounded-full justify-center animate-shine bg-[length:200%_200%]'>
                    <div ref={navRef} className="justify-evenly py-2 flex w-full items-center bg-white min-[1085px]:rounded-full scrollbar-hide whitespace-nowrap overflow-x-auto">
                        <ul className="flex flex-row items-center">
                            {Links.map((link, index) =>
                                <li key={index} className={`px-2 sm:px-2 md:px-3 lg:px-5 font-semibold text-sm sm:text-base hover:text-green-400 hover:scale-105 ${currentLanguage == "en" ? "font-[poppins]" : "font-bengali text-gray-700"} transition duration-200`}>
                                    {link.buttonName ? (
                                        (() => {
                                            switch (link.buttonName) {
                                                case text.nav.apply:
                                                    return <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button key={link.id} onClick={() => {
                                                                    if (isOpen) {
                                                                        return
                                                                    }
                                                                    else {
                                                                        setIsOpen(true)
                                                                    }
                                                                }} >
                                                                    {link.buttonName}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" align="centre" className="hidden md:block bg-gray-800 text-white p-2 rounded-lg  font-medium px-4">
                                                                <p>Click to start your loan application</p>
                                                                <TooltipArrow className="TooltipArrow"></TooltipArrow>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                case text.nav.my_loan:
                                                    return <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button key={link.id} onClick={() => {
                                                                    setBorrowerlogin(!Borrowerlogin);
                                                                }
                                                                }>
                                                                    {link.buttonName}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="hidden md:block bg-gray-800 text-white p-2 rounded-lg  font-medium px-4">
                                                                <p>Login to view your EMI history</p>
                                                                <TooltipArrow className="TooltipArrow"></TooltipArrow>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                case text.nav.admin:
                                                    return <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button key={link.id} onClick={() => {
                                                                    setLoginFormOpen(!LoginFormOpen)
                                                                }
                                                                }>
                                                                    {link.buttonName}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="hidden md:block bg-gray-800 text-white p-2 rounded-lg  font-medium px-4">
                                                                <p>Login as admin to continue</p>
                                                                <TooltipArrow className="TooltipArrow"></TooltipArrow>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                case "bengali":
                                                    return <button className='display-block min-[1000px]:hidden' key={link.id} onClick={() => {
                                                        changeLanguage()
                                                    }
                                                    }>
                                                        {currentLanguage === "en" ? "Bengali" : "ইংলিশ "}
                                                    </button>
                                                default:
                                                    return <button>{link.buttonName}</button>
                                            }
                                        })()
                                    ) : (
                                        <a href={link.LinkTo}>{link.LinkName}</a>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <button
                    onClick={scrollRight}
                    className="bg-gray-100 p-2 sm:p-2.5 rounded-r-full z-60 min-[1085px]:hidden"
                >
                    <ChevronRight size={20} />
                </button>
            </nav>
        </header>
    )
}
export default Header;