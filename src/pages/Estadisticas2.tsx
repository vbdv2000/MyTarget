import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonText, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonViewDidEnter, IonButton, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { direccionIP } from "../../config";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import Sesiones from "./Sesiones";
import { isArray } from "util";
import { addCircleOutline, createOutline, trash } from "ionicons/icons";

const Estadisticas: React.FC = () => {  

    const history = useHistory();

    interface SesionSimple {
      fecha: string;
      hora: string;
      nombre: string;
      usuario: string;
    }

    interface Sesion {
      fecha: string;
      hora: string;
      nombre: string;
      usuario: string;
      zonas: Zona[];
      aciertoMedio: number;
    }

    interface Zona{
      fecha: string;
      hora: string;
      posicion: string;
      tiros_realizados: string;
      tiros_anotados: string;
      usuario: string;
      aciertoMedioZona: number;
    }
    
    const [sesionesSimples, setSesionesSimples] = useState<SesionSimple[]>([]);
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //Estadisticas
    const [aciertoTotalMedio, setAciertoTotalMedio] = useState(0);

       
    //Funcion para calcular el acierto medio de cada sesion y ponerlo en el array de sesiones, se guarda tbn las zonas de cada sesion
    const func_aciertoMedioPorSesion = async () => {
      //Obtener los datos de todas las sesiones
      await Promise.all(sesiones.map(async (sesion, index) => {
          //Sumamos los tiros anotados y los acumulamos y los realizados y los acumulados de cada zona

          var tiros_realizados_sesion = 0;
          var tiros_anotados_sesion = 0;
          console.log(sesion.zonas);
          sesion.zonas.map((zona) => {
            //tiros_realizados_sesion += parseInt(zona.tiros_realizados);
            //tiros_anotados_sesion += parseInt(zona.tiros_anotados);
          })
          sesion.aciertoMedio = tiros_anotados_sesion / tiros_realizados_sesion * 100;
          
      })); 
    } 

  
    
/*
  const obtenerZonas = async (sesion: Sesion) => {
      const token = cookies.token;
      const fechaFormateada = new Date(sesion.fecha).toISOString().slice(0, 10);
      const response = await axios.get(`http://${direccionIP}:5000/sesion`, {
          params: {
              fecha: fechaFormateada,
              hora: sesion.hora
          },
          headers: {
          'Authorization': `Bearer ${token}`
          }
      });
      
      const info = response.data;
      console.log(info);
      var suma_tr = 0;
      var suma_ta = 0;
      info.zonas.map((zona: any) => {
          suma_tr += zona.tiros_realizados;
          suma_ta += zona.tiros_anotados;
      })
      
      return [info.zonas, suma_tr, suma_ta];
  };
*/
  //El acierto medio total es el valor de sumar todos los tiros anotados de todoas las zonas de todas las seiones y dividirlo entre todos los tiros realizados
  async function func_aciertoMedioTotal() {
    if (loading) {
      return;
    }
      //Obtener los datos de todas las sesiones
    //await obtenerSesiones(); 
    console.log(sesiones);
    console.log(sesiones);
    //Recorremos cada sesion y obtenemos todas las zonas
    var tiros_realizados_total = 0;
    var tiros_anotados_total = 0;
    
    await Promise.all(sesiones.map(async (sesion) => {
        //Sumamos los tiros anotados y los acumulamos y los realizados y los acumulados de cada zona
        sesion.zonas.map(async (zona) => { 
          tiros_realizados_total += parseInt(zona.tiros_realizados);
          tiros_anotados_total += parseInt(zona.tiros_anotados);
        });
    }));   
    console.log(tiros_realizados_total);
    console.log(tiros_anotados_total);
    const aciertoMedio = parseFloat((tiros_anotados_total/tiros_realizados_total*100).toFixed(2));
    
    if(Number.isNaN(aciertoMedio)){
      console.log("Es NaN")
      setAciertoTotalMedio(0.0);
    } else{
      console.log("NO es NaN")
      setAciertoTotalMedio(aciertoMedio);
    }

    
  } 
 

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
            console.log(sesiones); 
          } else if (response.status === 404) {
            console.log("No se encontraron sesiones")
          }
        })
        .catch(error => {
          setCookie('token','');
          history.push('/login');
          console.log(error)
        });
    };
    obtenerSesiones();
  }, []);



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
        

        <IonButton className="botonCrear" color={"success"}>
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
                        <IonButton size="default" >
                          <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
                        </IonButton>
                        <IonButton size="default" color={"danger"}>
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

export default Estadisticas;