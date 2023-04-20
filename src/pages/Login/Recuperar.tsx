import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonCol, IonIcon, IonLabel, IonRow, IonCard, IonItem, IonBackButton, IonButtons, useIonToast, IonImg } from '@ionic/react';
import { basketball } from 'ionicons/icons';
import React, { useState } from 'react';
import './Login.css';
import logo from '../../../public/assets/icono-negro-sin-fondo.png';


const Recuperar: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value!);
  }

  const handleSubmit = () => {
    console.log(`Email: ${email}`);
    // aquí va la lógica para enviar el email
  }

  const [present] = useIonToast();

  const presentToast = (position: 'top' | 'middle' | 'bottom') => {
    present({
      message: 'Se ha mandado el correo correctamente',
      duration: 2000,
      position: position,
      cssClass: 'custom-toast',
    });
  };  


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
                <IonButton id="boton_enviar" onClick={()=>{
                    presentToast('top');
                    handleSubmit();
                    }}>Restablecer la contraseña</IonButton>
            </div>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Recuperar;