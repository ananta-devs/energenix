import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ShippingInfo = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/");
    };
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Back Button */}
            <button
                onClick={handleBackClick}
                className="mb-6 ml-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Homepage</span>
            </button>
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Shipping Policy – EnergeniX
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="space-y-8">
                    <section className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                        <p className="text-blue-700">
                            At EnergeniX, we are committed to delivering your
                            orders safely, securely, and within the shortest
                            possible time while maintaining premium packaging
                            standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Order Processing & Dispatch
                        </h2>
                        <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 ml-4">
                            <li>
                                All online prepaid orders are processed and
                                dispatched within 1–2 working days after order
                                confirmation.
                            </li>
                            <li>
                                Orders are shipped Monday to Saturday, excluding
                                Sundays and public holidays.
                            </li>
                            <li>
                                Payments on our website are securely processed
                                through Razorpay.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Delivery Timeline
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-700 mb-2">
                                    Non-customized products
                                </h3>
                                <p className="text-gray-700">
                                    Delivered within 5–7 working days from
                                    dispatch
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-700 mb-2">
                                    Customized products
                                </h3>
                                <p className="text-gray-700">
                                    Delivered within 5–9 working days from
                                    dispatch (if applicable)
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-4">
                            Delivery timelines may vary based on location,
                            courier partner, or unforeseen circumstances.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Shipping Partner
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            All shipments are handled through our integrated
                            logistics partner <strong>Shipmozo</strong>, using
                            reputed courier services.
                        </p>
                        <p className="text-gray-700 mt-2">
                            In locations where courier services are unavailable,
                            delivery may be attempted via
                            <strong> India Post</strong>, subject to service
                            availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Shipping Charges & Taxes
                        </h2>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-green-800 font-semibold">
                                ✅ Free shipping across India on all prepaid
                                orders, unless otherwise stated.
                            </p>
                            <p className="text-gray-700 mt-2">
                                All product prices are inclusive of applicable
                                GST, as per Government of India regulations.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Delivery Exceptions
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            For remote or non-serviceable areas, customers may
                            be requested to collect the parcel from the nearest
                            courier hub.
                        </p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4 rounded">
                            <p className="text-yellow-800">
                                <strong>Note:</strong> EnergeniX shall not be
                                responsible for delays caused by courier
                                partners, natural calamities, or force majeure
                                events.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Damaged or Tampered Packages
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you receive a package that appears tampered with
                            or damaged:
                        </p>
                        <ol className="list-decimal list-inside mt-3 space-y-2 text-gray-700 ml-4">
                            <li>
                                <strong>Do not accept</strong> the delivery
                            </li>
                            <li>
                                Contact us immediately at{" "}
                                <strong>energenix.official@gmail.com</strong>{" "}
                                with your Order ID
                            </li>
                            <li>
                                Upon verification, we will arrange a replacement
                                at no additional cost
                            </li>
                        </ol>
                        <p className="text-gray-700 mt-4">
                            Please ensure the original packaging and product
                            tags remain intact.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Cancellation & Returns
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Order cancellations are governed strictly by our
                            Refund & Cancellation Policy.
                        </p>
                        <p className="text-gray-700 mt-2">
                            All sales are final. Products are non-returnable,
                            except in cases of damage, defect, or wrong item
                            delivered.
                        </p>
                        <p className="text-gray-700 mt-2">
                            Replacement requests must include clear images and
                            unboxing video proof and are subject to inspection.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            Refunds
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Refunds are issued only if a replacement is not
                            possible.
                        </p>
                        <p className="text-gray-700 mt-2">
                            Approved refunds will be processed to the original
                            payment method within timelines determined by the
                            payment provider or bank.
                        </p>
                    </section>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
                        <h3 className="font-semibold text-blue-700 mb-4">
                            Contact Information
                        </h3>
                        <p className="text-gray-700">
                            📧 Email: energenix.official@gmail.com
                        </p>
                        <p className="text-gray-700">
                            📞 Phone / WhatsApp: +91 94761 56308
                        </p>
                        <p className="text-gray-700">
                            🕒 Support Hours: Mon–Sat | 10:00 AM – 6:00 PM
                        </p>
                        <p className="text-gray-700 mt-2">
                            📦 Shipping Partner: Shipmozo
                        </p>
                        <p className="text-gray-700">
                            💳 Payment Gateway: Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
