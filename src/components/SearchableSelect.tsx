"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

export default function SearchableSelect({ 
  options, 
  name, 
  placeholder 
}: { 
  options: Option[]; 
  name: string;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = query === "" 
    ? options 
    : options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Hidden input to store the actual value for the form submission */}
      <input type="hidden" name={name} value={selectedValue} required />
      
      <div 
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 bg-white cursor-text flex items-center justify-between"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder={selectedLabel || placeholder}
          value={isOpen ? query : (selectedLabel || "")}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              setSelectedValue("");
              setSelectedLabel("");
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        <span className="text-slate-400 text-xs ml-2">▼</span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-slate-200 rounded-lg shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-slate-500 text-sm">Tidak ditemukan</li>
          ) : (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-slate-700"
                onClick={() => {
                  setSelectedValue(opt.value);
                  setSelectedLabel(opt.label);
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
