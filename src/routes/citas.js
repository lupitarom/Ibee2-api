const {Router} = require('express');
const jwt = require('jsonwebtoken');
const { con, query } = require('../config/connection');
const router = Router();
const {startOfWeek, endOfISOWeek, startOfDay, endOfWeek, startOfMonth, endOfMonth} = require('date-fns')

router.get('/api/citas', async(req,res)=>{
    const {fromDate,consultorio, range} = req.query; 
    let start, end;

    console.log({fromDate,consultorio, range});
    
    if( !fromDate ){
        return res.status(500).json('no pusiste el fromDate');
    }

    if( range === 'day'){
        start = startOfDay(new Date(fromDate));
        end   = endOfWeek( new Date(fromDate));
    }
    if( range === 'week'){
        start = startOfWeek(new Date(fromDate));
        end   = endOfWeek(new Date(fromDate));
    }
    if( range === 'month'){
        start = startOfMonth(new Date(fromDate));
        end   = endOfMonth(new Date(fromDate));
    }

    try {
        const results = await query(`SELECT * FROM citas 
            WHERE fecha_inicio >= '${start.toISOString()}'
            AND   fecha_fin <= '${end.toISOString()}'  
            AND Consultorio='${consultorio}';`);
        res.json({results});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
});


router.get('/api/citas/n',(req,res)=>{
    const {fromDate} = req.query; 
    if( !fromDate ){
        if(error) return res.status(500).json({error});
    }

    let consultorios = [];
    let totalCitas = 0;
    
    try {
        con.query('SELECT * FROM consultorio',(error, results, fields) => {
            if(error) return res.status(500).json({error});
            //return res.json({results})
            consultorios = results;
            console.log( consultorios );
            consultorios.forEach( (consultorio,index) =>{
                con.query(`SELECT * FROM citas 
                WHERE fecha_inicio='${fromDate}'  
                AND Consultorio='${consultorio.id_consultorio}';`,(error, results, fields) => {
                    if(error) return res.status(500).json({error});
                    consultorios[index] = {...consultorios[index], nCitas: results.length };
                    totalCitas += results.length;
                    if( index === consultorios.length-1){
                        return res.json({totalCitas,consultorios})
                    }
                });
            })
        })
    } catch (error) {
        res.json({error})
        console.log(error);
    }
    
});

router.get('/api/citas/:id',(req,res)=>{
    const {id} = req.params; 
    con.query(`SELECT * FROM citas 
        WHERE id_citas='${id}';`,function (error, results, fields) {
        if(error) return res.status(500).json({error});
        res.json({results});
    });
});

// post citas
router.post('/api/citas',async(req,res)=>{
    const {paciente_id_paciente,fecha_inicio,hora_inicio,fecha_fin,hora_fin,nombre_c,ap_paterno_c,ap_materno_c,asunto,estatus,medico,consultorio} = req.body; 
    
    try {
        await query(`INSERT INTO citas (
                id_citas, 
                pacientes_id_paciente, 
                fecha_inicio, 
                hora_inicio, 
                fecha_fin, 
                hora_fin,
                nombre_c, 
                ap_paterno_c, 
                ap_materno_c, asunto, 
                estatus, 
                medico,
                Consultorio
            ) VALUES (
                NULL, 
                '${paciente_id_paciente}', 
                '${fecha_inicio}', 
                '${hora_inicio}', 
                '${fecha_fin}', 
                '${hora_fin}', 
                '${nombre_c}', 
                '${ap_paterno_c}', 
                '${ap_materno_c}', 
                '${asunto}', 
                '${estatus}', 
                '${medico}', 
                '${consultorio}'
            );`);

        res.json({msg: 'cita creada correctamente'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
});

router.put('/api/citas',async(req,res)=>{
    const {id,fecha_inicio,fecha_fin,hora_inicio,hora_fin,Consultorio,medico, asunto} = req.body;
    try {
        await query(`UPDATE citas SET
        fecha_inicio = '${fecha_inicio}',
        fecha_fin    = '${fecha_fin}',
        hora_inicio  = '${hora_inicio}',
        hora_fin     = '${hora_fin}',
        Consultorio  = '${Consultorio}',
        medico       = '${medico}',
        asunto       = '${asunto}'
        WHERE id_citas = ${id};`)
        res.json({msg: 'cita actualizada correctamente'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
})

module.exports = router