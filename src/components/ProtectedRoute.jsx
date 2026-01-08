import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase/firebaseConfig";
import { LoaderCircle } from 'lucide-react';
const ProtectedRoute = ({ children }) => {
    const [Login, setLogin] = useState(null);
    const [validToken, setValidToken] = useState(null)


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(user)
            if (user) {
                setLogin(true)
                const token = localStorage.getItem("token")
                console.log("Token sent to backend:", token);
                const res = await fetch("http://localhost:3000/check-token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.status === 200) {
                    setValidToken(true)
                }
                else {
                    setValidToken(false)
                    auth.signOut();
                }
            } else {
                setLogin(false)
                setValidToken(false)
            }


        });
        return () => unsubscribe();
    }, []);
    console.log(Login, validToken)




    var authorized = Login === true && validToken === true;
    console.log(authorized)
    if (Login === null || validToken === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="relative">
                    <LoaderCircle className="animate-spin size-52 text-blue-600" />
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold font-[poppins] text-pink-600"> Loan Sathi </span>
                </div>
            </div>
        );
    }

    return authorized ? children : <Navigate to="/" replace />;

};

export default ProtectedRoute;
