const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const secret = require('./config').secret;
const tokenService = require('./services/token.service');
const { conectarDB } = require('./database');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended: true}));


const port = process.env.PORT || 5000; //Line 3


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
            res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); //Enviamos una cookie con una duración de 1 hora
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


app.get('/usuario', async (req, res) => {
  const token = req.cookies.token;
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  const email = await tokenService.decodificaToken(token);
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
/*
  try {
    
    // El token es válido y se ha decodificado correctamente
    console.log(usuario);
    try {
      const connection = await conectarDB();
      const [rows] = await connection.execute('SELECT * FROM usuario WHERE email=?', [usuario.email]);
     
      // Si la consulta devuelve resultados, enviamos el usuario
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404).send('Usuario no encontrado'); // Si no hay resultados, enviamos un error 404 
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el usuario'); 
    }
  })
  .catch(error => {
    // Ha ocurrido un error al decodificar el token
    console.error(error.message);
  });

  
});
*/


app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`); //Line 6
});



