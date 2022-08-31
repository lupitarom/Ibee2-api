const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { con, query } = require('./config/connection');

// middelwares
app.use(cors());
app.use(express.json());

// rutas
app.use(require('./routes/user'));
app.use(require('./routes/pacientes'));
app.use(require('./routes/citas'));
app.use(require('./routes/historiaClinica'));
app.use(require('./routes/pagos'));

// conecta la base de datos
con.connect((err)=>{
    if(err){
        console.log('error mysql')
        console.log(err)
    }
    console.log('base de datos conectada');
})
// keeps the conection with db server
setInterval(async()=>{
    await query('SELECT 1');
}, 5000);

app.get('/',(req,res)=>{
    res.send('hola');
})

const port = process.env.PORT || 8081;

// escucha por peticiones
app.listen(port,()=>{
    console.log('server corriendo en '+ port);
})
