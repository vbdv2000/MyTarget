'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET = require('../config').secret;
const EXP_TIME = require('../config').tokenExpTime;

// Creartoken

// Devolver un token tipo JWT
// Formato JWT:
//      HEADER.PAYLOAD.VERIFY_SIGNATURE

// Donde:
//      HEADER (Objeto JSON con el algoritmo y ... codificado en formato base64Url )
//      {
//          Ejemplo de la página web JWT
//      }
// ..
//      VERIFY_SIGNATURE = { base64UrlEncode(HEADER) + "." + base64UrlEncode(PAYLOAD), SECRET}

function creaToken(usuario) {
    const payload = {
        sub: usuario.email,
        iat: moment().unix(),
        exp: moment().add( EXP_TIME, 'minutes').unix()
    };
    return jwt.encode( payload, SECRET);
}   

// decodificaToken
//
// Dado un token JWT nos dice si es correcto o no o si está caducado
function decodificaToken( token) {
    return new Promise( ( resolve, reject ) => {
        try {
            const payload = jwt.decode( token, SECRET, false);
            if ( payload.exp <= moment().unix() ){
                reject( {
                    status: 401,
                    message: 'El token ha caducado'
                });
            }
            resolve( payload.sub );
        } catch ( err ) {
            reject( {
                status: 500,
                message: 'El token no es válido'
            });
        }
    })
}

module.exports = {
    creaToken, 
    decodificaToken
};