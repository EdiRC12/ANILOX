import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'

const OLD_URL = 'https://qonapwpnnknvnhvjysjc.supabase.co'
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbmFwd3Bubmtudm5odmp5c2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDUwMTIsImV4cCI6MjA3NDEyMTAxMn0.DqkQuENorS1cH4mTyyGvWdohfS5ac4AyO3nufrbBf5E'

const supabase = createClient(OLD_URL, OLD_KEY)

async function backup() {
  console.log('--- Iniciando Backup dos Dados ---')
  
  try {
    // Backup Anilox
    const { data: anilox, error: errorAnilox } = await supabase.from('anilox').select('*')
    if (errorAnilox) throw errorAnilox
    console.log(`✓ ${anilox.length} registros de anilox encontrados.`)

    // Backup Settings
    const { data: settings, error: errorSettings } = await supabase.from('settings').select('*')
    if (errorSettings) throw errorSettings
    console.log(`✓ ${settings.length} registros de settings encontrados.`)

    const backupData = { anilox, settings }
    await fs.writeFile('./backup_data.json', JSON.stringify(backupData, null, 2))
    
    console.log('--- Backup concluído com sucesso em backup_data.json ---')
  } catch (err) {
    console.error('Erro no backup:', err.message)
  }
}

backup()
