const path = require('path')
const express = require('express')
const morgan = require('morgan')
const app = express()
module.exports = app

// logging middleware
app.use(morgan('dev'))

// body parsing middleware
app.use(express.json())

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '..', 'docs/index.html')));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'docs')))

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'docs/index.html'));
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})
