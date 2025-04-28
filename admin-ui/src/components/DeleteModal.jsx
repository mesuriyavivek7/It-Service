import React from "react";

function DeleteModal({handleCancel,handleDelete,modalType,action}) {
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Are you sure?
        </h2>
        <p className="text-gray-600 mb-6">
          Do you really want to {action} this {modalType}? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 cursor-pointer rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 cursor-pointer rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            {action.charAt(0).toUpperCase()+action.slice(1,action.length)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
