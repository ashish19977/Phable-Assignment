const mongoose = require('mongoose')

const db_conn_url = 'mongodb://localhost:27017/phable'
mongoose.connect(db_conn_url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to phable database')
})

const schema = mongoose.Schema(
  {
    Product: { type: String },
    Vendor: { type: String },
    'Start Date': { type: Date },
    'End Date': { type: Date },
    'Unit Price (in rupees)': { type: Number },
  },
  { timestamps: true }
)

const Entry = mongoose.model('entries', schema)
module.exports = Entry
