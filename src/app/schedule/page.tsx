// src/app/schedule/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navigation from '../../components/Navigation'
import AddAppointmentModal from '../../components/AddAppointmentModal'
import EditAppointmentModal from '../../components/EditAppointmentModal'


interface Appointment {
  id: string
  patient_id: string
  scheduled_date: string
  duration: number
  status: string
  treatment_type: string | null
  notes: string | null
  patient: {
    first_name: string
    last_name: string
    phone: string
  }
}
export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  

  
  

  useEffect(() => {
    fetchAppointments()
  }, [currentDate])

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(first_name, last_name, phone)
      `)
      .order('scheduled_date', { ascending: true })

    if (error) {
      console.error('Error fetching appointments:', error)
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }
const handleEditClick = (appointment: any) => {
  setSelectedAppointment(appointment)
  setIsEditModalOpen(true)
}

const handleDeleteClick = async (appointment: any) => {
  if (!confirm(`Вы уверены, что хотите удалить запись для ${appointment.patient.first_name} ${appointment.patient.last_name}?`)) {
    return
  }

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointment.id)

  if (error) {
    alert('Ошибка при удалении записи: ' + error.message)
  } else {
    fetchAppointments() // Обновляем список
  }
}

const handleAppointmentUpdated = () => {
  fetchAppointments() // Обновляем список
  setIsEditModalOpen(false)
  setSelectedAppointment(null)
}
  const getWeekDates = () => {
    const start = new Date(currentDate)
    start.setDate(currentDate.getDate() - currentDate.getDay())
    
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      week.push(date)
    }
    return week
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse">Загрузка расписания...</div>
          </div>
        </div>
      </div>
    )
  }

  const weekDates = getWeekDates()

  return (
    <div>
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Расписание</h1>
            <div className="flex space-x-4">
               <button 
      onClick={() => setIsModalOpen(true)}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
    >
      Новая запись
    </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Предыдущая неделя
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Сегодня
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Следующая неделя
              </button>
            </div>
          </div>

          {/* Простое отображение списка записей */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Записи на эту неделю
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient.first_name} {appointment.patient.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(appointment.scheduled_date).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(appointment.scheduled_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.treatment_type || 'Консультация'}
                          <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
    {new Date(appointment.scheduled_date).toLocaleDateString('ru-RU')}
                        </div>
                          <div className="text-sm text-gray-500">
    {formatTime(appointment.scheduled_date)}
                             </div>
                           <div className="text-sm text-gray-500">
    {appointment.treatment_type || 'Консультация'}
                             </div>
                             <div className="mt-2 flex space-x-2">
    <button
      onClick={() => handleEditClick(appointment)}
      className="text-blue-600 hover:text-blue-900 text-sm"
    >
      Редактировать
    </button>
    <button
      onClick={() => handleDeleteClick(appointment)}
      className="text-red-600 hover:text-red-900 text-sm"
    >
      Удалить
    </button>
                                     </div>
                              </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <AddAppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAppointmentAdded={fetchAppointments}
      />
      <EditAppointmentModal 
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  onAppointmentUpdated={handleAppointmentUpdated}
  appointment={selectedAppointment}
/>
    </div>  
  )
}