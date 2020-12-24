const Enlaces = require('../models/Enlace');
const shortId = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {
    
    //Revissar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Crear un objeto de enlace
    const { nombre_original, nombre } = req.body;

    const enlace = new Enlaces();
    enlace.url = shortId.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    

    //Si el usuario está autenticado
    if(req.usuario){
        const { password, descargas } = req.body;

        //Asignar a enlace el numero de descargas
        if(descargas){
            enlace.descargas = descargas;
        }

        //Asignar un password
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        //Asignar el autor 
        enlace.autor = req.usuario.id;
    }

    //Almacenar en la BD
    try {
        await enlace.save();
        res.json({msg: `${enlace.url}`});
        next()
    } catch (error) {
        console.log(error);
    }
}

//Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

    const {url} = req.params;

    //Verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });
    if(!enlace){
        res.status(404).json({msg: 'El enlace no existe'});
        return next();
    };

    //Si el enlace existe 
    res.json({archivo: enlace.nombre});

    //Si las descargas son iguales a 1 --Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;
    if(descargas === 1){
        //Eliminar el archivo
        req.archivo = nombre;

        //Eliminar la entrada de la BD
        await Enlaces.findByIdAndRemove(req.params.url);
        next() //Pasa el siguiente controlador
    }else{
        //Si las descargas son > a 1 - Restar una descarga
        enlace.descargas--;
        await enlace.save();
    }

    


}