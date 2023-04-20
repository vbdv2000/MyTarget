const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const tokenExpTime = require('./config').tokenExpTime;

const tokenService = require('./services/token.service');
const { conectarDB } = require('./database');
const cookieParser = require('cookie-parser');

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
    const email = await tokenService.decodificaToken(token);
    req.email = email;
    next();
  } catch(error){
    return res.status(401).send('Token de autenticación no válido');
  }

}

//Ruta de POST cuando se va a inciar sesión 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Consulta a la base de datos
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM usuario WHERE email = ? ', [email]);
        

        if (rows.length > 0) {
          const usuarioEncontrado = rows[0];
          // Comparar contraseñas
          const iguales = await bcrypt.compare(password, usuarioEncontrado.contrasena);

          if (iguales) {
            // Inicio correcto
            const token = tokenService.creaToken(usuarioEncontrado);
            console.log(token);
            res.cookie('token', token, { maxAge: tokenExpTime, httpOnly: true }); //Enviamos una cookie con una duración de 1 min
            res.status(200).json({ token, usuario: {email: usuarioEncontrado.email } });
          } else {
            // Error de contraseña
            res.status(401).json({ error: 'Contraseña incorrecta' });
          }
        } else {
          // Si no hay resultados, enviamos un error de autenticación 
          res.status(401).json({ error: 'El email introducido no está registrado' });
        }
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
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE email = ? ', [email]);

    if (rows.length == 0) {
      bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
      } else {  
        // Insertamos un nuevo usuario
      
        const [result] = await connection.query('INSERT INTO usuario (nombre, apellidos, email, contrasena, equipo, posicion, mano_habil) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [ nombre, 
          apellidos, 
          email, 
          hash, 
          equipo !== undefined ? equipo : null, 
          posicion !== undefined ? posicion : null, 
          mano_habil !== undefined ? mano_habil : null]);  

          console.log(result);  
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
    }
  } catch (error) {
    console.error(error);
    // Enviamos una respuesta de error 
    res.status(500).send('Error al crear usuario');
  }
});

//Ruta GET para obtener el usuario y que se muestre en el perfil los datos
app.get('/usuario', auth, async (req, res) => {
  const email = req.email;
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');
  try{
    const connection = await conectarDB();
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE email = ? ', [email]);

    // Si la consulta devuelve resultados, enviamos el usuario
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send('Usuario no encontrado'); // Si no hay resultados, enviamos un error 404 
    }
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
    const [rows] = await connection.execute(
      `UPDATE usuario SET nombre = ?, apellidos = ?, equipo = ?, posicion = ?, mano_habil = ? WHERE email = ?`,
      [nombre, apellidos, equipo, posicion, mano_habil, email]
    );
    res.status(200).json({ 
      mensaje: 'Usuario actualizado correctamente' , 
      usuario: {
        email: email,
        nombre: nombre,
        apellidos: apellidos,
        equipo: equipo,
        posicion: posicion,
        mano_habil: mano_habil
      }});
      
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
    const [rows] = await connection.execute('SELECT * FROM sesion WHERE usuario = ? ORDER BY fecha DESC', [email]);

    // Enviamos las sesiones
    if (rows.length > 0) {
      res.status(201).json({sesiones: rows});
    } else {
      res.status(404).send('Sesiones no encontradas'); // Si no hay resultados, enviamos un error 404 
    }
    } catch(error){
    res.status(error.status).json({ message: error.message });
  }
})

//Ruta DELETE para eliminar una sesión concreta
app.delete('/sesiones/:fecha/:hora', auth, async (req, res) => {
  const email = req.email ;
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');

  const fecha = req.params.fecha;
  const hora = req.params.hora;  
  try {
    const connection = await conectarDB();
    const [rows] = await connection.execute('DELETE FROM sesion WHERE fecha=? and hora=? and usuario=?', [fecha, hora, email]);
    res.status(201).json({mensaje: "La sesion se ha eliminado correctamente"});
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
  
});

//Ruta GET para obtener los datos de una sesión y sus zonsa de tiro
app.get('/sesion', auth,  async (req, res) => {
  const email = req.email ;
  const fecha = req.query.fecha;
  const hora = req.query.hora;
  console.log(fecha);
  console.log(hora);
  //res.header('Access-Control-Allow-Origin', `http://${direccionIP}:3000`);
  res.header('Access-Control-Allow-Credentials', 'true');
 
  try{
    const connection = await conectarDB();
    const [rows] = await connection.execute('SELECT * FROM sesion WHERE fecha=? and hora=? and usuario = ?', [fecha, hora, email]);

    const [zonas] = await connection.execute('SELECT * FROM zona WHERE fecha=? and hora=? and usuario = ?', [fecha, hora, email]);

    // Enviamos las sesiones
    if (rows.length > 0) {
      res.status(201).send({
        sesion: rows[0],
        zonas: zonas
      });
    } else {
      res.status(404).send('Sesion no encontrada'); // Si no hay resultados, enviamos un error 404 
    }
    } catch(error){
    res.status(error.status).json({ message: error.message });
  }
})

//Ruta POST para crear una nueva sesión y sus zonas de tiro asociadas
app.post('/sesion', auth, async (req, res) => {
  const usuario = req.email ;
  const { nombre, fecha, hora, tr1, ta1, tr2, ta2, tr3, ta3, tr4, ta4, tr5, ta5 } = req.body;
  try {
    const connection = await conectarDB();
    const [result] = await connection.query('INSERT INTO sesion (nombre, fecha, hora, usuario) VALUES (?, ?, ?, ?)', 
    [ 
      nombre, 
      fecha, 
      hora, 
      usuario
    ]);  
    //Bucle para crear las zonas de la sesion y que se haga una transacción
    for (let index = 1; index <= 5; index++) {
      tiros_realizados=eval("tr"+index);
      tiros_anotados=eval("ta"+index);
      tiros_realizados === '' ? 0 : tiros_realizados,
      tiros_anotados === '' ? 0 : tiros_anotados, 
        console.log(tiros_realizados);
        console.log(tiros_anotados);
      const [result2] = await connection.query('INSERT INTO zona (posicion, tiros_realizados, tiros_anotados, fecha, hora, usuario) VALUES(?, ?, ?, ?, ?, ?)', 
      [ 
        index, 
        tiros_realizados === '' ? 0 : tiros_realizados,
        tiros_anotados === '' ? 0 : tiros_anotados, 
        fecha,
        hora,
        usuario
      ]);  
      
    }
    console.log(result);  
    //console.log(result2);  

    res.status(201).json({
      mensaje: 'Sesión y zonas creadas con éxito',
      usuario: usuario
    });
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
    const { nombre, fecha, hora, tr1, ta1, tr2, ta2, tr3, ta3, tr4, ta4, tr5, ta5 } = req.body;
    const connection = await conectarDB();
    const [rows] = await connection.execute(
      `UPDATE sesion SET nombre = ? WHERE usuario = ? and fecha = ? and hora = ?`,
      [nombre, email, fecha, hora]
    );

    const [zona1] = await connection.execute(
      `UPDATE zona SET tiros_realizados = ? , tiros_anotados = ? WHERE usuario = ? and fecha = ? and hora = ? and posicion = ?`,
      [tr1, ta1, email, fecha, hora, 1]
    );
    const [zona2] = await connection.execute(
      `UPDATE zona SET tiros_realizados = ? , tiros_anotados = ? WHERE usuario = ? and fecha = ? and hora = ? and posicion = ?`,
      [tr2, ta2, email, fecha, hora, 2]
    );
    const [zona3] = await connection.execute(
      `UPDATE zona SET tiros_realizados = ? , tiros_anotados = ? WHERE usuario = ? and fecha = ? and hora = ? and posicion = ?`,
      [tr3, ta3, email, fecha, hora, 3]
    );
    const [zona4] = await connection.execute(
      `UPDATE zona SET tiros_realizados = ? , tiros_anotados = ? WHERE usuario = ? and fecha = ? and hora = ? and posicion = ?`,
      [tr4, ta4, email, fecha, hora, 4]
    );
    const [zona5] = await connection.execute(
      `UPDATE zona SET tiros_realizados = ? , tiros_anotados = ? WHERE usuario = ? and fecha = ? and hora = ? and posicion = ?`,
      [tr5, ta5, email, fecha, hora, 5]
    );

    res.status(200).json({ 
      mensaje: 'Sesion y zonas actualizada correctamente' , 
      sesion: {
        nombre: nombre,
        zona1: zona1
      }});
      
  } catch(error){
    res.status(error.status).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`); //Line 6
});



