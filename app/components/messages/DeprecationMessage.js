import React from 'react';

const DeprecationMessage = ({ children }) => {
    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold p-8">POZOR: Tento nástroj co nevidět zmizí. Zažádajte si o přístup k Chat GPT</p>
            <p>{children}</p>
        </div>
    );
};

export default DeprecationMessage;