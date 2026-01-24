// Script de debugging para verificar turnos y pacientes
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fewfewlmbaqgbxzzlrjx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2Zld2xtYmFxZ2J4enpscmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5ODEyNSwiZXhwIjoyMDg0Njc0MTI1fQ.odPhoOiovB2wzVjBa1VfXN6m8V9kwM3nKqvFE5yG1mA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  console.log('🔍 Verificando base de datos...\n')

  // 1. Ver todos los profesionales
  const { data: professionals } = await supabase
    .from('professionals')
    .select('id, name, email')

  console.log('👨‍⚕️ PROFESIONALES:')
  professionals?.forEach(p => {
    console.log(`  - ${p.name} (${p.email})`)
    console.log(`    ID: ${p.id}\n`)
  })

  // 2. Ver todos los pacientes
  const { data: patients } = await supabase
    .from('patients')
    .select('id, name, email, professional_id')

  console.log('👤 PACIENTES:')
  patients?.forEach(p => {
    console.log(`  - ${p.name} (${p.email})`)
    console.log(`    ID: ${p.id}`)
    console.log(`    Professional ID: ${p.professional_id}\n`)
  })

  // 3. Ver todos los turnos
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('📅 TURNOS:')
  if (appointments && appointments.length > 0) {
    appointments.forEach(apt => {
      console.log(`  - Turno ID: ${apt.id}`)
      console.log(`    Professional ID: ${apt.professional_id}`)
      console.log(`    Patient ID: ${apt.patient_id}`)
      console.log(`    Fecha: ${apt.date} ${apt.time}`)
      console.log(`    Estado: ${apt.status}`)
      console.log(`    Creado por: ${apt.created_by}`)
      console.log(`    Creado: ${apt.created_at}\n`)
    })
  } else {
    console.log('  ❌ No hay turnos en la base de datos\n')
  }

  // 4. Verificar coincidencias
  console.log('🔗 VERIFICACIÓN DE RELACIONES:')
  if (appointments && appointments.length > 0) {
    appointments.forEach(apt => {
      const patient = patients?.find(p => p.id === apt.patient_id)
      const professional = professionals?.find(p => p.id === apt.professional_id)

      console.log(`\n  Turno: ${apt.date} ${apt.time}`)
      console.log(`    ✓ Paciente: ${patient?.name || '❌ NO ENCONTRADO'}`)
      console.log(`    ✓ Profesional del turno: ${professional?.name || '❌ NO ENCONTRADO'}`)

      if (patient) {
        const patientProfessional = professionals?.find(p => p.id === patient.professional_id)
        console.log(`    ✓ Profesional del paciente: ${patientProfessional?.name || '❌ NO ENCONTRADO'}`)

        if (patient.professional_id === apt.professional_id) {
          console.log(`    ✅ CORRECTO: El turno y el paciente tienen el mismo professional_id`)
        } else {
          console.log(`    ❌ ERROR: professional_id no coincide!`)
          console.log(`       - Turno tiene: ${apt.professional_id}`)
          console.log(`       - Paciente tiene: ${patient.professional_id}`)
        }
      }
    })
  }
}

debug().catch(console.error)
