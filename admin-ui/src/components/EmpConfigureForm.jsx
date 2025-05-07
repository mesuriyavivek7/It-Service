import React, { useState, useRef } from "react";
import { LoaderCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api";

function EmpConfigureForm({ type, handleCloseConfigureForm }) {
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const [loader,setLoader] = useState(false)

  const handleKeyDown = (e) => {
    const value = e.target.value.trim();

    if ((e.key === "Enter" || e.key === "Tab") && value) {
      e.preventDefault();
      if (!tags.includes(value)) {
        setTags([...tags, value]);
      }
      e.target.value = "";
    }

    if (e.key === "Backspace" && !value && tags.length) {
      e.preventDefault();
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitDepartment = async () =>{
     try{
       setLoader(true)
       const response = await api.post('/empconfigure/create-department',{departments:tags})
       toast.success("Department list added successfully.")
       handleCloseConfigureForm(type)
     }catch(err){
       setLoader(false)
       console.log(err)
       toast.error(err?.response?.data?.message || "Something went wrong.")
     }
  }

  const handleSubmitDesignation = async () =>{
    try{
      setLoader(true)
      const response = await api.post('/empconfigure/create-designation',{designations:tags})
      toast.success("Designation list added successfully.")
      handleCloseConfigureForm(type)
    }catch(err){
      setLoader(false)
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
      <div className="bg-white w-4/12 rounded-md p-4 gap-4 flex flex-col">
        <div className="flex justify-between items-center">
           <h1 className="text-lg font-medium">Add {type==="designation"?"Designation":"Department"}</h1>
           <X onClick={()=>handleCloseConfigureForm(type)} className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-600"></X>
        </div>
        <div className="flex flex-wrap items-center gap-2 border p-2 rounded">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter"
            className="outline-none flex-grow min-w-[120px]"
          />
        </div>
        <div className="flex justify-center items-center">
          <button onClick={type==="designation"?handleSubmitDesignation:handleSubmitDepartment} className="text-white w-32 mt-2 flex justify-center items-center cursor-pointer font-semibold p-1.5 rounded-md bg-button">
            {
              loader ? 
              <LoaderCircle className="animate-spin"></LoaderCircle>
              : <span>Submit</span>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmpConfigureForm;
