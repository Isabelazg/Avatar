import { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef}>
      <label className="label">{label}</label>
      
      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 font-medium text-left flex items-center justify-between transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <span className="text-gray-800 font-semibold">{selectedOption?.label}</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-150 flex items-center justify-between group ${
                  value === option.value ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-bold' : ''
                } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
              >
                <span className={`${value === option.value ? 'text-blue-700 font-bold' : 'text-gray-700 font-medium'} group-hover:text-blue-700`}>
                  {option.label}
                </span>
                {value === option.value && (
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
