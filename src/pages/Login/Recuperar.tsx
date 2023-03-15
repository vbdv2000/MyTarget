import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonCol, IonIcon, IonLabel, IonRow, IonCard, IonItem, IonBackButton, IonButtons } from '@ionic/react';
import { basketball } from 'ionicons/icons';
import React, { useState } from 'react';
import './Login.css';

const Recuperar: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value!);
  }

  const handleSubmit = () => {
    console.log(`Email: ${email}`);
    // aquí puedes agregar la lógica para enviar el email
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/login" />
            </IonButtons>
            </IonToolbar>
      </IonHeader>
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
         
        <IonHeader id="recuperar_contrasena">
          Recuperar la contraseña
        </IonHeader>
        <p className='recuperaInfo'>Ingrese la dirección de correo electrónico que tiene asociado a su cuenta y le enviaremos una nueva contraseña.</p>
        <IonCard>
            <IonItem>
                <IonLabel position="floating">Correo electrónico</IonLabel>
                <IonInput type="email" placeholder="Escribe el email de la cuenta" onIonChange={handleEmailChange}></IonInput>
            </IonItem>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>                
                <IonButton id="boton_enviar" onClick={handleSubmit}>Restablecer la contraseña</IonButton>
            </div>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Recuperar;