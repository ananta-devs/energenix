// components/TermsOfService.jsx
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Refund, Cancellation & Replacement Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
            <p className="text-purple-700">
              This Refund, Cancellation & Replacement Policy ("Policy") forms an integral part of 
              the Terms and Conditions of EnergeniX ("Company", "we", "us", "our"). By placing an 
              order on the EnergeniX website or through any official sales channel, the customer 
              ("you", "user", "buyer") agrees to be bound by this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">1. Nature of Products</h2>
            <p className="text-gray-700 leading-relaxed">
              EnergeniX deals in authentic spiritual and religious products rooted in Hindu culture 
              and tradition. Due to the sacred, personal, and sensitive nature of these products, 
              all sales are considered final, except as expressly provided under this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">2. Order Cancellation</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">2.1 Customer-Initiated Cancellation</h3>
                <p className="text-gray-700 mt-1">
                  Orders may be cancelled within 1 (one) hour of successful order placement.
                  Cancellation requests received after 1 hour shall not be accepted under any 
                  circumstances, as order processing begins immediately.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-800">2.2 Cancellation Charges</h3>
                <p className="text-gray-700 mt-1">
                  No cancellation charges shall apply for cancellations made within the permissible 
                  1-hour window. If EnergeniX cancels an order due to reasons including but not 
                  limited to inventory unavailability, logistical constraints, or force majeure 
                  events, the customer shall receive a full refund of the paid amount.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">3. Refund & Replacement Eligibility</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <p className="text-red-700 font-semibold">
                EnergeniX follows a replacement-only policy. Refunds are not provided except where legally mandated.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">3.1 Eligible Grounds for Replacement</h3>
                <p className="text-gray-700 mt-1">
                  Replacement requests shall be accepted only in the following cases:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700 ml-4">
                  <li>Product received in damaged condition</li>
                  <li>Manufacturing defect</li>
                  <li>Incorrect product delivered</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">3.2 Mandatory Proof</h3>
                <p className="text-gray-700 mt-1">
                  Customers must notify EnergeniX within 1 (one) day of receiving the product.
                  Submission of a clear unboxing video and photographic evidence is mandatory.
                  Failure to provide sufficient proof shall result in rejection of the request.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">4. Non-Eligible Cases</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-700">
                The following scenarios are strictly excluded from replacement or refund:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700 ml-4 space-y-1">
                <li>Size-related issues</li>
                <li>Dissatisfaction with quality, appearance, or personal expectations</li>
                <li>Change of mind or personal preference</li>
                <li>Products damaged, altered, or washed by the customer</li>
                <li>Products not returned in original packaging or original condition</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Customers are advised to review all product descriptions, specifications, 
                and size details carefully prior to placing an order.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">5. Replacement Process (Size Exchange Only)</h2>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-gray-700 mb-4">
                Where a size exchange is approved at the sole discretion of EnergeniX, 
                the following process shall apply:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>The customer must initiate the request within 1 day of delivery via official communication channels.</li>
                <li>The unused product must be returned in its original packaging.</li>
                <li>The product shall undergo internal inspection and verification.</li>
                <li>Upon approval, a non-refundable replacement handling fee of ₹200 shall be payable by the customer.</li>
                <li>Replacement dispatch shall be initiated only after receipt of the applicable fee, and tracking details shall be provided.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">6. Complaint Handling & Resolution</h2>
            <p className="text-gray-700 leading-relaxed">
              All complaints raised through email or authorized support channels shall be acknowledged within 48 hours.
              EnergeniX shall endeavor to resolve all complaints within 30 days from the date of receipt, 
              in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">7. Right to Refuse</h2>
            <p className="text-gray-700 leading-relaxed">
              EnergeniX reserves the absolute right to reject any return, replacement, or refund request 
              that does not meet the conditions specified in this Policy, and to void shipments and 
              process refunds in cases of unforeseen or uncontrollable circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">8. Contact Information</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
              <p className="text-gray-700">
                For any queries, grievances, or support requests, customers may contact:
              </p>
              <p className="text-gray-700 mt-2">📧 Email: energenix.help@gmail.com</p>
              <p className="text-gray-700">📞 Phone / WhatsApp: +91 94761 56308</p>
              <p className="text-gray-700">🕒 Support Hours: Monday to Saturday | 10:00 AM – 6:00 PM (IST)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">9. Governing Law & Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              This Policy shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising out of or relating to this Policy shall be subject to the 
              exclusive jurisdiction of Indian courts.
            </p>
          </section>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
            <p className="text-yellow-700">
              <strong>Important:</strong> By placing an order with EnergeniX, you acknowledge that you have read, 
              understood, and agreed to this Refund, Cancellation & Replacement Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;