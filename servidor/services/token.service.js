'use strict'

import jwt from 'jwt-simple';
import moment from 'moment';

import { secret, tokenExpTime } from '../config.js';

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

export function creaToken(usuario) {
    const payload = {
        sub: usuario.email,
        iat: moment().unix(),
        exp: moment().add( tokenExpTime, 'minutes').unix()
    };
    return jwt.encode( payload, secret);
}   

// decodificaToken
//
// Dado un token JWT nos dice si es correcto o no o si está caducado
export function decodificaToken( token) {
    return new Promise( ( resolve, reject ) => {
        try {
            const payload = jwt.decode( token, secret, false);
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
