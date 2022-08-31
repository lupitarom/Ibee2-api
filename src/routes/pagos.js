const {Router} = require('express');
const { query } = require('../config/connection');
const router = Router();

router.get('/api/historialPagos/:idPaciente',async(req,res)=>{
    const {idPaciente} = req.params;
    try {
        const historialPagosRaw = await query(`SELECT * FROM historial_pagos_rehabilitacion WHERE paciente_id_paciente='${idPaciente}';`);

        let historialPagos = []
        for( historialPago of historialPagosRaw){
            const pagos = await query(`SELECT * FROM registro_pagos_rehabilitacion WHERE historial_pagos_rehabilitacion_id_historial_pagos_rehabilitacion='${historialPago.id_historial_pagos_rehabilitacion}';`);
            historialPagos.push({...historialPago,pagos})
        }

        res.json({historialPagos});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
});

router.post('/api/historialPagos/:idPaciente',async(req,res)=>{
    const {idPaciente} = req.params;
    const {titulo,fecha_inicio} = req.body;
    try {
        await query(`INSERT INTO historial_pagos_rehabilitacion (
            id_historial_pagos_rehabilitacion,
            paciente_id_paciente,
            titulo,
            fecha_inicio,
            estatus
            ) VALUES (
                NULL, 
                '${idPaciente}', 
                '${titulo}', 
                '${fecha_inicio}',
                'a'
            );`);
        res.json({msg: 'creado correctamente'});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
})

router.put('/api/historialPagos/:id',async(req,res)=>{
    const {id} = req.params;
    const {titulo,fecha_inicio,status} = req.body;
    try {
        await query(`UPDATE historial_pagos_rehabilitacion SET 
            titulo='${titulo}',
            fecha_inicio='${fecha_inicio}',
            estatus='${status}'
            WHERE id_historial_pagos_rehabilitacion='${id}'`);
        res.json({msg: 'actualizado correctamente'});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
})

router.get('/api/pagos/:historialPagosId',async(req,res)=>{
    const {historialPagosId} = req.params;
    try {
        const pagos = await query(`SELECT * FROM registro_pagos_rehabilitacion WHERE historial_pagos_rehabilitacion_id_historial_pagos_rehabilitacion='${historialPagosId}';`);
        res.json({pagos});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
});

router.post('/api/pagos/:historialPagosId',async(req,res)=>{
    const {historialPagosId} = req.params;
    const {fecha,tratamiento,cantidad,costo,abono} = req.body;
    try {
        await query(`INSERT INTO registro_pagos_rehabilitacion (
            id_registro_pagos_rehabilitacion,
            historial_pagos_rehabilitacion_id_historial_pagos_rehabilitacion,
            fecha,
            tratamiento,
            cantidad,
            costo,
            abono,
            estatus
            ) VALUES (
                NULL,
                '${historialPagosId}',
                '${fecha}', 
                '${tratamiento}', 
                '${cantidad}',
                '${costo}',
                '${abono}',
                'a'
            );`);
        res.json({msg: 'creado correctamente'});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
})

router.put('/api/pagos/:pagoId',async(req,res)=>{
    const {pagoId} = req.params;
    const {fecha,tratamiento,cantidad,costo,abono,estatus} = req.body;
    try {
        await query(`UPDATE registro_pagos_rehabilitacion SET
            fecha='${fecha}',
            tratamiento='${tratamiento}',
            cantidad='${cantidad}',
            costo='${costo}',
            abono='${abono}',
            estatus='${estatus}'
            WHERE id_registro_pagos_rehabilitacion='${pagoId}';`);
        res.json({msg: 'actualizado correctamente'});
    } catch (error) {
        res.status(500).json({error})
        console.log(error);
    }
})

module.exports = router