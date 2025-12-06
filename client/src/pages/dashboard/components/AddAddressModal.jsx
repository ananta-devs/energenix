import React from 'react';
import { X } from 'lucide-react';

const AddAddressModal = ({ showAddAddressModal, setShowAddAddressModal, addressForm, setAddressForm, handlePinChange, cityRef, stateRef, pinRef, handleSaveAddress }) => {
  if (!showAddAddressModal) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Address</h2>
          <button
            onClick={() => setShowAddAddressModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          
          {/* Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm">Set as default address</label>
          </div>

          {/* Full Name */}
          <input
            type="text"
            value={addressForm.fullName}
            onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
            placeholder="Full name"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 border border-r-0 bg-gray-50 rounded-l-md">
                🇮🇳
              </div>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                placeholder="+91"
                className="flex-1 px-3 py-2 border rounded-r-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <input
            type="text"
            value={addressForm.addressLine1}
            onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
            placeholder="Address line 1"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          {/* Address Line 2 */}
          <input
            type="text"
            value={addressForm.addressLine2}
            onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
            placeholder="Apartment, suite, etc (optional)"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          {/* City / State / Pincode */}
          <div className="grid grid-cols-3 gap-4">

            <input
              type="text"
              value={addressForm.city}
              readOnly
              placeholder='Auto-filled'
              ref={cityRef}
              className="px-3 py-2 border rounded-md cursor-not-allowed"
            />

            <input
              type="text"
              value={addressForm.state}
              readOnly
              placeholder='Auto-filled'
              ref={stateRef}
              className="px-3 py-2 border rounded-md cursor-not-allowed"
            />

            <input
              type="text"
              value={addressForm.pinCode}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="PIN code"
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              ref={pinRef}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowAddAddressModal(false)}
            className="px-6 py-2 text-gray-900 bg-red-500 rounded-md hover:text-gray-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAddress}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;