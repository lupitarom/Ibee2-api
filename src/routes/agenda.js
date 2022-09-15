const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { con, query } = require('../config/connection')
const router = Router()

router.post('/api/agenda',async(req,res)=>{
    const {nombre, nom_consultorio, color} = req.body; 
    
    try {
        await query(`INSERT INTO consultorio(id_consultorio,nombre,color) 
        VALUES ('${nombre}','${nom_consultorio}', ${color}');`);
        res.json({msg: 'cita creada correctamente'})
    } catch (error) {
        res.json({msg: 'error'})
        console.log(error);
        res.status(500).json({error})
    }
});
/*
router.post('/api/agenda', (req,res)=> {

    const nombre = req.body.nombre;
    const nom_consultorio = req.body.nom_consultorio;
    const color = req.body.color;
    
    db.query("INSERT INTO consultorio ( id_consultorio, nombre, color) VALUES (?,?,?)",[nombre,nom_consultorio,color], (err,result)=>{
       if(err) {
       console.log(err)
       } 
       console.log(result)
    });   })*/