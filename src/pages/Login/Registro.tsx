import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCol, IonIcon, IonRow, IonHeader, IonCard, IonList, IonSelect, IonSelectOption, IonCheckbox, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import { basketball, medalOutline } from 'ionicons/icons';
import './Login.css';


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


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Nombre:', nombre);
    console.log('Apellidos:', apellidos);
    console.log('Email:', email);
    console.log('Contraseña:', password);
    console.log('Contraseña2:', password2);
    console.log('Equipo:', equipo);
    console.log('Posicion:', posicion);
    console.log('Mano hábil:', mano_habil);
    console.log('Terminos:', aceptaTerminos);
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
                    <IonIcon ios={basketball} md={basketball}
                        style={{ fontSize: "70px", marginTop: "15%" }}
                    />
                    <p>
                    <IonLabel id='title'>
                        MyBasket Target
                    </IonLabel>
                    </p>
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
