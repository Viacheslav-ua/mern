const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express()
app.use(express.json({extended: true}))
app.use('/api/auth', require('./route/auth.routes'))
app.use('/api/link', require('./route/link.routes'))
app.use('/t', require('./route/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join('__dirname', 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve('__dirname', 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 3000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}
start()

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))