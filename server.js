const express = require('express')
const app = express()
//connecting to database
require('./db-config')

//routes
app.use(require('./routes'))

app.listen(5050, () => {
  console.log(`Server started on port`)
})
