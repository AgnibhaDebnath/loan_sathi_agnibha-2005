import { auth } from "@/Firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";
const ProtectedrouteForAdmin = ({ children }) => {
    const [login, setLogin] = useState(null)
    const [validToken, setValidToken] = useState(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLogin(true)
                const token = localStorage.getItem("token")
                if (!token) {
                    setValidToken(false);
                    return;
                }
                const res = await fetch("https://loan-sathi.onrender.com/check-token-for-admin", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json()
                const { success, message } = data
                console.log(success)
                console.log(message)
                if (res.status === 200 && success) {
                    setValidToken(true)
                    toast.success(message, {
                        theme: "light",
                        position: "top-center",
                        autoClose: 5000
                    })
                }
                else {
                    setValidToken(false)
                    auth.signOut();
                    toast.error(message, {
                        theme: "light",
                        position: "top-center",
                        autoClose: 5000
                    })
                }
            } else {
                setLogin(false)
                setValidToken(false)
            }

        });
        return () => unsubscribe();
    }, []);
    var authorized = login === true && validToken === true;
    console.log(authorized)

    if (login === null || validToken === null) {
        return (
            <>
                <ToastContainer />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-3xl font-bold">Loading...</p>
                </div>
            </>
        );
    }

    return authorized ? children : <Navigate to="/" replace />;


}
export default ProtectedrouteForAdmin