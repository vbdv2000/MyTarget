import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, useIonToast } from "@ionic/react";
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { addCircleOutline, createOutline, trash } from "ionicons/icons";
import './Principal.css';
import { direccionIP } from "../../config";



const Sesiones: React.FC = () => {  

    interface Sesion {
      fecha: string;
      hora: string;
      nombre: string;
      usuario: string;
    }

    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const history = useHistory();
    const [present] = useIonToast();
  
    const presentToast = () => {
      present({
        message: 'Se ha eliminado la sesión correctamente',
        duration: 1500,
        position: 'top',
        cssClass: 'sesionEliminada',
      });
    };  

  useEffect(() => {
    const obtenerSesiones = async () => {
      const token = cookies.token;
     
      if(!token ){
        // Si no hay token, redirigimos a la página de login
        window.location.href = '/login';        
        return;
      }
      
      console.log(token);
      axios.get(`http://${direccionIP}:5000/sesiones`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }})
        .then(response => {
          if (response.status === 201) {
            console.log(response.data);

            //Formateamos las sesiones para que guarde en sesiones la fecha con el formato yyyy-mm-dd
            const sesionesFormateadas = response.data.sesiones.map((sesion: Sesion) => {
              const fechaFormateada = new Date(sesion.fecha).toISOString().slice(0, 10);
              return {
                ...sesion,
                fecha: fechaFormateada
              };
            });
            setSesiones(sesionesFormateadas);
          } else if (response.status === 404) {
            console.log("No se encontraron sesiones")
          }
        })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("ERROR: no hay sesiones");
        } else {
          console.log("Ha habido un error inesperado");
          setCookie('token','');
          history.push('/login');
        }
      });
    
    }
    obtenerSesiones();
  }, []);

  const crearSesion = () => {
    history.push('/crearSesion');
    //window.location.href= '/crearSesion';
  }

  const editarSesion = (fecha: string, hora: string) => {
    const fechaHora = {
      fecha: fecha,
      hora: hora
    };
    const query = new URLSearchParams(fechaHora).toString();
    
    window.location.href = `/modificarSesion?${query}`;
    //history.push('/modificarSesion', {fecha, hora});
  }

  const eliminarSesion = async (fecha: String, hora: String) => {
    const token = cookies.token;
    if(!token ){
      // Si no hay token, redirigimos a la página de login
      window.location.href = '/login';
      return;
    }
    
    console.log(token);
    try{  
      const response = await axios.delete(
        `http://${direccionIP}:5000/sesiones/${fecha}/${hora}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
      console.log(sesiones)
      setSesiones(sesiones.filter(sesion => sesion.fecha != fecha || sesion.hora != hora));
     
      presentToast();  //Mostrar mensaje

    } catch (error) {
      setCookie('token','');
      history.push('/login');
      console.log("Algo ha ido mal eliminando la sesion");
    }
  }


  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sesiones de tiro</IonTitle>
          </IonToolbar>
        </IonHeader>
        

        <IonButton className="botonCrear" color={"success"} onClick={crearSesion}>
        <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
          Crear una sesión
        </IonButton>
        <>
            {sesiones?.length == 0 ? (
                <h4 id="texto">No hay sesiones disponibles</h4>
            ) : (
                
            <IonGrid>
                <IonHeader>
                  <IonRow className="primeraFila">
                    <IonCol size="auto">
                      <div style={{width: "20px", textAlign:"center"}}>Nº</div>
                    </IonCol>
                    <IonCol size="auto">
                      <div style={{width: "70px" }}>Nombre</div>
                    </IonCol>
                    <IonCol  size="auto">
                      <div style={{width: "70px" }}>Fecha</div>
                    </IonCol>
                    <IonCol>
                      <div style={{width: "31px" }}>Hora</div>
                    </IonCol>
                    <IonCol>Acciones</IonCol>
                  </IonRow>
                </IonHeader>
                <div className="filasAlterna"> 
                  {sesiones?.map((sesion, index) => (
                       
                    <IonRow key={`${sesion.fecha}-${sesion.hora}`}>
                      <IonCol size="auto">
                        <div style={{width: "20px", textAlign:"center"}}>{index+1}</div>
                      </IonCol>
                      <IonCol size="auto">
                        <div style={{width: "70px"}}>{sesion.nombre}</div>
                      </IonCol>
                      <IonCol size="auto">
                        <div style={{width: "70px"}}>{new Date(sesion.fecha).toISOString().slice(0, 10)}</div>
                      </IonCol>
                      <IonCol size="auto">
                        <div style={{width: "31px" }}>{new Date("1970-01-01T" + sesion.hora + "").toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </IonCol>
                      <IonCol style={{textAlign:"center"}}>
                        <IonButton size="default" onClick={() => editarSesion(sesion.fecha, sesion.hora)}>
                          <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
                        </IonButton>
                        <IonButton size="default" color={"danger"} onClick={() => eliminarSesion(new Date(sesion.fecha).toISOString().slice(0, 10), sesion.hora)}>
                          <IonIcon slot="icon-only" icon={trash} color="dark"></IonIcon>
                        </IonButton>
                      </IonCol>
                    </IonRow>
  
                    
                  ))}
                  </div>
            </IonGrid>
      )}
        </>
        </IonContent>
      </IonPage>
  );
};

export default Sesiones;