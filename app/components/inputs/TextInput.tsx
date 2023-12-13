import React, { Dispatch, SetStateAction, useState } from 'react';

interface TextInputProps {
  setInputValue: Dispatch<SetStateAction<any>>;
  inputValue: any;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ inputValue, setInputValue, placeholder }) => {


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };



  return (
      <input
        className="w-full border-2 p-4 text-sm border-black-800 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
  );
};

export default TextInput;