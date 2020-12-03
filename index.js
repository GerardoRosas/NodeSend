const express = require('express');
const conectarDB = require('./config/db');


//Crear el servidor
const app = express();

//Conectar a la base de datos
conectarDB()


//Puerto de la App 
const port = process.env.PORT || 4000;

//Habilitar los valores de un body
app.use( express.json())

//Registrar rutas de la App
app.use('/api/usuarios', require('./routes/usuarios'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})