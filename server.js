import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { readFile } from 'node:fs/promises'

const app = new Hono()

// Middleware to log requests
app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`)
  await next()
})

// Serve index.html on the root path
app.get('/', async (c) => {
  try {
    const html = await readFile('./index.html', 'utf-8')
    return c.html(html)
  } catch (error) {
    console.error('Error reading index.html:', error)
    return c.text('Error reading index.html', 500)
  }
})

// Serve static files from the current directory
// This will handle images like anilox.webp, anilox.jfif, etc.
app.use('/*', serveStatic({ root: './' }))

const port = 3000
console.log(`
🚀 Server is running!
🔗 Access the app at: http://localhost:${port}
`)

serve({
  fetch: app.fetch,
  port
})
