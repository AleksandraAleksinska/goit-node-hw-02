const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users')

const app = express()

app.use(express.static(path.join(__dirname, "public")));

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

require('./config/config-passport');
app.use('/api', contactsRouter)
app.use('/api', usersRouter)

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, _, res, __) => {
  res.status(500).json({ message: err.message })
})

const uriDb = process.env.DB_HOST;

mongoose.connect(uriDb, {
  dbName: 'db-contacts',
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connection successful')
})
.catch((error) => {
  console.log("Database error message:", error.message);
  process.exit(1);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {  
  console.log(`Server running. Use our API on port: ${PORT}`)
})

module.exports = app;
