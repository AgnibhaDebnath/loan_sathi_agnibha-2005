import { signOut } from 'firebase/auth';
import { auth } from '@/Firebase/firebaseConfig';
import { Link } from 'react-router-dom';
import { Menu, Handshake, LogOut } from 'lucide-react';
const AdminHeader = () => {
    return (

        <header className="fixed w-full top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-700 via-green-100 to-green-600  backdrop-blur-2xl brightness-105 sm:px-8   ">
            <nav className="flex justify-between">
                <div className='text-3xl font-bold justify-between w-full flex items-center py-2 px-3 gap-2'>
                    <div className="flex flex-row items-center gap-3">
                        <div className='h-12 w-12 rounded-full bg-white flex justify-center items-center'>
                            <Handshake color='blue' />
                        </div>
                        <h1 className='font-[Poppins] text-white inline-block'>Loan Sathi</h1>
                    </div>
                    <ul className="hidden md:flex">
                        <div className="flex flex-row items-center gap-16 text-white sm:text-base font-medium text-sm">
                            <li className="hover:scale-105 transition duration-200 hover:text-yellow-300 font-[poppins] font-semibold"><Link to="/admin/admin-profile ">Admin profile</Link></li>
                            <li className="hover:scale-105 transition duration-200 hover:text-yellow-300 font-[poppins] font-semibold"><Link to="/admin/loans">EMI Section</Link></li>
                            <button onClick={() => {
                                signOut(auth)
                                navigate("/")
                            }
                            } className="hover:scale-105 transition duration-200 hover:text-red-500 font-[poppins] font-semibold"><span><LogOut className='inline' /></span>logout</button>
                        </div>
                    </ul>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <Menu color="white" />
                        </button>
                    </div>
                </div>
            </nav>
        </header>

    )
}
export default AdminHeader