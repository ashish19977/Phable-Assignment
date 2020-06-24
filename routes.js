const express = require('express')
const router = new express.Router()
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const results = []

const Entry = require('./db-config')

// fn to read csv
function readCsvAndSaveToDataBase(file, cb) {
  fs.createReadStream(file)
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      Entry.insertMany(results)
        .then(cb(null, 'Data saved to DB'))
        .catch(e => cb('Error Occured While saving entry'))
    })
    .on('error', () => cb('Error while reading data from csv'))
}

// multer config

var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, 'upladed'),
})
const upload = multer({
  storage: storage,
})

//routes

router.get('/', (req, res) => {
  res.status(200).send({ message: 'testing' })
})

router.post('/upload', upload.single('csv'), (req, res) => {
  readCsvAndSaveToDataBase('./uploads/upladed', (error, result) => {
    if (error) return res.status(400).send({ error })
    res.status(200).send({ result })
  })
})

router.get('/allterifs/current', async (req, res) => {
  // console.log(req.query)
  try {
    const data = await Entry.find(
      {
        'End Date': { $gt: new Date().toISOString() },
        'Start Date': { $lt: new Date().toISOString() },
        ...req.query, // we are passing vendor here if it was originally passed into req else it is empty for ex=> {{url}}allterifs/current?Vendor=Vendor A
      },
      { _id: 0, 'Unit Price (in rupees)': 1, Product: 1, Vendor: 1 }
    )
    res.status(200).send({ data })
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: e })
  }
})

router.get('/allterifs/past', async (req, res) => {
  try {
    const data = await Entry.find(
      { 'End Date': { $lt: new Date().toISOString() }, ...req.query },
      { _id: 0, 'Unit Price (in rupees)': 1, Product: 1, Vendor: 1 }
    )
    res.status(200).send({ data })
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: e })
  }
})

router.get('/allterifs/future', async (req, res) => {
  try {
    const data = await Entry.find(
      { 'Start Date': { $gt: new Date().toISOString() }, ...req.query },
      { _id: 0, 'Unit Price (in rupees)': 1, Product: 1, Vendor: 1 }
    )
    res.status(200).send({ data })
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: e })
  }
})

module.exports = router
