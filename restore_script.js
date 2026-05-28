import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'

const NEW_URL = 'https://mngqdfgtrzwghtuwzhzc.supabase.co'
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZ3FkZmd0cnp3Z2h0dXd6aHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDQ1ODUsImV4cCI6MjA5MzU4MDU4NX0.Lb5YrD6nH-of-gL-yIAxhWSynq_c5pvo6uyp8auJvgs'

const supabase = createClient(NEW_URL, NEW_KEY)

async function restore() {
  console.log('--- Iniciando Restauração dos Dados (Modo Upsert) ---')
  
  try {
    const backupContent = await fs.readFile('./backup_data.json', 'utf-8')
    const { anilox, settings } = JSON.parse(backupContent)

    // Restaurar Anilox
    if (anilox && anilox.length > 0) {
      console.log(`Verificando/Subindo ${anilox.length} registros de anilox...`)
      const { error: errorAnilox } = await supabase.from('anilox').upsert(anilox)
      if (errorAnilox) throw new Error(`Erro Anilox: ${errorAnilox.message}`)
      console.log('✓ Anilox migrado/atualizado.')
    }

    // Restaurar Settings
    if (settings && settings.length > 0) {
      console.log('Subindo configurações...')
      const { error: errorSettings } = await supabase.from('settings').upsert(settings)
      if (errorSettings) throw new Error(`Erro Settings: ${errorSettings.message}`)
      console.log('✓ Settings migradas/atualizadas.')
    }

    console.log('--- TODO O PROCESSO DE DADOS CONCLUÍDO! ---')
  } catch (err) {
    console.error('Falha na migração:', err.message)
  }
}

restore()
