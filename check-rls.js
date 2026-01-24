// Script para verificar el estado de RLS
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fewfewlmbaqgbxzzlrjx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2Zld2xtYmFxZ2J4enpscmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5ODEyNSwiZXhwIjoyMDg0Njc0MTI1fQ.odPhoOiovB2wzVjBa1VfXN6m8V9kwM3nKqvFE5yG1mA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRLS() {
  console.log('🔍 Verificando estado de RLS...\n')

  // Verificar RLS con query SQL
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('appointments', 'patients', 'professionals');
    `
  })

  if (error) {
    console.log('⚠️  No se pudo verificar con RPC, intentando query directa...\n')

    // Intentar obtener appointments con ambos clientes
    const professionalId = 'ceb3ff10-bdd9-4ad2-9bcb-3b9dfee78e97'

    console.log('📅 Probando obtener turnos con SERVICE ROLE KEY:')
    const { data: appointments1, error: error1 } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)

    if (error1) {
      console.log('❌ Error:', error1)
    } else {
      console.log(`✅ Turnos encontrados: ${appointments1?.length || 0}`)
      if (appointments1 && appointments1.length > 0) {
        appointments1.forEach(apt => {
          console.log(`   - ${apt.date} ${apt.time} - ${apt.status}`)
        })
      }
    }

    // Probar con ANON key
    const supabaseAnon = createClient(
      supabaseUrl,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2Zld2xtYmFxZ2J4enpscmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTgxMjUsImV4cCI6MjA4NDY3NDEyNX0.nqYtEBmdHoC-NgGdU6ggDTMT1OxvAIii-MFx2LtKdV4'
    )

    console.log('\n📅 Probando obtener turnos con ANON KEY:')
    const { data: appointments2, error: error2 } = await supabaseAnon
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)

    if (error2) {
      console.log('❌ Error:', error2)
    } else {
      console.log(`✅ Turnos encontrados: ${appointments2?.length || 0}`)
      if (appointments2 && appointments2.length > 0) {
        appointments2.forEach(apt => {
          console.log(`   - ${apt.date} ${apt.time} - ${apt.status}`)
        })
      }
    }
  } else {
    console.log('Estado de RLS:')
    console.log(data)
  }
}

checkRLS().catch(console.error)
