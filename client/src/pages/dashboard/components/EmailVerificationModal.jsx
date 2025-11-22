import React from 'react';

const EmailVerificationModal = ({ showEmailVerificationModal, setShowEmailVerificationModal, formData, verificationCode, setVerificationCode, handleVerifyEmail, handleResendCode }) => {
  if (!showEmailVerificationModal) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify email</h2>
          <p className="text-gray-600 mb-6">
            Enter the code sent to {formData.email}
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6-digit code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleResendCode}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Resend code
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowEmailVerificationModal(false);
                  setVerificationCode('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyEmail}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;