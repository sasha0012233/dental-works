// src/components/AddAppointmentModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAppointmentAdded: () => void
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

export default function AddAppointmentModal({ isOpen, onClose, onAppointmentAdded }: AddAppointmentModalProps) {
  const [formData, setFormData] = useState({
    patient_id: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    duration: 30,
    treatment_type: 'consultation',
    notes: ''
  })
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (isOpen) {
      fetchPatients()
    }
  }, [isOpen])

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('id, first_name, last_name')
      .order('first_name', { ascending: true })

    if (error) {
      console.error('Error fetching patients:', error)
    } else {
      setPatients(data || [])
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.patient_id) {
      newErrors.patient_id = 'Выберите пациента'
    }

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Выберите дату'
    }

    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Выберите время'
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

    // Объединяем дату и время
    const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`)

    // Подготавливаем данные для вставки
    const insertData = {
      patient_id: formData.patient_id,
      scheduled_date: scheduledDateTime.toISOString(),
      duration: formData.duration,
      treatment_type: formData.treatment_type,
      notes: formData.notes || null,
      status: 'scheduled'
    }

    const { error } = await supabase
      .from('appointments')
      .insert([insertData])

    if (error) {
      alert('Ошибка при создании записи: ' + error.message)
    } else {
      onAppointmentAdded()
      onClose()
      setFormData({
        patient_id: '',
        scheduled_date: '',
        scheduled_time: '09:00',
        duration: 30,
        treatment_type: 'consultation',
        notes: ''
      })
      setErrors({})
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
          <h3 className="text-lg font-medium text-gray-900">Новая запись</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Пациент *</label>
              <select
                value={formData.patient_id}
                onChange={(e) => handleInputChange('patient_id', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.patient_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Выберите пациента</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="text-red-500 text-xs mt-1">{errors.patient_id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Дата *</label>
              <input
                type="date"
                required
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.scheduled_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.scheduled_date && (
                <p className="text-red-500 text-xs mt-1">{errors.scheduled_date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Время *</label>
              <input
                type="time"
                required
                value={formData.scheduled_time}
                onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                  errors.scheduled_time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.scheduled_time && (
                <p className="text-red-500 text-xs mt-1">{errors.scheduled_time}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Продолжительность (минут)</label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value={30}>30 минут</option>
                <option value={60}>1 час</option>
                <option value={90}>1.5 часа</option>
                <option value={120}>2 часа</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Тип приема</label>
              <select
                value={formData.treatment_type}
                onChange={(e) => handleInputChange('treatment_type', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="consultation">Консультация</option>
                <option value="cleaning">Чистка</option>
                <option value="filling">Пломбирование</option>
                <option value="extraction">Удаление</option>
                <option value="checkup">Профилактический осмотр</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Заметки</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                placeholder="Дополнительная информация о записи..."
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
                {loading ? 'Создание...' : 'Создать запись'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}