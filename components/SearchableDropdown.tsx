'use client'

import { useState, useRef, useEffect } from 'react'

interface Option {
  id: string
  nama: string
}

interface SearchableDropdownProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  label,
  required = false,
  disabled = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.id === value)
  const filteredOptions = options.filter((opt) =>
    opt.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionId: string) => {
    onChange(optionId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-textSecondary mb-2">
          {label} {required && <span className="text-statusDanger">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-bgTertiary border rounded p-3 text-left flex items-center justify-between transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-borderLight'
            : isOpen
            ? 'border-accentGreen shadow-[0_0_10px_rgba(57,255,20,0.2)]'
            : 'border-borderLight hover:border-accentGreen/50'
        }`}
      >
        <span className={selectedOption ? 'text-white' : 'text-textMuted'}>
          {selectedOption ? selectedOption.nama : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-textMuted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-bgTertiary border border-accentGreen rounded-lg shadow-2xl shadow-accentGreen/20 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-borderLight sticky top-0 bg-bgTertiary">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari..."
              className="w-full bg-bgSecondary border border-borderLight rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accentGreen"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    option.id === value
                      ? 'bg-accentGreen/20 text-accentGreen font-medium'
                      : 'text-white hover:bg-bgSecondary'
                  }`}
                >
                  {option.nama}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-textMuted text-sm">
                Tidak ada hasil ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
