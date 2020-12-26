const multer = require('multer');
const shortId = require('shortid');
const fs = require('fs');

const Enlaces = require('../models/Enlace');


exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {

        //limite de 1MB de archivo
        limits : { fileSize: req.usuario ? 1024 * 1024 *10 : 1024 * 1024},
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                console.log(extension);
                cb(null, `${shortId.generate()}${extension}`);
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload( req, res, async (error) => {
        console.log(req.file);

        if(!error){
            res.json({archivo : req.file.filename})
        }else{
            console.log(error);
            return next();
        }
    })
}

exports.eliminarArchivo = async (req, res) => {
    console.log(req.archivo);

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('Archivo eliminado');
    } catch (error) {
        console.log(error);
    }
}

exports.descargar = async (req, res, next) => {

    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo })



    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    //Eliminar el archivo y la entrada en la BD
    //Si las descargas son iguales a 1 --Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;
    if(descargas === 1){
        //Eliminar el archivo
        req.archivo = nombre;

        //Eliminar la entrada de la BD
        await Enlaces.findByIdAndRemove(enlace.id);
        next() //Pasa el siguiente controlador
    }else{
        //Si las descargas son > a 1 - Restar una descarga
        enlace.descargas--;
        await enlace.save();
    }
    
}