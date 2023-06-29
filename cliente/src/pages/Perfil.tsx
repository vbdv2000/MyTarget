import { IonBackButton, IonButton, IonButtons, IonCard, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './Principal.css';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';
import { direccionIP } from '../../config';

const Perfil: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  
  const presentToast = () => {
    present({
      message: 'Se han modificado los datos correctamente',
      duration: 1500,
      position: 'top',
      cssClass: 'datosModificados',
    });
  };  

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [equipo, setEquipo] = useState('');
  const [posicion, setPosicion] = useState('');
  const [mano_habil, setManoHabil] = useState('');
  const [error, setError] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['token']);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = cookies.token;

    try {
      console.log(email);      
      const response = await axios.put(`http://${direccionIP}:5000/usuario`, 
      { nombre, apellidos, equipo, posicion, mano_habil}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      presentToast();
      setNombre(response.data.usuario.nombre);
      setApellidos(response.data.usuario.apellidos);
      setEquipo(response.data.usuario.equipo);
      setPosicion(response.data.usuario.posicion);
      setManoHabil(response.data.usuario.mano_habil);

      setTimeout(()=>{}, 2000);      //history.push('/perfil')
      window.location.href = '/perfil';
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    async function llamadaAPI (){
      const token = cookies.token;
     
      if(!token ){
        // Si no hay token, redirigimos a la página de login
        history.push('/login');
        return;
      }
      
      console.log(token);
      try{
        const response = await axios.get(`http://${direccionIP}:5000/usuario`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data)
        const usuario = response.data;
  
        setEmail(usuario.email);
        setNombre(usuario.nombre);
        setApellidos(usuario.apellidos);
        setEquipo(usuario.equipo);
        setPosicion(usuario.posicion);
        setManoHabil(usuario.mano_habil);
      }  catch (error) {
        setCookie('token','');
        history.push('/login');
        setError("Algo ha ido mal obteniendo el usuario");
      }
    };

    llamadaAPI();
  }, []);

  

  
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
