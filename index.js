const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');


//Crear el servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions));


//Puerto de la App 
const port = process.env.PORT || 4000;

//Habilitar los valores de un body
app.use( express.json());

//Habilitar carpeta publica 
app.use( express.static('uploads'));


//Registrar rutas de la App
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})