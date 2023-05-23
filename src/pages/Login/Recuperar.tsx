import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonCol, IonIcon, IonLabel, IonRow, IonCard, IonItem, IonBackButton, IonButtons, useIonToast, IonImg, IonText } from '@ionic/react';
import React, { useState } from 'react';
import './Login.css';
import logo from '../../../public/assets/icono-negro-sin-fondo.png';
import axios from 'axios';
import { direccionIP } from '../../../config';


const Recuperar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value!);
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

  const enviarCorreo = async () => {
    try{
      const response = await axios.get(`http://${direccionIP}:5000/recuperar?email=${email}`);
      console.log(response);
      presentToast('top');
    } catch (errorr) {
      setError('Email no registrado en nuestra base de datos');
    }
  }

/*
  const enviarCorreo = async (destino: string , pass: string) => {
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'my.basket.target@gmail.com', 
        pass: 'Mytarget2023' 
      },
    });
  
    // Definir el mensaje de correo electrónico
    const mensajeCorreo = {
      from: 'my.basket.target@gmail.com', 
      to: destino, 
      subject: 'Nueva contraseña', 
      text: `La nueva contraseña es: ${pass}`
    };
  
    try {
      const info = await transporter.sendMail(mensajeCorreo);
      console.log('Correo electrónico enviado:', info.response);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  };
  

  const modificarPassword = async (email: string, newPassword: string) => {
    //throw new Error('Function not implemented.'); 
  }
  
*/

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
            {error && <IonText color="danger">{error}</IonText>}   
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>    
                <IonButton id="boton_enviar" onClick={ enviarCorreo }>Restablecer la contraseña</IonButton>
            </div>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Recuperar;


