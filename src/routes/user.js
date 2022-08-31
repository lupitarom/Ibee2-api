const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { query } = require('../config/connection');
const router = Router();

router.post('/api/login', async(req, res) => {
    const { user, password } = req.body;
    console.log({ user, password });

    try {
        const results = await query(`SELECT * FROM usuario WHERE usuario='${user}'`);
        const [usuario] = results;
        if (!usuario) {
            return res.status(500).json({ msg: 'usuario incorrecto' });
        }
        if (usuario.password !== password) {
            return res.status(500).json({ msg: 'contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario.id_usuario }, process.env.SECRETA || 'secreta', {
            expiresIn: '1w'
        });

        res.json({
            token,
            usuario
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
    
})

router.post('/api/isLogin', async(req, res) => {
    const {token} = req.headers;
    try {
        const payload = jwt.verify(token, process.env.SECRETA || 'secreta')
        res.json({ isLogin: !!payload })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'error al verificar token' })
    }
})


module.exports = router