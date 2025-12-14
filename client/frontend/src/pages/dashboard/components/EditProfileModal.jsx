import React from 'react';
import { X } from 'lucide-react';

const EditProfileModal = ({ showEditProfileModal, setShowEditProfileModal, formData, handleChange, handleSaveProfile }) => {
  if (!showEditProfileModal) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit profile</h2>
          <button
            onClick={() => setShowEditProfileModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Contact No</label>
              <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                  placeholder="Contact number"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
            <p className="text-xs text-gray-500 mt-1">This email is used for sign-in and order updates.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowEditProfileModal(false)}
            className="px-6 py-2 text-gray-700 bg-red-500 rounded-md hover:text-gray-900 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;