// src/components/AddPatientModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onPatientAdded: () => void
}

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    birth_date: '',
    medical_notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Валидация формы
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Подготавливаем данные для отправки
    const submitData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      birth_date: formData.birth_date || null,
      medical_notes: formData.medical_notes.trim() || null
    }

    try {
      const { error } = await supabase
        .from('patients')
        .insert([submitData])

      if (error) {
        alert('Ошибка при добавлении пациента: ' + error.message)
      } else {
        onPatientAdded()
        onClose()
        // Сброс формы
        setFormData({
          first_name: '',
          last_name: '',
          phone: '',
          email: '',
          birth_date: '',
          medical_notes: ''
        })
        setErrors({})
      }
    } catch (err: any) {
      alert('Неожиданная ошибка: ' + err.message)
    }
    
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">Добавить пациента</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Фамилия *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email (необязательно)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Дата рождения (необязательно)</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Медицинские заметки (необязательно)</label>
              <textarea
                value={formData.medical_notes}
                onChange={(e) => handleInputChange('medical_notes', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}