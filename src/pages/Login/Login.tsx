import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText, IonIcon, IonCard, IonFooter, IonGrid, IonCol, IonRow, IonButtons, IonBackButton, useIonToast } from '@ionic/react';
import { basketball, timer } from 'ionicons/icons';
import './Login.css';
import { Redirect, Route } from 'react-router';
import { waitFor } from '@testing-library/react';


const LoginPage = () => {
  const [login, setLogin] = useState('false');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  

  const [present] = useIonToast();
  
  const presentToast = () => {
    present({
      message: 'Ha iniciado sesión correctamente!',
      duration: 1500,
      position: 'top',
      cssClass: 'custom-toast',
    });
  };  

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
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
  };

  return (
    <IonPage>
      <IonContent>
        <IonRow>
          <IonCol style={{ textAlign:"center" }}>
            <IonIcon ios={basketball} md={basketball}
                style={{ fontSize: "70px", marginTop: "15%" }}
              />
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol style={{ textAlign:"center" }}>
            <IonLabel id='title'>
              MyBasket Target
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


