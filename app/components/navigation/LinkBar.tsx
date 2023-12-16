import React, { useState } from 'react';

const LinkBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex justify-between items-center w-full bg-green-600 border-b border-gray-200 p-4">
            <div className="relative bg-green-600 border-b border-gray-200 w-auto">
                {/* Hamburger Menu Icon */}
                <div className="flex justify-between items-center p-4">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <div className="space-y-2">
                            <span className="block h-0.5 w-8 bg-white"></span>
                            <span className="block h-0.5 w-8 bg-white"></span>
                            <span className="block h-0.5 w-8 bg-white"></span>
                        </div>
                    </button>
                </div>

                {/* Menu Items */}
                <div className={`absolute top-full left-0 bg-green-600 w-60 ${menuOpen ? "block" : "hidden"}`}>
                    <a href="/storedAssistants" className="text-white px-4 py-2 block border-t border-gray-200 text-center">Stored Assistants</a>
                    <a href="/createAssistant" className="text-white px-4 py-2 block border-t border-gray-200 text-center w-full">Create New Assistant</a>
                </div>
            </div>
            {/* Logo */}
            <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo"
                 style={{width: "100px", margin: "auto"}}/>
        </div>
    );
};

export default LinkBar;
