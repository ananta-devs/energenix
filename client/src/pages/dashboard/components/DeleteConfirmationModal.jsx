import React from "react";

const DeleteConfirmationModal = ({
  showDeleteModal,
  setShowDeleteModal,
  addressToDelete,
  handleDeleteAddress,
  isDeleting,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Delete Address
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this address? This action cannot be
          undone.
        </p>
        {addressToDelete && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-semibold">{addressToDelete.fullName}</p>
            <p className="text-gray-600">{addressToDelete.addressLine1}</p>
            {addressToDelete.addressLine2 && (
              <p className="text-gray-600">{addressToDelete.addressLine2}</p>
            )}
            <p className="text-gray-600">
              {addressToDelete.city}, {addressToDelete.state}{" "}
              {addressToDelete.pinCode}
            </p>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAddress}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
