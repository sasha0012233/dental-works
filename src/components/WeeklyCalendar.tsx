// src/components/WeeklyCalendar.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Appointment {
  id: string
  patient_id: string
  scheduled_date: string
  duration: number
  status: string
  treatment_type: string | null
  patient: {
    first_name: string
    last_name: string
    phone: string
  }
}

interface WeeklyCalendarProps {
  onAppointmentClick?: (appointment: Appointment) => void
}

export default function WeeklyCalendar({ onAppointmentClick }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Получаем начало и конец недели (неделя начинается с понедельника)
  const getWeekRange = (date: Date) => {
    const start = new Date(date)
    // Получаем день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const day = start.getDay()
    // Вычисляем разницу до понедельника: если воскресенье (0), то -6, иначе -(day - 1)
    const diffToMonday = day === 0 ? -6 : 1 - day
    start.setDate(date.getDate() + diffToMonday)
    start.setHours(0, 0, 0, 0)
    
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    
    return { start, end }
  }

  useEffect(() => {
    fetchAppointments()
  }, [currentDate])

  const fetchAppointments = async () => {
    const { start, end } = getWeekRange(currentDate)
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(first_name, last_name, phone)
      `)
      .gte('scheduled_date', start.toISOString())
      .lte('scheduled_date', end.toISOString())
      .order('scheduled_date', { ascending: true })

    if (error) {
      console.error('Error fetching appointments:', error)
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }

  // Получаем массив дней недели (с понедельника по воскресенье)
  const getWeekDays = () => {
    const start = new Date(currentDate)
    // Получаем день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const day = start.getDay()
    // Вычисляем разницу до понедельника
    const diffToMonday = day === 0 ? -6 : 1 - day
    start.setDate(currentDate.getDate() + diffToMonday)
    
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      week.push(date)
    }
    return week
  }

  // Форматируем время
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Форматируем дату для заголовка
  const formatDateHeader = (date: Date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    return {
      weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('ru-RU', { month: 'short' }),
      isToday,
      fullWeekday: date.toLocaleDateString('ru-RU', { weekday: 'long' })
    }
  }

  // Получаем записи для конкретного дня
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduled_date)
      return appointmentDate.toDateString() === day.toDateString()
    })
  }

  // Навигация по неделям
  const goToPreviousWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))
  }

  const goToNextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Получаем цвет статуса
  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status as keyof typeof colors] || colors.scheduled
  }

  const weekDays = getWeekDays()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Заголовок календаря */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Предыдущая неделя"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сегодня
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Следующая неделя"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Дни недели - с понедельника по воскресенье */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day, index) => {
          const { weekday, day: dayNumber, month, isToday, fullWeekday } = formatDateHeader(day)
          return (
            <div 
              key={index} 
              className="p-3 text-center border-r last:border-r-0"
              title={fullWeekday}
            >
              <div className="text-sm text-gray-500 uppercase tracking-wide">{weekday}</div>
              <div className={`text-lg font-semibold mt-1 ${
                isToday 
                  ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' 
                  : 'text-gray-900'
              }`}>
                {dayNumber}
              </div>
              <div className="text-xs text-gray-400 mt-1">{month}</div>
            </div>
          )
        })}
      </div>

      {/* Записи */}
      <div className="p-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Нет записей на эту неделю</h3>
            <p className="mt-1 text-sm text-gray-500">Начните с создания первой записи.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weekDays.map((day, dayIndex) => {
              const dayAppointments = getAppointmentsForDay(day)
              if (dayAppointments.length === 0) return null

              return (
                <div key={dayIndex} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h3 className="text-sm font-medium text-gray-700">
                      {day.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                  </div>
                  <div className="divide-y">
                    {dayAppointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className={`p-3 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getStatusColor(appointment.status)}`}
                        onClick={() => onAppointmentClick?.(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {appointment.patient.first_name} {appointment.patient.last_name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {formatTime(appointment.scheduled_date)} • {appointment.duration} мин.
                            </div>
                            {appointment.treatment_type && (
                              <div className="text-sm text-gray-500 mt-1">
                                {appointment.treatment_type}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status === 'scheduled' ? 'Запланирована' :
                               appointment.status === 'completed' ? 'Завершена' : 'Отменена'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Легенда статусов */}
      <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-gray-600">Статусы:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Запланирована</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Завершена</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Отменена</span>
          </div>
        </div>
      </div>
    </div>
  )
}