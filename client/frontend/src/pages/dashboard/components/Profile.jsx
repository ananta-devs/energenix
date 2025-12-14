import React from 'react';
import { Edit, Info, Trash2 } from 'lucide-react';

const Profile = ({ 
    userData, 
    setShowEditProfileModal, 
    setShowAddAddressModal, 
    addresses,
    handleEditAddress,
    handleDeleteAddress,
    handleSetActiveAddress
}) => {
    return (
        <div>
            
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
                            className="text-gray-600 hover:text-gray-900 cursor-pointer flex"
                        >
                            <Edit className="w-4 h-4" />
                            <p className="relative -top-1 pl-1" > Edit</p>
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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-25 lg:mb-15">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
                    <button 
                        onClick={() => setShowAddAddressModal(true)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                    >
                        + Add
                    </button>
                </div>
                
                {addresses && addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div key={address._id} className={`border-t border-gray-200 pt-4 ${address.isActive ? 'bg-green-50 rounded-lg p-4' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="activeAddress"
                                            checked={address.isActive}
                                            onChange={() => !address.isActive && handleSetActiveAddress(address._id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <div className="ml-4">
                                            <p className="font-semibold flex items-center">
                                                {address.fullName}
                                                {address.isActive && (
                                                    <span className="ml-2 bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-gray-600">{address.addressLine1}</p>
                                            {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
                                            <p className="text-gray-600">{address.city}, {address.state} {address.pinCode}</p>
                                            <p className="text-gray-600">Phone: {address.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleEditAddress(address)}
                                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAddress(address)}
                                            className="text-gray-500 hover:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-2">
                        <Info className="w-5 h-5 text-gray-400"/>
                        <p className="text-sm text-gray-600">No addresses added</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;