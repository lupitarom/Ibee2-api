const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { con, query } = require('../config/connection')
const router = Router()

router.get('/api/pacientes/:termino', (req, res) => {
	const { termino } = req.params

	console.log(req.params)

	con.query(
		`select PA.*, PE.*, FT.* 
    from paciente PA, persona PE, foto FT 
    where PA.persona_id_persona=PE.id_persona 
    and PE.foto_id_foto=FT.id_foto 
    and PA.estatus='a'
    and CONCAT( PE.nombre,' ',PE.ap_paterno,' ',PE.ap_materno) LIKE '%${termino}%'  limit 50`,
		function (error, results, fields) {
			if (error) {
				return res.status(500).json({ error })
			}
			res.json({
				results,
			})
		}
	)
})

router.get('/api/paciente/:id', async (req, res) => {
	const { id } = req.params
	try {
		const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*
        FROM paciente PA, persona PE, foto FT ,direccion D
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		const [telefono] = await query(`SELECT * 
        FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
        WHERE PHT.paciente_id_paciente = '${id}'
        AND PHT.telefono_id_telefono=T.id_telefono 
        AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
        AND TT.id_tipo_telefono=2`)

		const [tutor] = await query(`select P.* , T.* 
        from persona P, tutor T
        where T.paciente_id_paciente='${id}' 
        and T.persona_id_persona=P.id_persona`)

		paciente.telefono = telefono
		paciente.tutor = tutor

		res.json({ paciente })
	} catch (error) {
		console.log(error)
	}
})

router.post('/api/paciente', async (req, res) => {
	const { id } = req.params

	const {
		nombre,
		ap_paterno,
		ap_materno,
		telefono,
		whatsapp,
        edad,
		rfc,
		estado,
		ciudad,
		colonia,
		calle,
		numero,
		cp,
		regimen_fiscal,
		nif,
		razon_social,
		correo,
		estado2,
		ciudad2,
		colonia2,
		calle2,
		numero2,
		cp2,

	} = req.body

	try {

	

		// crea el registro de la direccion y obtiene el id
		const { insertId: direccionId } = await query(
			`INSERT INTO direccion (estado, ciudad,colonia, calle, numero, cp) VALUES (?,?,?,?,?,?)`,
			[estado, ciudad, colonia, calle, numero, cp]
		)

		const { insertId: direccion2Id } = await query(
			`INSERT INTO direccion (estado, ciudad,colonia, calle, numero, cp) VALUES (?,?,?,?,?,?)`,
			[estado2, ciudad2, colonia2, calle2, numero2, cp2]
		)

		//
		const { insertId: datos_fiscalesID } = await query(
			`INSERT INTO datos_fiscales (direccion_id_direccion, regimen_fiscal, nif, razon_social) VALUES (?,?,?,?)`,
			[direccion2Id, regimen_fiscal, nif, razon_social]
		)

		//

		// crea el registro de la persona y obtiene el id
		const { insertId: personaId } = await query(
			`INSERT INTO persona (nombre, ap_paterno, ap_materno,edad, rfc, direccion_id_direccion, foto_id_foto,datos_fiscales_id_datos_fiscales) VALUES (?,?,?,?,?,?,?,?)`,
			[nombre, ap_paterno, ap_materno, edad, rfc, direccionId, 1, datos_fiscalesID]
		)
		// crea el registro de paciente
		const { insertId: pacienteId } = await query(
			`INSERT INTO paciente (persona_id_persona,estatus) VALUES (?,?)`,
			[personaId, 'a']
		)
		// crea el registro de telefono
		const { insertId: telefonoId } = await query(
			`INSERT INTO telefono (tipo_telefono_id_tipo_telefono, telefono, whatsapp) VALUES (?,?,?)`,
			[1, telefono,whatsapp]
		)
		// crea el registro de paciente has telefono
		const { insertId: telefonoHasTelefonoId } = await query(
			`INSERT INTO paciente_has_telefono (paciente_id_paciente, telefono_id_telefono) VALUES (?,?)`,
			[pacienteId, telefonoId]
		)

        // obtiene el paciente que acabamos de crear
        const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*
        FROM paciente PA, persona PE, foto FT ,direccion D
        WHERE PA.id_paciente='${pacienteId}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		const [telefonoCreado] = await query(`SELECT * 
        FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
        WHERE PHT.paciente_id_paciente = '${pacienteId}'
        AND PHT.telefono_id_telefono=T.id_telefono 
        AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
        AND TT.id_tipo_telefono=1`)

		const [tutor] = await query(`select P.* , T.* 
        from persona P, tutor T
        where T.paciente_id_paciente='${pacienteId}' 
        and T.persona_id_persona=P.id_persona`)

		paciente.telefono = telefonoCreado
		paciente.tutor = tutor

		res.json({ msg: 'creado correctamente', paciente })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

router.put('/api/paciente/:id', async (req, res) => {
	const { id } = req.params

	const {
		foto,
		nombre,
		ap_materno,
		ap_paterno,
		rfc,
		telefono,
		whatsapp,
		estado,
		ciudad,
		colonia,
		calle,
		numero,
		cp,

	} = req.body

	try {
		const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*
        FROM paciente PA, persona PE, foto FT ,direccion D
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		if (!paciente) {
			return res.status(400).json({ msg: 'el paciente no existe' })
		}

		await query(`UPDATE persona SET
            nombre='${nombre}',
            ap_paterno='${ap_paterno}',
            ap_materno='${ap_materno}',
            rfc='${rfc}'
            WHERE id_persona='${paciente.persona_id_persona}';`)
		await query(`UPDATE direccion SET
            estado='${estado}',
            ciudad='${ciudad}',
            colonia='${colonia}',
            calle='${calle}',
            numero='${numero}',
            cp='${cp}'
            WHERE id_direccion='${paciente.id_direccion}';`)

		const [telefonoPaciente] = await query(`SELECT * 
            FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
            WHERE PHT.paciente_id_paciente = '${id}'
            AND PHT.telefono_id_telefono=T.id_telefono 
            AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
            AND TT.id_tipo_telefono=1`)

		if (telefonoPaciente) {
			await query(`UPDATE telefono SET
                telefono='${telefono}',
				whatsapp='${whatsapp}'
                WHERE id_telefono='${telefonoPaciente.id_telefono}';`)
		}

		res.json({ msg: 'actulizado correctamente' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'error en el servidor' })
	}
})

router.get('/api/pacienteParaPago/:id', async (req, res) => {
	const { id } = req.params
	try {
		const [paciente] = await query(`SELECT PA.*, PE.*, FT.* , D.*
        FROM paciente PA, persona PE, foto FT ,direccion D
        WHERE PA.id_paciente='${id}'
        AND PA.persona_id_persona=PE.id_persona 
        AND PE.foto_id_foto=FT.id_foto 
        AND PE.direccion_id_direccion=D.id_direccion;`)

		const [telefono] = await query(`SELECT * 
        FROM paciente_has_telefono PHT, telefono T, tipo_telefono TT
        WHERE PHT.paciente_id_paciente = '${id}'
        AND PHT.telefono_id_telefono=T.id_telefono 
        AND T.tipo_telefono_id_tipo_telefono=TT.id_tipo_telefono 
        AND TT.id_tipo_telefono=2`)

		const [tutor] = await query(`select P.* , T.* 
        from persona P, tutor T
        where T.paciente_id_paciente='${id}' 
        and T.persona_id_persona=P.id_persona`)

		res.json({ paciente, telefono, tutor })
	} catch (error) {
		console.log(error)
	}
})

module.exports = router

module.exports = router