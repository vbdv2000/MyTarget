import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRow,
} from '@ionic/react';

import logo from '../../public/assets/icono-negro-sin-fondo.png';
import { useHistory, useLocation } from 'react-router-dom';
import { statsChartSharp, basketballSharp, personSharp, logOutSharp } from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { direccionIP } from '../config';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Estadísticas',
    url: '/estadisticas',
    iosIcon: statsChartSharp,
    mdIcon: statsChartSharp
  },
  {
    title: 'Sesiones de tiro',
    url: '/sesiones',
    iosIcon: basketballSharp,
    mdIcon: basketballSharp
  },
  {
    title: 'Perfil',
    url: '/perfil',
    iosIcon: personSharp,
    mdIcon: personSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [equipo, setEquipo] = useState('');
  const [posicion, setPosicion] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const history = useHistory();
  
  const token = cookies.token;
  useEffect(() => {
    async function cargarMenu (){
      const token = cookies.token;
      if(!token ){
        // Si no hay token, redirigimos a la página de login
        history.push('/login');
        return;
      }
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
        setEquipo(usuario.equipo || null);
        const posicionMayuscula = usuario.posicion ? usuario.posicion.charAt(0).toUpperCase() + usuario.posicion.slice(1) : null;
        setPosicion(posicionMayuscula);
      }  catch (error) {
        setCookie('token','');
        console.log(error);
        console.log("Algo ha ido mal obteniendo datos del usuario");
        history.push('/login');
      }
    };

    cargarMenu();
  }, []);

  const cerrarSesion = async () => {
    const token = cookies.token;
    
    try{
    
      setCookie('token','');
      console.log(token);
      window.location.href = '/login';
    }  catch (error) {
      //removeCookie(token);
      console.log("Algo ha ido mal haciendo logout");
      //history.push('/login');
    }
  }
  return (
    <>
    {token &&(
    <IonMenu contentId="main" type="overlay">
      <IonContent> 
        <IonRow>
          <IonCol style={{ textAlign:"center" }}>
            <IonImg className="logoMenu" src={logo} alt="logo" />
            <IonLabel id='title'>
                MyTarget
            </IonLabel>
            
          </IonCol>
        </IonRow>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{nombre} {apellidos}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {posicion}
            <br></br>
            {equipo}
          </IonCardContent>
        </IonCard>
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
          <div className='botonLogout'>
            <IonButton onClick={cerrarSesion} color={"danger"}>
              <IonIcon icon={logOutSharp} slot="end" color='dark'></IonIcon>
              Cerrar sesión
            </IonButton>
          </div>
        
      </IonContent>
    </IonMenu>
    )}
    </>
  );
};

export default Menu;
