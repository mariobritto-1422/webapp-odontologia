'use client'

import { useState } from 'react'
import ProfileForm from './ProfileForm'
import ScheduleForm from './ScheduleForm'
import BrandingForm from './BrandingForm'

type Tab = 'profile' | 'schedule' | 'branding'

type ConfigurationTabsProps = {
  professional: any
}

export default function ConfigurationTabs({
  professional,
}: ConfigurationTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const tabs = [
    { id: 'profile' as Tab, label: 'Perfil Profesional' },
    { id: 'schedule' as Tab, label: 'Horarios' },
    { id: 'branding' as Tab, label: 'Branding' },
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'profile' && <ProfileForm professional={professional} />}
        {activeTab === 'schedule' && <ScheduleForm professional={professional} />}
        {activeTab === 'branding' && <BrandingForm professional={professional} />}
      </div>
    </div>
  )
}
