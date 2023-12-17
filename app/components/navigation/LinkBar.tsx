import React, { useState } from 'react';

const LinkBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex justify-between items-center w-full p-4" style={{ background: '#f2f5cc url(https://www.direct.cz/static/img/pattern.svg)' }}>
            <div className="flex items-center relative">
                {/* Hamburger Menu Icon */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="z-10 relative flex flex-col space-y-2 p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#becd00]">
                    <span className="block h-0.5 w-8 bg-[#becd00] transform transition duration-500 ease-in-out" style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                    <span className="block h-0.5 w-8 bg-[#becd00] transition-opacity duration-500" style={{ opacity: menuOpen ? '0' : '1' }}></span>
                    <span className="block h-0.5 w-8 bg-[#becd00] transform transition duration-500 ease-in-out" style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
                </button>

                {/* Menu Items */}
                <div className={`absolute top-full left-0 w-60 shadow-lg ${menuOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`} style={{ background: '#f2f5cc url(https://www.direct.cz/static/img/pattern.svg)' }}>
                    <a href="/storedAssistants" className="flex items-center text-gray-800 px-4 py-3 block border-t border-gray-200 hover:bg-[#becd00] transition-colors duration-150">
                        {/* SVG icon code here */}
                        Stored Assistants
                    </a>
                    <a href="/createAssistant" className="flex items-center text-gray-800 px-4 py-3 block border-t border-gray-200 hover:bg-[#becd00] transition-colors duration-150">
                        {/* SVG icon code here */}
                        Create New Assistant
                    </a>
                </div>
            </div>
            {/* Logo */}
            <div className="flex-grow flex items-center justify-center">
                <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo" className="w-24 h-auto transition-transform duration-300 ease-in-out" style={{ transform: menuOpen ? 'scale(1.1)' : 'none' }}/>
            </div>
        </div>
    );
};

export default LinkBar;
