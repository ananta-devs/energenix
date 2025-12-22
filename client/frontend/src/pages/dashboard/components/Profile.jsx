import React from 'react';
import { Edit, Info, Trash2 } from 'lucide-react';

const Profile = ({ 
    userData, 
    setShowEditProfileModal
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
        </div>
    );
};

export default Profile;