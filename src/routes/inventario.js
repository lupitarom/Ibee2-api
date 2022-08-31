const {Router} = require('express');
const jwt = require('jsonwebtoken');
const { con } = require('../config/connection');
const router = Router();

router.get('/api/inventario',(req,res)=>{
    con.query(``, function (error, results, fields) {
        if (error){
            return res.status(500).json({error});
        }
        res.json({results});
    });
});

module.exports = router