// src/components/EditPatientModalSimple.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function EditPatientModalSimple({ isOpen, onClose, onPatientUpdated, patient }: any) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    birth_date: '',
    medical_notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (patient) {
      setFormData({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        phone: patient.phone || '',
        email: patient.email || '',
        birth_date: patient.birth_date || '',
        medical_notes: patient.medical_notes || ''
      })
    }
  }, [patient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient) return

    setLoading(true)

    const submitData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      email: formData.email || null,
      birth_date: formData.birth_date || null,
      medical_notes: formData.medical_notes || null
    }

    const { error } = await supabase
      .from('patients')
      .update(submitData)
      .eq('id', patient.id)

    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      onPatientUpdated()
      onClose()
    }
    setLoading(false)
  }

  if (!isOpen || !patient) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">Редактировать пациента</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фамилия</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}