const express = require('express')
const router = express.Router()

const db = require('../db')

router.get('/', (req,res) =>{

    db.any("SELECT  date,vaccine, total_vaccinations FROM vaccinations_by_manufacturer;")
    .then(rows => {

        res.json(rows)
    })
    .catch(error => {

        console.log(error)
    })
})

module.exports = router;