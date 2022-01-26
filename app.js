const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use('/api/auth', require('./route/auth.routes'))

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