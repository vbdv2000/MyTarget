import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText, IonCard, IonCol, IonRow, IonButtons, useIonToast, IonImg } from '@ionic/react';
import './Login.css';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';
import { direccionIP } from '../../config';
import logo from '../../images/icono-negro-sin-fondo.png';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode'



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);

  const [present] = useIonToast();
  
  const presentToast = () => {
    present({
      message: "Ha iniciado sesión correctamente!",
      duration: 1500,
      position: "top",
      cssClass: "custom-toast",
    });
  };  

  const handleLogin =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://${direccionIP}:5000/login`, { email, password });
      var token = response.data.token;
      //localStorage.setItem('token', token);
      console.log(response);
      presentToast();
      setCookie('token',token);
      setTimeout(()=>{}, 2000);

      //history.push('/perfil')
      window.location.href = '/perfil';
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const responseMessage = async (response: any) => {
    try{
      console.log(response);
      var usuario = jwt_decode(response.credential);
      console.log(usuario);
      
      //Obtenemos los datos que nos interesan del token que genera el OAuth
      const nombre = usuario.given_name;
      const apellidos = usuario.family_name;
      const email = usuario.email;
      const res = await axios.post(`http://${direccionIP}:5000/registroOAuth`, 
      { nombre, apellidos, email});
      console.log(res);
      var token = res.data.token;
      presentToast();
      setCookie('token',token);
      setTimeout(()=>{}, 2000);

      //history.push('/perfil')
      window.location.href = '/perfil';

    } catch(err){
      if (err.response && err.response.status === 400) {
        console.log("El usuario ya está creado en nuestra base de datos y ERROR");
        //presentToast();
        //const token = tokenService.creaToken(email);
        //setCookie('token',token);
        //setTimeout(()=>{}, 2000);

        //window.location.href = '/perfil';
      } else {
        setError("Ha habido un error con OAuth");
      }
    }
      
  };
  const errorMessage = (error: any) => {
    console.log(error);
    setError(error);
  };

  return (
    <IonPage>
      <IonContent>
        <IonRow>
          <IonCol style={{ textAlign:"center" }}>
          <IonImg className='logo' src={logo} alt="logo" />
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol style={{ textAlign:"center" }}>
            <IonLabel id='title'>
              MyTarget
            </IonLabel>
          </IonCol>
        </IonRow>
         
        <IonHeader id="iniciar_sesion">
          Iniciar sesión
        </IonHeader>
        
        <IonCard>
          <form onSubmit={handleLogin}>
            <IonItem>
              <IonLabel position="floating">Correo electrónico</IonLabel>
              <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required></IonInput>
            </IonItem>
            {error && <IonText color="danger">{error}</IonText>}
            <IonButton id="boton_enviar" type="submit" expand="block" >Iniciar sesión</IonButton>
          </form>
          
          <div style={{textAlign:"center"}}>
            <IonText color="primary">
              <h1>o</h1>
            </IonText>
          </div>
          
          <div style={{textAlign:"-webkit-center", marginBottom:"12px"}}>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </div>
          
          
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="tertiary" fill="outline" routerLink="/recuperar">Olvidé la contraseña</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton color="tertiary" fill="outline" routerLink="/registro">Regístrate aquí</IonButton>
            </IonButtons>
          </IonToolbar>
          

        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;


