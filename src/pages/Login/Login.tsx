import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText, IonIcon, IonCard, IonFooter, IonGrid, IonCol, IonRow, IonButtons } from '@ionic/react';
import { basketball } from 'ionicons/icons';
import './Login.css';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Aquí va la lógica para iniciar sesión
  };

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
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
          <IonItem>
            <IonLabel position="floating">Correo electrónico</IonLabel>
            <IonInput type="email" value={username} onIonChange={handleUsernameChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput type="password" value={password} onIonChange={handlePasswordChange}></IonInput>
          </IonItem>
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton id="boton_enviar" expand="block" onClick={handleLogin}>Iniciar sesión</IonButton>
          

          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="blue" class='links' fill="clear" routerLink="/recuperar">Olvidé la contraseña</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton color="blue" class='links' fill="clear" routerLink="/registro">Regístrate aquí</IonButton>
            </IonButtons>
          </IonToolbar>
          

        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
