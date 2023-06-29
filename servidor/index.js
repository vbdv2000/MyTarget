import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { tokenExpTime } from './config.js';
import { creaToken, decodificaToken } from "./services/token.service.js";
import { conectarDB } from './database.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 5000; //Line 3

//Middleware de autenticación para comprobr que cuando realiza las acciones necesarias el token es válido, utiliza next()
async function auth(req, res, next) {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  if (!token) {
    return res.status(401).send('No hay token');
  }
  
  try{
    const email = await decodificaToken(token);
    req.email = email;
    next();
  } catch(error){
    return res.status(401).send('Token de autenticación no válido');
  }

}

//Ruta de POST cuando se va a inciar sesión 
app.post('/login', async (req, res) => {
  //res.header('Access-Control-Allow-Origin', `http://localhost:3000`);
  //res.header('Access-Control-Allow-Credentials', 'true');
  //res.header('Access-Control-Allow-Origin', `https://my-target-api.vercel.app/`);
  const { email, password } = req.body;
  // Consulta a la base de datos
  try {
      const connection = await conectarDB();
      const query = 'SELECT * FROM usuario WHERE email = @email';
      const request = connection.request();
      request.input('email', email); // Valor proporcionado por el usuario

      const result = await request.query(query);
      const rows = result.recordset;
      console.log(rows);

      if (rows.length > 0) {
        const usuarioEncontrado = rows[0];
        //console.log(usuarioEncontrado);

        // Comparar contraseñas
        const iguales = await bcrypt.compare(password, usuarioEncontrado.contrasena);

        if (iguales) {
          // Inicio correcto
          const token = creaToken(usuarioEncontrado);
          console.log(token);
          res.cookie('token', token, { maxAge: tokenExpTime, httpOnly: true }); //Enviamos una cookie con una duración de tokenExpTime min
          res.status(200).json({ token, usuario: {email: usuarioEncontrado.email } });
        } else {
          // Error de contraseña
          res.status(401).json({ error: 'Contraseña incorrecta' });
        }
      } else {
        // Si no hay resultados, enviamos un error de autenticación 
        res.status(401).json({ error: 'El email introducido no está registrado' });
      }
      connection.close();

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión'); 
  }
});

//ruta de POST para crear a un usuario nuevo
app.post('/registro', async (req, res) => {
  const { nombre, apellidos, email, password, equipo, posicion, mano_habil } = req.body;
  try {
    const connection = await conectarDB();
    const query = 'SELECT * FROM usuario WHERE email = @email';
    const request = connection.request();
    request.input('email', email); 

    const result = await request.query(query);
    const rows = result.recordset;

    if (rows.length == 0) {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.error(err);
        } else {  
          // Insertamos un nuevo usuario evitando INYECCIONES SQL
          const query1 = `INSERT INTO usuario (nombre, apellidos, email, contrasena, equipo, posicion, mano_habil)
          VALUES (@nombre, @apellidos, @email, @contrasena, @equipo, @posicion, @mano_habil)`;

          const request1 = connection.request();
          request1.input('nombre', nombre);
          request1.input('apellidos', apellidos);
          request1.input('email', email);
          request1.input('contrasena', hash);
          request1.input('equipo', equipo !== undefined ? equipo : null);
          request1.input('posicion', posicion !== undefined ? posicion : null);
          request1.input('mano_habil', mano_habil !== undefined ? mano_habil : null);

          const result1 = await request1.query(query1);
          console.log(result1);  
        }
      });

      res.status(201).json({
        mensaje: 'Usuario creado exitosamente',
        usuario: email
      });

    } else {
      res.status(400).json({
        error: 'Registro no válido',
        description: 'Email ya registrado en nuestra base de datos'
      });
      connection.close();

    }
  } catch (error) {
    console.error(error);
    // Enviamos una respuesta de error 
    res.status(500).send('Error al crear usuario');
  }
});


//ruta de POST para iniciar sesión con OAuth y si el usuario no existe registrarlo en la bd
app.post('/registroOAuth', async (req, res) => {
  const { nombre, apellidos, email} = req.body;
  const usuario = {email: email};
  const password = generaPassword();
  console.log(usuario.email);
  console.log(email);
  try {
    const connection = await conectarDB();
    const query = 'SELECT * FROM usuario WHERE email = @email';
    const request = connection.request();
    request.input('email', email); 

    const result = await request.query(query);
    const rows = result.recordset;

    if (rows.length == 0) {//Usuario que no existe en la BD
      const hash = bcrypt.hashSync(password, 10);
      
      // Insertamos un nuevo usuario evitando INYECCIONES SQL
      const query1 = `INSERT INTO usuario (nombre, apellidos, email, contrasena, equipo, posicion, mano_habil)
      VALUES (@nombre, @apellidos, @email, @contrasena, null, null, null)`;

      const request1 = connection.request();
      request1.input('nombre', nombre);
      request1.input('apellidos', apellidos);
      request1.input('email', email);
      request1.input('contrasena', hash);

      const result1 = await request1.query(query1);
      console.log(result1);
      const token = creaToken(usuario);
      res.cookie('token', token, { maxAge: tokenExpTime, httpOnly: true }); //Enviamos una cookie con una duración de 1 min

      res.status(200).json({
        mensaje: 'Usuario creado exitosamente',
        usuario: email,
        token: token
      });

    } else { //Usuario que ya está registrado en la bd
      const token = creaToken(rows[0]);
      console.log(token);
      res.cookie('token', token, { maxAge: tokenExpTime, httpOnly: true }); //Enviamos una cookie con una duración de 1 min

      res.status(202).json({
        mensaje: 'Usuario ya creado, solo hacemos login',
        usuario: email,
        token: token
      });
    }
    connection.close();
  } catch (error) {
    console.error(error);
    // Enviamos una respuesta de error 
    res.status(500).send('Error al crear usuario');
  }
});

// Solicitud GET para recuperar la contraseña
app.get('/recuperar', async (req, res) => {

  try{
    // Obtener el correo electrónico 
    const email = req.query.email;

    const connection = await conectarDB();
    const query = 'SELECT * FROM usuario WHERE email = @email';
    const request = connection.request();
    request.input('email', email); 

    const result = await request.query(query);
    const rows = result.recordset;
 
    // Si hay un usuario con ese email
    if (rows.length == 1) {
      // Crear contraseña nueva
      const newPassword = generaPassword();

      // Enviar correo
      enviarCorreo(email, newPassword);

      // Modificar contraseña
      const hash = bcrypt.hashSync(newPassword, 10);
         
      const query1 = 'UPDATE usuario SET contrasena = @contrasena WHERE email = @email';
      const request1 = connection.request();
      request1.input('contrasena', hash); 
      request1.input('email', email); 
      
      const result1 = await request1.query(query1);          
      console.log(result1.recordset);
      res.status(201).json({
        mensaje: 'Contraseña modificada correctamente',
        usuario: email
      });
    } else {
      res.status(400).json({
        error: 'Error restableciendo',
        mensaje: 'Email no registrado en nuestra base de datos'
      });
    }
    connection.close();
  } catch (error) {
    console.error(error);
    // Enviamos una respuesta de error 
    res.status(500).send(error);
  }
  

});

function enviarCorreo( email,  password){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        user: 'my.basket.target@gmail.com',
        pass: 'frljgjbghbqnswuk'
      }
    });

    const mailOptions = {
      from: 'my.basket.target@gmail.com',
      to: email,
      subject: 'Nueva contraseña',
      text: `Tu contraseña se ha modificado y la nueva contraseña es: ${password}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
  };

function generaPassword () {
  const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,-_';
  let newPassword = '';

  // Generar la contraseña aleatoria con 10 caracteres
  for (let i = 0; i < 10;   i++) {
    const indice = Math.floor(Math.random() * caracteresPermitidos.length);
    newPassword += caracteresPermitidos.charAt(indice);
  }

  return newPassword;
}


//Ruta GET para obtener el usuario y que se muestre en el perfil los datos
app.get('/usuarios', async (req, res) => {
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  //res.header('Access-Control-Allow-Credentials', 'true');
  try{
    const connection = await conectarDB();
    res.send("La conexión se abre");
    connection.close();

    } catch(error){
    res.status(error.status).json({ message: error.message });
  }
})



//Ruta GET para obtener el usuario y que se muestre en el perfil los datos
app.get('/usuario', auth, async (req, res) => {
  const email = req.email;
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');
  try{
    const connection = await conectarDB();
    const query = 'SELECT * FROM usuario WHERE email = @email';
    const request = connection.request();
    request.input('email', email); // Valor proporcionado por el usuario

    const result = await request.query(query);
    const rows = result.recordset;

    // Si la consulta devuelve resultados, enviamos el usuario
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send('Usuario no encontrado'); // Si no hay resultados, enviamos un error 404 
    }
    connection.close();

    } catch(error){
    res.status(error.status).json({ message: error.message });
  }
})

//Ruta PUT para modificar los datos del usuario en el perfil
app.put('/usuario', auth, async (req, res) => {
  const email = req.email;
  console.log(email);
  try{
    const { nombre, apellidos, equipo, posicion, mano_habil } = req.body;
    const connection = await conectarDB();
    const query = `UPDATE usuario SET nombre = @nombre, apellidos = @apellidos, equipo = @equipo, posicion = @posicion, mano_habil = @mano_habil WHERE email = @email`;
    const request = connection.request();
    request.input('nombre', nombre); 
    request.input('apellidos', apellidos); 
    request.input('equipo', equipo); 
    request.input('posicion', posicion);
    request.input('mano_habil', mano_habil); 
    request.input('email', email); 

    const result = await request.query(query);
    console.log(result);
    res.status(200).json({ 
      mensaje: 'Usuario actualizado correctamente' , 
      usuario: {
        email: email,
        nombre: nombre,
        apellidos: apellidos,
        equipo: equipo,
        posicion: posicion,
        mano_habil: mano_habil
      }
    });
    connection.close();

  } catch(error){
    res.status(error.status).json({ message: error.message });
  }
});

//Ruta GET para obtener todas las sesiones del usuario en la bd
app.get('/sesiones', auth,  async (req, res) => {
  const email = req.email ;
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');
 
  try{
    const connection = await conectarDB();
    const query = `SELECT * FROM sesion WHERE usuario = @usuario ORDER BY fecha ASC`;
    const request = connection.request();
    request.input('usuario', email); 

    const result = await request.query(query);
    const rows = result.recordset;
    // Enviamos las sesiones
    if (rows.length > 0) {
      res.status(201).json({sesiones: rows});
    } else {
      res.status(404).send('Sesiones no encontradas'); // Si no hay resultados, enviamos un error 404 
    }       
    connection.close();

    } catch(error){
    res.status(error.status).json({ message: error.message });
  }
})

//Ruta DELETE para eliminar una sesión concreta
app.delete('/sesiones/:fecha/:hora', auth, async (req, res) => {
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');
  const email = req.email ;
  const fecha = req.params.fecha;
  const hora = req.params.hora;  
  try {
    const connection = await conectarDB();
    const query = 'DELETE FROM sesion WHERE fecha = @fecha AND hora = @hora AND usuario = @usuario';
    const request = connection.request();
    request.input('fecha', fecha); 
    request.input('hora', hora);
    request.input('usuario', email); 

    const result = await request.query(query);
    console.log(result);
    res.status(201).json({mensaje: "La sesion se ha eliminado correctamente"});
    
    connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
  
});

//Ruta GET para obtener los datos de una sesión y sus zonsa de tiro
app.get('/sesion', auth,  async (req, res) => {
  const email = req.email;
  const fecha = req.query.fecha;
  const hora = req.query.hora;
  console.log(fecha);
  console.log(hora);
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');
 
  try{
    const connection = await conectarDB();
    const querySesion = 'SELECT * FROM sesion WHERE fecha = @fecha AND hora = @hora AND usuario = @usuario';
    const requestSesion = connection.request();
    requestSesion.input('fecha', fecha); 
    requestSesion.input('hora', hora); 
    requestSesion.input('usuario', email); 
    
    const result = await requestSesion.query(querySesion);
    const rows = result.recordset;
    console.log(result);
    console.log(rows);
    connection.close();

    
    /*  NO SE MUY BIEN PORQUE PERO HE TENIDO
        QUE CERRAR LA CONEXIÓN A LA BD CON LA 
        PRIMERA CONSULTA Y ABRIR OTRA NUEVA PARA
        LA SIGUIENTE, PORQUE SINO SALTABA UN ERROR
        NO CONTROLADO, MIENTRAS QUE EN POSTMAN
        HE COMPROBADO QUE LA LLAMADA COMO TAL NO 
        TIENE NINGUN PROBLEMA, ADEMÁS ASÍ FUNCIONA
    */

    const connection2 = await conectarDB();
    const queryZona = 'SELECT * FROM zona WHERE fecha = @fecha AND hora = @hora AND usuario = @usuario';
    const requestZona = connection2.request();
    requestZona.input('fecha', fecha); 
    requestZona.input('hora', hora); 
    requestZona.input('usuario', email); 

    const resultZona = await requestZona.query(queryZona);
    const zonas = resultZona.recordset;
    console.log(zonas);
    //const zonas = resultZona.recordset;
    //console.log(resultZona);
    // Enviamos la sesion

    if (rows.length > 0) {
      res.status(200).send({
        sesion: rows[0],
        zonas: zonas
      });
    } else {
      res.status(404).send('Sesion no encontrada'); // Si no hay resultados, enviamos un error 404 
    }
    connection2.close();
  } catch(error){
    res.status(error.status).json({ message: error.message });
  }
})

//Ruta POST para crear una nueva sesión y sus zonas de tiro asociadas
app.post('/sesion', auth, async (req, res) => {
  const usuario = req.email ;
  const { nombre, fecha, hora, tr1, ta1, tr2, ta2, tr3, ta3, tr4, ta4, tr5, ta5, tr6, ta6, tr7, ta7, tr8, ta8, tr9, ta9, tr10, ta10 } = req.body;
  try {
    const connection = await conectarDB();
    const query = 'INSERT INTO sesion (nombre, fecha, hora, usuario) VALUES (@nombre, @fecha, @hora, @usuario)';
    const request = connection.request();
    request.input('nombre', nombre); 
    request.input('fecha', fecha); 
    request.input('hora', hora); 
    request.input('usuario', usuario); 

    const result = await request.query(query);
    //Bucle para crear las zonas de la sesion y que se haga una transacción
    for (let index = 1; index <= 10; index++) {
      var tiros_realizados=eval("tr"+index);
      var tiros_anotados=eval("ta"+index);
      tiros_realizados === '' ? 0 : tiros_realizados;
      tiros_anotados === '' ? 0 : tiros_anotados;
      
      console.log(tiros_realizados);
      console.log(tiros_anotados);

      const query1 = 'INSERT INTO zona (posicion, tiros_realizados, tiros_anotados, fecha, hora, usuario) VALUES (@posicion, @tiros_realizados, @tiros_anotados, @fecha, @hora, @usuario)';
      const request1 = connection.request();
      request1.input('posicion', index); 
      request1.input('tiros_realizados', tiros_realizados === '' ? 0 : tiros_realizados); 
      request1.input('tiros_anotados', tiros_anotados === '' ? 0 : tiros_anotados); 
      request1.input('fecha', fecha); 
      request1.input('hora', hora); 
      request1.input('usuario', usuario); 

      const result1 = await request1.query(query1);
      console.log(result1);
    }
    console.log(result);  
    //console.log(result2);  

    res.status(201).json({
      mensaje: 'Sesión y zonas creadas con éxito',
      usuario: usuario
    });

    connection.close();

  } catch (error) {
    console.error(error);
    // Enviamos una respuesta de error 
    res.status(500).send('Error al crear usuario');
  }
});

//Ruta PUt para modificar una sesión que ya había sido creada
app.put('/sesion', auth, async (req, res) => {
  const email = req.email;
  console.log(email);
  try{
    const { nombre, fecha, hora, tr1, ta1, tr2, ta2, tr3, ta3, tr4, ta4, tr5, ta5, tr6, ta6, tr7, ta7, tr8, ta8, tr9, ta9, tr10, ta10 } = req.body;
    const connection = await conectarDB();
    const updateSesionQuery = `UPDATE sesion SET nombre = @nombre WHERE usuario = @usuario and fecha = @fecha and hora = @hora`;
    const requestSesion = connection.request();
    requestSesion.input('nombre', nombre); 
    requestSesion.input('usuario', email); 
    requestSesion.input('fecha', fecha); 
    requestSesion.input('hora', hora); 
    const result = await requestSesion.query(updateSesionQuery);
    const rows = result.recordset;

    const updateZona1Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona1 = connection.request();
    requestZona1.input('tiros_realizados', tr1); 
    requestZona1.input('tiros_anotados', ta1); 
    requestZona1.input('usuario', email); 
    requestZona1.input('fecha', fecha); 
    requestZona1.input('hora', hora); 
    requestZona1.input('posicion', 1); 
    const result1 = await requestZona1.query(updateZona1Query);
    const zona1 = result1.recordset;

    const updateZona2Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona2 = connection.request();
    requestZona2.input('tiros_realizados', tr2); 
    requestZona2.input('tiros_anotados', ta2); 
    requestZona2.input('usuario', email); 
    requestZona2.input('fecha', fecha); 
    requestZona2.input('hora', hora); 
    requestZona2.input('posicion', 2); 
    const result2 = await requestZona2.query(updateZona2Query);
    const zona2 = result2.recordset;


    const updateZona3Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona3 = connection.request();
    requestZona3.input('tiros_realizados', tr3); 
    requestZona3.input('tiros_anotados', ta3); 
    requestZona3.input('usuario', email); 
    requestZona3.input('fecha', fecha); 
    requestZona3.input('hora', hora); 
    requestZona3.input('posicion', 3); 
    const result3 = await requestZona3.query(updateZona3Query);
    const zona3 = result3.recordset;

    const updateZona4Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona4 = connection.request();
    requestZona4.input('tiros_realizados', tr4); 
    requestZona4.input('tiros_anotados', ta4); 
    requestZona4.input('usuario', email); 
    requestZona4.input('fecha', fecha); 
    requestZona4.input('hora', hora); 
    requestZona4.input('posicion', 4); 
    const result4 = await requestZona4.query(updateZona4Query);
    const zona4 = result4.recordset;

    const updateZona5Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona5 = connection.request();
    requestZona5.input('tiros_realizados', tr5); 
    requestZona5.input('tiros_anotados', ta5); 
    requestZona5.input('usuario', email); 
    requestZona5.input('fecha', fecha); 
    requestZona5.input('hora', hora); 
    requestZona5.input('posicion', 5); 
    const result5 = await requestZona5.query(updateZona5Query);
    const zona5 = result5.recordset;

    const updateZona6Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona6 = connection.request();
    requestZona6.input('tiros_realizados', tr6); 
    requestZona6.input('tiros_anotados', ta6); 
    requestZona6.input('usuario', email); 
    requestZona6.input('fecha', fecha); 
    requestZona6.input('hora', hora); 
    requestZona6.input('posicion', 6); 
    const result6 = await requestZona6.query(updateZona6Query);
    const zona6 = result6.recordset;

    const updateZona7Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona7 = connection.request();
    requestZona7.input('tiros_realizados', tr7);
    requestZona7.input('tiros_anotados', ta7);
    requestZona7.input('usuario', email);
    requestZona7.input('fecha', fecha);
    requestZona7.input('hora', hora);
    requestZona7.input('posicion', 7);
    const result7 = await requestZona7.query(updateZona7Query);
    const zona7 = result7.recordset;

    const updateZona8Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona8 = connection.request();
    requestZona8.input('tiros_realizados', tr8);
    requestZona8.input('tiros_anotados', ta8);
    requestZona8.input('usuario', email);
    requestZona8.input('fecha', fecha);
    requestZona8.input('hora', hora);
    requestZona8.input('posicion', 8);
    const result8 = await requestZona8.query(updateZona8Query);
    const zona8 = result8.recordset;

    const updateZona9Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona9 = connection.request();
    requestZona9.input('tiros_realizados', tr9);
    requestZona9.input('tiros_anotados', ta9);
    requestZona9.input('usuario', email);
    requestZona9.input('fecha', fecha);
    requestZona9.input('hora', hora);
    requestZona9.input('posicion', 9);
    const result9 = await requestZona9.query(updateZona9Query);
    const zona9 = result9.recordset;

    const updateZona10Query = `UPDATE zona SET tiros_realizados = @tiros_realizados, tiros_anotados = @tiros_anotados WHERE usuario = @usuario and fecha = @fecha and hora = @hora and posicion = @posicion`;
    const requestZona10 = connection.request();
    requestZona10.input('tiros_realizados', tr10);
    requestZona10.input('tiros_anotados', ta10);
    requestZona10.input('usuario', email);
    requestZona10.input('fecha', fecha);
    requestZona10.input('hora', hora);
    requestZona10.input('posicion', 10);
    const result10 = await requestZona10.query(updateZona10Query);
    const zona10 = result10.recordset;

    res.status(200).json({ 
      mensaje: 'Sesion y zonas actualizada correctamente' , 
      sesion: {
        nombre: nombre,
        zona1: [zona1, zona2, zona3, zona4, zona5, zona6, zona7, zona8, zona9, zona10]
      }
    });

    connection.close();
  } catch(error){
    res.status(error.status).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`); //Line 6
});



