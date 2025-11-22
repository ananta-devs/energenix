import React from 'react';
import { Edit, Info } from 'lucide-react';

const Profile = ({ userData, setShowEditProfileModal, setShowAddAddressModal }) => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Profile</h1>
      
      {/* Name and Email Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Name</label>
              <p className="text-gray-900">{userData.fullName}</p>
            </div>
            <button 
              onClick={() => setShowEditProfileModal(true)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 block mb-2">Email</label>
          <p className="text-gray-900">{userData.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">Contact No</label>
          <p className="text-gray-900">{userData.phone}</p>
        </div>

      </div>

      {/* Addresses Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
          <button 
            onClick={() => setShowAddAddressModal(true)}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            + Add
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-2">
          <Info className="w-5 h-5 text-gray-400"/>
          <p className="text-sm text-gray-600">No addresses added</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;