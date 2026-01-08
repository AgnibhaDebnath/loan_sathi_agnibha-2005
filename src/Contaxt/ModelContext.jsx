import { createContext, useState } from "react";
export const ModelContext = createContext();
export const ModelProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [LoginFormOpen, setLoginFormOpen] = useState(false)
    const [Borrowerlogin, setBorrowerlogin] = useState(false)
    const [popUp, setPopUp] = useState(false)
    return (
        <ModelContext.Provider value={
            {
                isOpen,
                setIsOpen,
                LoginFormOpen,
                setLoginFormOpen,
                Borrowerlogin,
                setBorrowerlogin,
                popUp,
                setPopUp
            }}
        >
            {children}
        </ModelContext.Provider>
    )
}