import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCol, IonIcon, IonRow, IonHeader, IonCard, IonList, IonSelect, IonSelectOption, IonCheckbox, IonToolbar, IonButtons, IonBackButton, useIonToast, IonText, IonImg } from '@ionic/react';
import './Login.css';
import axios from 'axios';
import { direccionIP } from '../../config';
import logo from '../../images/icono-negro-sin-fondo.png';


const Registro: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [equipo, setEquipo] = useState<string>('');
  const [posicion, setPosicion] = useState<string>('');
  const [mano_habil, setManoHabil] = useState<string>('');
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);
  const [error, setError] = useState('');

  const [present] = useIonToast();
  
  const presentToast = () => {
    present({
      message: "Se ha creado el usuario correctamente",
      duration: 1500,
      position: "top",
      cssClass: "custom-toast",
    });
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        // Validar que tenga más de 6 caracteres teniendo minúsculas, mayúsculas y número signo de puntuación

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            setError('La contraseña debe contener al menos una letra mayúscula y una letra minúscula');
            return;
        }

        if (!/\d|\p{P}/u.test(password)) {
            setError('La contraseña debe contener al menos un número o un signo de puntuación');
            return;
          }

        if(password == password2){
            const response = await axios.post(`http://${direccionIP}:5000/registro`, 
            { nombre, apellidos, email, password, equipo, posicion, mano_habil});
            console.log(response);
            presentToast();
            setTimeout(()=>{}, 2000);
            window.location.href = '/login';
        } else{
            setError("Las contraseñas deben coincidir");
        }
        
    } catch (err) {
        setError("Email ya registrado en nuestra base de datos");
    }
     
  }

  //Este useEffect se ejecuta cada vez que cambia el valor del checkBox
  useEffect(() => {
    if (aceptaTerminos) {
      setBotonHabilitado(true);
    } else {
      setBotonHabilitado(false);
    }
  }, [aceptaTerminos]);

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
                    <IonHeader id="registrate">
                        Regístrate
                    </IonHeader>
                </IonCol>
                <IonCol style={{ textAlign:"center" }}>
                <IonImg className='logo' src={logo} alt="logo" />
                    <IonLabel id='title'>
                        MyTarget
                    </IonLabel>
                </IonCol>
            </IonRow>
            <IonCard>

                <form onSubmit={handleSubmit}>
                <IonItem>
                    <IonLabel position="floating">Nombre *</IonLabel>
                    <IonInput type="text" value={nombre} onIonChange={e => setNombre(e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Apellidos *</IonLabel>
                    <IonInput type="text" value={apellidos} onIonChange={e => setApellidos(e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Email *</IonLabel>
                    <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Contraseña *</IonLabel>
                    <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Repita la contraseña *</IonLabel>
                    <IonInput type="password" value={password2} onIonChange={e => setPassword2(e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Equipo</IonLabel>
                    <IonInput type="text" value={equipo} onIonChange={e => setEquipo(e.detail.value!)}></IonInput>
                </IonItem>
                    
                <IonRow>
                    <IonCol>
                        <IonList>
                            <IonItem>
                                <IonSelect value={posicion} onIonChange={e => setPosicion(e.detail.value)} interface="action-sheet" placeholder="Posicion">
                                    <IonSelectOption value="base">Base</IonSelectOption>
                                    <IonSelectOption value="escolta">Escolta</IonSelectOption>
                                    <IonSelectOption value="alero">Alero</IonSelectOption>
                                    <IonSelectOption value="ala-pivot">Ala-pívot</IonSelectOption>
                                    <IonSelectOption value="pivot">Pívot</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonList>
                    </IonCol>
            
                    <IonCol>
                        <IonList>
                            <IonItem>
                                <IonSelect value={mano_habil} color="primary" onIonChange={e => setManoHabil(e.detail.value)} interface="action-sheet" placeholder="Selecciona mano hábil">
                                    <IonSelectOption value="derecha">Derecha</IonSelectOption>
                                    <IonSelectOption value="izquierda">Izquierda</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonList>
                    </IonCol>
                </IonRow>

                <IonItem>
                    <IonCheckbox slot="start"  checked={aceptaTerminos} onIonChange={e => setAceptaTerminos(e.detail.checked)} />
                    <IonLabel>Acepto los términos y condiciones</IonLabel>
                </IonItem>

                {error && <IonText color="danger">{error}<br></br></IonText>}
                <IonButton id="boton_enviar" type="submit" expand='block' disabled={!botonHabilitado}>Continuar</IonButton>
                </form>

                <IonRow>
                    <IonCol style={{textAlign:"center"}}>
                        <IonLabel>¿Ya tienes cuenta?</IonLabel>
                        <IonButton color="blue" class='links' fill="clear" routerLink="/login"> Iniciar sesión</IonButton>
                    </IonCol>
                </IonRow>
            </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Registro;
