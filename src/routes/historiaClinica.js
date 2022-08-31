const { Router } = require('express');
const { con, query } = require('../config/connection');
const router = Router();

// post citas
router.get('/api/fichaDeIdentificacion/:idPaciente', (req, res) => {

    const { idPaciente } = req.params;

    con.query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`, (error, results, fields) => {

        if (error) { return res.status(500).json({ error }); }
        const [paciente] = results;
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });
        //console.log(paciente.persona_id_persona);

        con.query(`SELECT * FROM ficha_de_identificacion WHERE persona_id_persona='${paciente.persona_id_persona}';`, (error, results, fields) => {
            if (error) { return res.status(500).json({ error }); }
            res.json({ error, results });
        })
    })
});

router.put('/api/fichaDeIdentificacion/:idPaciente', (req, res) => {

    const { idPaciente } = req.params;

    con.query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`, (error, results, fields) => {

        if (error) return res.status(500).json({ error });
        const [paciente] = results;
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });

        const { fecha, masculino, femenino, lugar_naci, f_nacimiento, ocupacion, escolaridad, estado_civil, num_inter, delegacion, nom_med_fam, tel_medico, fecha_cita, motivo } = req.body;

        con.query(`SELECT * FROM ficha_de_identificacion WHERE persona_id_persona='${paciente.persona_id_persona}';`, (error, results, fields) => {
            if (error) return res.status(500).json({ error });
            const [fichaDeIdentificacion] = results;

            // console.log({ fichaDeIdentificacion });
            //return res.json({fichaDeIdentificacion});

            if (!fichaDeIdentificacion) {
                con.query(`INSERT INTO ficha_de_identificacion(
                    fecha,
                    masculino,
                    femenino,
                    lugar_naci,
                    f_nacimiento,
                    ocupacion,
                    escolaridad,
                    estado_civil,
                    num_inter,
                    delegacion,
                    nom_med_fam,
                    tel_medico,
                    fecha_cita,
                    motivo,
                    persona_id_persona
                ) VALUES (
                    '${fecha}',
                    '${masculino}',
                    '${femenino}',
                    '${lugar_naci}',
                    '${f_nacimiento}',
                    '${ocupacion}',
                    '${escolaridad}',
                    '${estado_civil}',
                    '${num_inter}',
                    '${delegacion}',
                    '${nom_med_fam}',
                    '${tel_medico}',
                    '${fecha_cita}',
                    '${motivo}',
                    '${paciente.persona_id_persona}'
                );`, (error, results, fields) => {
                    if (error) return res.status(500).json({ error });
                    return res.json({ msg: 'creado correctamente', results });
                });
            }

            con.query(`UPDATE ficha_de_identificacion SET
                fecha='${fecha}',
                masculino='${masculino}',
                femenino='${femenino}',
                lugar_naci='${lugar_naci}',
                f_nacimiento='${f_nacimiento}',
                ocupacion='${ocupacion}',
                escolaridad='${escolaridad}',
                estado_civil='${estado_civil}',
                num_inter='${num_inter}',
                delegacion='${delegacion}',
                nom_med_fam='${nom_med_fam}',
                tel_medico='${tel_medico}',
                fecha_cita='${fecha_cita}',
                motivo='${motivo}'
                WHERE id_ficha=${paciente.persona_id_persona}`, (error, results, fields) => {
                if (error) return res.status(500).json({ error });
                return res.json({ msg: 'actualizado correctamente', results });
            })
        })
    })
})

router.get('/api/antecedentesPatologicos/:idPaciente', async (req, res) => {
    const { idPaciente } = req.params;
    try {
        const [antecedentesPatologicos] = await query(`SELECT * FROM antecedentes_patologicos WHERE paciente_id='${idPaciente}';`);
        return res.json({ antecedentesPatologicos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
})

router.put('/api/antecedentesPatologicos/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });


        const { madre, padre, hermanos, hijos, esposo_a, tios, abuelos, enfermedades_IeINT, enfermedadesTS, enf_degenerativas, enf_neoplasticas, enf_congenitas, otras } = req.body;
        const id_paciente = idPaciente;

        const [antecedentesPatologicos] = await query(`SELECT * FROM antecedentes_patologicos WHERE paciente_id='${idPaciente}';`);

        //return res.json({ antecedentesPatologicos });

        if (!antecedentesPatologicos) {
            await query(`INSERT INTO antecedentes_patologicos (
                id_antpatologicos,
                madre,
                padre,
                hermanos,
                hijos,
                esposo_a,
                tios,
                abuelos,
                enfermedades_IeINT,
                enfermedadesTS,
                enf_degenerativas,
                enf_neoplasticas,
                enf_congenitas,
                otras,
                paciente_id
            ) VALUES (
                '${id_paciente}',
                '${madre}',
                '${padre}', 
                '${hermanos}',
                '${hijos}',
                '${esposo_a}',
                '${tios}',
                '${abuelos}',
                '${enfermedades_IeINT}',
                '${enfermedadesTS}',
                '${enf_degenerativas}',
                '${enf_neoplasticas}',
                '${enf_congenitas}',
                '${otras}',
                '${id_paciente}'
            );`);
            return res.json({ msg: 'creado correctamente' })
        }

        await query(
            `UPDATE antecedentes_patologicos SET 
            madre = '${madre}',
            padre = '${padre}',
            hermanos = '${hermanos}',
            hijos = '${hijos}',
            esposo_a = '${esposo_a}',
            tios = '${tios}',
            abuelos = '${abuelos}',
            enfermedades_IeINT = '${enfermedades_IeINT}',
            enfermedadesTS = '${enfermedadesTS}',
            enf_degenerativas = '${enf_degenerativas}',
            enf_neoplasticas = '${enf_neoplasticas}',
            enf_congenitas = '${enf_congenitas}',
            otras = '${otras}'
            where id_antpatologicos = ${antecedentesPatologicos.id_antpatologicos} `)
        return res.json({ msg: 'actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }

})

router.put('/api/antecedentesPatologicos2/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });


        const {
            enfermedades_IeINT,
            enfermedadesTS,
            enf_degenerativas,
            enf_neoplasticas,
            enf_congenitas,
            otras
        } = req.body;

        const id_paciente = idPaciente;

        const [antecedentesPatologicos] = await query(`SELECT * FROM antecedentes_patologicos WHERE paciente_id='${idPaciente}';`);

        if (!antecedentesPatologicos) {
            await query(`INSERT INTO antecedentes_patologicos (
                id_antpatologicos,
                enfermedades_IeINT,
                enfermedadesTS,
                enf_degenerativas,
                enf_neoplasticas,
                enf_congenitas,
                otras,
                paciente_id
            ) VALUES (
                '${id_paciente}',
                '${enfermedades_IeINT}',
                '${enfermedadesTS}',
                '${enf_degenerativas}',
                '${enf_neoplasticas}',
                '${enf_congenitas}',
                '${otras}',
                '${id_paciente}'
            );`);
            return res.json({ msg: 'creado correctamente' })
        }

        await query(
            `UPDATE antecedentes_patologicos SET 
            enfermedades_IeINT = '${enfermedades_IeINT}',
            enfermedadesTS = '${enfermedadesTS}',
            enf_degenerativas = '${enf_degenerativas}',
            enf_neoplasticas = '${enf_neoplasticas}',
            enf_congenitas = '${enf_congenitas}',
            otras = '${otras}'
            where id_antpatologicos = ${antecedentesPatologicos.id_antpatologicos} `)
        return res.json({ msg: 'actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
})

router.get('/api/antecedentesNoPatologicos/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });
        const [antecedentesNoPatologicos] = await query(`SELECT * FROM antecedentes_no_patologicos WHERE paciente_id='${idPaciente}';`);
        res.json({ antecedentesNoPatologicos })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
})

router.put('/api/antecedentesNoPatologicos/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });

        const id_paciente = idPaciente;
        const {
            vestuario,
            corporales,
            frecuencia_dientes,
            aux_si,
            aux_no,
            cuales,
            golosinas_si,
            golosinas_no,
            grupo_sanguineo,
            factor_rh,
            cartilla_si,
            cartilla_no,
            esquema_si,
            esquema_no,
            espc_falta,
            tabaco,
            alcohol,
            antibioticos,
            analgesicos,
            anestesicos,
            alimentos,
            especifique,
            hosp_si,
            hosp_no,
            fecha,
            motivo,
            pad_actual,
            medicamentos
        } = req.body;

        const [antecedentesNoPatologicos] = await query(`SELECT * FROM antecedentes_no_patologicos WHERE paciente_id='${idPaciente}';`);

        if (!antecedentesNoPatologicos) {
            await query(`
            INSERT INTO antecedentes_no_patologicos(
                    id_antnopatologicos,
                    vestuario,
                    corporales,
                    frecuencia_dientes,
                    aux_si,aux_no,cuales,
                    golosinas_si,
                    golosinas_no,
                    grupo_sanguineo,
                    factor_rh,
                    cartilla_si,
                    cartilla_no,
                    esquema_si,
                    esquema_no,
                    espc_falta,tabaco,
                    alcohol,
                    antibioticos,
                    analgesicos,
                    anestesicos,
                    alimentos,
                    especifique,
                    hosp_si,hosp_no,
                    fecha,
                    motivo,
                    pad_actual,
                    medicamentos,
                    paciente_id
                ) VALUES (
                    '${id_paciente}',
                    '${vestuario}',
                    '${corporales}',
                    '${frecuencia_dientes}',
                    '${aux_si}',
                    '${aux_no}',
                    '${cuales}',
                    '${golosinas_si}',
                    '${golosinas_no}',
                    '${grupo_sanguineo}',
                    '${factor_rh}',
                    '${cartilla_si}',
                    '${cartilla_no}',
                    '${esquema_si}',
                    '${esquema_no}',
                    '${espc_falta}',
                    '${tabaco}',
                    '${alcohol}',
                    '${antibioticos}',
                    '${analgesicos}',
                    '${anestesicos}',
                    '${alimentos}',
                    '${especifique}',
                    '${hosp_si}',
                    '${hosp_no}',
                    '${fecha}',
                    '${motivo}',
                    '${pad_actual}',
                    '${medicamentos}',
                    '${id_paciente}'
                    );
            `)
            return res.json({ msg: 'creado correctamente' })
        }

        await query(`
            UPDATE antecedentes_no_patologicos SET 
            vestuario='${vestuario}',
            corporales='${corporales}',
            frecuencia_dientes='${frecuencia_dientes}',
            aux_si='${aux_si}',
            golosinas_si='${golosinas_si}',
            golosinas_no='${golosinas_no}',
            grupo_sanguineo='${grupo_sanguineo}',
            factor_rh='${factor_rh}',
            cartilla_si='${cartilla_si}',
            cartilla_no='${cartilla_no}',
            esquema_si='${esquema_si}',
            esquema_no='${esquema_no}',
            espc_falta='${espc_falta}',
            alcohol='${alcohol}',
            antibioticos='${antibioticos}',
            analgesicos='${analgesicos}',
            anestesicos='${anestesicos}',
            alimentos='${alimentos}',
            especifique='${especifique}',
            hosp_si='${hosp_si}',
            fecha='${fecha}',
            motivo='${motivo}',
            pad_actual='${pad_actual}',
            medicamentos='${medicamentos}'
            WHERE id_antnopatologicos=${antecedentesNoPatologicos.id_antnopatologicos};
        `);
        res.json({ msg: 'actualizado correctamente' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
})

router.get('/api/ExpCabCuello/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });

        const [expCabCuello] = await query(`SELECT * FROM exp_cab_cuello WHERE paciente_id2='${idPaciente}';`);
        if (!expCabCuello) return res.status(400).json({ msg: 'no existe un registro de exp_cab_cuello para el paciente especificado' });
        res.json({ expCabCuello })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
})

router.put('/api/ExpCabCuello/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });

        const id_paciente = idPaciente;

        const {
            exostosis,
            dolicocefalico,
            transversales,
            concavo,
            normal,
            hipotonicos,
            endostosis,
            mesocefalico,
            convexo,
            palida,
            hipertonicos,
            braquicefalico,
            longitudinales,
            recto,
            cianotica,
            espasticos,
            enrojecida,
            ganglionar_si,
            ganglionar_no,
            otros
        } = req.body;

        const [expCabCuello] = await query(`SELECT * FROM exp_cab_cuello WHERE paciente_id2='${idPaciente}';`);

        if (!expCabCuello) {
            await query(`
            INSERT INTO exp_cab_cuello(
                id_expcab,
                exostosis,
                dolicocefalico,
                transversales,
                concavo,
                normal,
                hipotonicos,
                endostosis,
                mesocefalico,
                convexo,
                palida,
                hipertonicos,
                braquicefalico,
                longitudinales,
                recto,
                cianotica,
                espasticos,
                enrojecida,
                ganglionar_si,
                ganglionar_no,
                otros,
                paciente_id2
                ) VALUES (
                    '${id_paciente}',
                    '${exostosis}',
                    '${dolicocefalico}',
                    '${transversales}',
                    '${concavo}',
                    '${normal}',
                    '${hipotonicos}',
                    '${endostosis}',
                    '${mesocefalico}',
                    '${convexo}',
                    '${palida}',
                    '${hipertonicos}',
                    '${braquicefalico}',
                    '${longitudinales}',
                    '${recto}',
                    '${cianotica}',
                    '${espasticos}',
                    '${enrojecida}',
                    '${ganglionar_si}',
                    '${ganglionar_no}',
                    '${otros}',
                    '${id_paciente}'
                    );
                `)
            return res.json({ msg: 'creado correctamente' })
        }

        await query(`
            UPDATE exp_cab_cuello SET 
            exostosis='${exostosis}',
            dolicocefalico='${dolicocefalico}',
            transversales='${transversales}',
            concavo='${concavo}',
            normal='${normal}',
            hipotonicos='${hipotonicos}',
            endostosis='${endostosis}',
            mesocefalico='${mesocefalico}',
            convexo='${convexo}',
            palida='${palida}',
            hipertonicos='${hipertonicos}',
            braquicefalico='${braquicefalico}',
            longitudinales='${longitudinales}',
            recto='${recto}',
            cianotica='${cianotica}',
            espasticos='${espasticos}',
            enrojecida='${enrojecida}',
            ganglionar_si='${ganglionar_si}',
            ganglionar_no='${ganglionar_no}',
            otros='${otros}'
            WHERE id_expcab=${expCabCuello.id_expcab};
        `);
        res.json({ msg: 'actualizado correctamente' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
})

router.get('/api/aparatosSistemas/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });

        const [aparatosSistemas] = await query(`SELECT * FROM aparatos_sistemas WHERE paciente_id='${idPaciente}';`);
        if (!aparatosSistemas) return res.status(400).json({ msg: 'no existe un registro de exp_cab_cuello para el paciente especificado' });
        res.json({ aparatosSistemas })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
})

router.put('/api/aparatosSistemas/:idPaciente', async (req, res) => {

    const { idPaciente } = req.params;

    try {
        const [paciente] = await query(`SELECT * FROM paciente WHERE id_paciente='${idPaciente}';`);
        if (!paciente) return res.status(400).json({ msg: 'no existe un paciente con ese id' });

        const [aparatosSistemas] = await query(`SELECT * FROM aparatos_sistemas WHERE paciente_id='${idPaciente}';`);
        
        const id_paciente = idPaciente;

        const {
            apar_digestivo,
            apar_respiratorio,
            apar_cardiovascular,
            apar_genitourinario,
            sist_endocrino,
            sist_hemopoyetico,
            sist_nervioso,
            sist_musculoesquel,
            apar_tegumentario,
            hab_ext,
            peso,
            talla,
            complexion,
            frec_cardiaca,
            tension_art,
            frec_resp,
            temperatura
        } = req.body;

        if (!aparatosSistemas) {
            await query(`
                INSERT INTO aparatos_sistemas(
                    apar_digestivo,
                    apar_respiratorio,
                    apar_cardiovascular,
                    apar_genitourinario,
                    sist_endocrino,
                    sist_hemopoyetico,
                    sist_nervioso,
                    sist_musculoesquel,
                    apar_tegumentario,
                    hab_ext,
                    peso,
                    talla,
                    complexion,
                    frec_cardiaca,
                    tension_art,
                    frec_resp,
                    temperatura,
                    id_apar_sis,
                    paciente_id
                    ) VALUES (
                        '${apar_digestivo}',
                        '${apar_respiratorio}',
                        '${apar_cardiovascular}',
                        '${apar_genitourinario}',
                        '${sist_endocrino}',
                        '${sist_hemopoyetico}',
                        '${sist_nervioso}',
                        '${sist_musculoesquel}',
                        '${apar_tegumentario}',
                        '${hab_ext}',
                        '${peso}',
                        '${talla}',
                        '${complexion}',
                        '${frec_cardiaca}',
                        '${tension_art}',
                        '${frec_resp}',
                        '${temperatura}',
                        '${id_paciente}',
                        '${id_paciente}'
                        );
                `)
            return res.json({ msg: 'creado correctamente' })
        }

        await query(`
                UPDATE aparatos_sistemas SET
                    apar_digestivo='${apar_digestivo}',
                    apar_respiratorio='${apar_respiratorio}',
                    apar_cardiovascular='${apar_cardiovascular}',
                    apar_genitourinario='${apar_genitourinario}',
                    sist_endocrino='${sist_endocrino}',
                    sist_hemopoyetico='${sist_hemopoyetico}',
                    sist_nervioso='${sist_nervioso}',
                    sist_musculoesquel='${sist_musculoesquel}',
                    apar_tegumentario='${apar_tegumentario}',
                    hab_ext='${hab_ext}',
                    peso='${peso}',
                    talla='${talla}',
                    complexion='${complexion}',
                    frec_cardiaca='${frec_cardiaca}',
                    tension_art='${tension_art}',
                    frec_resp='${frec_resp}',
                    temperatura='${temperatura}'
                    WHERE id_apar_sis=${ aparatosSistemas.id_apar_sis }
                `);
        res.json({ msg: 'actualizado correctamente' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
})
module.exports = router