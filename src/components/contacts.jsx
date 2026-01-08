import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

const Contact = () => {
    return (
        <section id="contact" className="py-8 px-6 sm:px-8 bg-gradient-to-br from-green-50 to-white">
            <div className="max-w-5xl mx-auto ">
                {/* Heading */}
                <div className="flex justify-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-emerald-800 to-green-400 bg-clip-text text-transparent tracking-wide inline-block">
                        Contact Us
                    </h2>
                </div>
                <p className="text-center text-gray-600 mb-12 font-medium text-base">
                    Have questions about our loans or your application? We’re here to help you.
                </p>

                {/* Main container */}
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Left side - Contact Info */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="flex  gap-4">
                            <Phone className="text-green-600" size={28} />
                            <div>
                                <h4 className="font-semibold text-lg">Call Us</h4>
                                <p className="text-gray-600">We’re available Mon–Sat, 9am–6pm</p>
                                <p className="text-gray-600">+91 8695276026</p>
                            </div>
                        </div>
                        <div className="flex i gap-4">
                            <MessageSquare className="text-green-600" size={28} />
                            <div>
                                <h4 className="font-semibold text-lg">Chat with Us</h4>
                                <p className="text-gray-600">We’re available Mon–Sat, 9am–6pm</p>
                                <p className="text-gray-600">+91 8695276026</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Mail className="text-green-600" size={28} />
                            <div>
                                <h4 className="font-semibold text-lg">Email Us</h4>
                                <p className="text-gray-600">agnibhadebnath@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <MapPin className="text-green-600" size={28} />
                            <div>
                                <h4 className="font-semibold text-lg">Visit Us</h4>
                                <p className="text-gray-600">Garia,Panchpota,pin-700152</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Contact;