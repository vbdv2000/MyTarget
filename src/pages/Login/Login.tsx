import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText, IonIcon, IonCard, IonFooter, IonGrid, IonCol, IonRow, IonButtons, IonBackButton, useIonToast, IonImg } from '@ionic/react';
import './Login.css';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';
import { direccionIP } from '../../../config';
import logo from '../../../public/assets/icono-negro-sin-fondo.png';




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
    /*
    // Aquí va la lógica para iniciar sesión
    if (!email || !password) {
      setError('Por favor ingrese su correo electrónico y contraseña.');
      return;
    }
    if(email == "prueba@gmail.com" && password== "prueba"){
      presentToast();
      setTimeout(()=>{}, 2000);
      setLogin("true");
      window.location.href = '/page/Inicio';
    } else {
      setLogin("false");
      setError('El usuario o la contraseña no son correctos.');
      
    }
    */
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


