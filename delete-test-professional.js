// Script para eliminar el Dr. Test de la base de datos
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fewfewlmbaqgbxzzlrjx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2Zld2xtYmFxZ2J4enpscmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5ODEyNSwiZXhwIjoyMDg0Njc0MTI1fQ.odPhoOiovB2wzVjBa1VfXN6m8V9kwM3nKqvFE5yG1mA'

const supabase = createClient(supabaseUrl, supabaseKey)

const DR_TEST_ID = '97f470b1-69e1-4a57-85bc-562a22b67831'

async function deleteDrTest() {
  console.log('🗑️  Eliminando Dr. Test de la base de datos...\n')

  // 1. Verificar si tiene pacientes
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('professional_id', DR_TEST_ID)

  console.log(`📋 Pacientes asociados: ${patients?.length || 0}`)

  if (patients && patients.length > 0) {
    console.log('⚠️  El Dr. Test tiene pacientes. Eliminando pacientes primero...')
    for (const patient of patients) {
      console.log(`   - Eliminando paciente: ${patient.name}`)
      await supabase.from('patients').delete().eq('id', patient.id)
    }
  }

  // 2. Verificar si tiene turnos
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', DR_TEST_ID)

  console.log(`📅 Turnos asociados: ${appointments?.length || 0}`)

  if (appointments && appointments.length > 0) {
    console.log('⚠️  El Dr. Test tiene turnos. Eliminando turnos primero...')
    for (const apt of appointments) {
      console.log(`   - Eliminando turno: ${apt.date} ${apt.time}`)
      await supabase.from('appointments').delete().eq('id', apt.id)
    }
  }

  // 3. Eliminar el profesional
  console.log('\n🗑️  Eliminando el profesional Dr. Test...')
  const { error } = await supabase
    .from('professionals')
    .delete()
    .eq('id', DR_TEST_ID)

  if (error) {
    console.error('❌ Error al eliminar:', error)
  } else {
    console.log('✅ Dr. Test eliminado exitosamente\n')
  }

  // 4. Verificar que solo queda Dr. Juan Garcia
  const { data: remainingProfessionals } = await supabase
    .from('professionals')
    .select('id, name, email')

  console.log('👨‍⚕️ PROFESIONALES RESTANTES:')
  remainingProfessionals?.forEach(p => {
    console.log(`  ✓ ${p.name} (${p.email})`)
    console.log(`    ID: ${p.id}`)
  })
}

deleteDrTest().catch(console.error)
