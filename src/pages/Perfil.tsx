import { IonBackButton, IonButton, IonButtons, IonCard, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { basketball } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import './Principal.css';
const Perfil: React.FC = () => {

  const [present] = useIonToast();
  
  const presentToast = () => {
    present({
      message: 'Se han modificado los datos correctamente',
      duration: 1500,
      position: 'top',
      cssClass: 'custom-toast',
    });
  };  
  const [nombre, setNombre] = useState('Víctor');
  const [apellidos, setApellidos] = useState('Berenguer Del Valle');
  const [email, setEmail] = useState('victor@example.com');
  const [equipo, setEquipo] = useState('C.B. Jorge Juan');
  const [posicion, setPosicion] = useState('alero');
  const [mano_habil, setManoHabil] = useState('derecha');


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    presentToast();
    // Aquí se enviarían los datos actualizados a la API 
    console.log('Nombre:', nombre);
    console.log('Apellidos:', apellidos);
    console.log('Email:', email);
    console.log('Equipo:', equipo);
    console.log('Posicion:', posicion);
    console.log('Mano hábil:', mano_habil);

  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Mi perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <h2 id="miperfil">
          Mi perfil
        </h2>
      

        <IonCard>
          <form onSubmit={handleSubmit}>

            <IonItem>
                <IonLabel position="floating">Nombre</IonLabel>
                <IonInput type="text" value={nombre} onIonChange={e => setNombre(e.detail.value!)} required ></IonInput>
            </IonItem>

            <IonItem>
                <IonLabel position="floating">Apellidos</IonLabel>
                <IonInput type="text" value={apellidos} onIonChange={e => setApellidos(e.detail.value!)} required></IonInput>
            </IonItem>

            <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required></IonInput>
            </IonItem>

            <IonItem>
                <IonLabel position="floating">Equipo</IonLabel>
                <IonInput type="text" value={equipo} onIonChange={e => setEquipo(e.detail.value!)} ></IonInput>
            </IonItem>
                
            <IonRow>
                <IonCol>
                    <IonList>
                        <IonItem>
                            <IonSelect value={posicion} interface="action-sheet" placeholder="Posicion" onIonChange={e => setPosicion(e.detail.value!)}>
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
                            <IonSelect value={mano_habil} color="primary" interface="action-sheet" placeholder="Selecciona mano hábil" onIonChange={e => setManoHabil(e.detail.value!)}>
                                <IonSelectOption value="derecha">Derecha</IonSelectOption>
                                <IonSelectOption value="izquierda">Izquierda</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonList>
                </IonCol>
            </IonRow>


            <IonButton id="boton_enviar" expand='block' type="submit">Confirmar datos</IonButton>
          </form>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
