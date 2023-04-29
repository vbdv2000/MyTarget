import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonText, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonViewDidEnter, IonButton, IonCol, IonIcon, IonRow, IonProgressBar } from "@ionic/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { direccionIP } from "../../config";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import Sesiones from "./Sesiones";
import { isArray } from "util";
import { chevronDownCircleOutline, createOutline, trash } from "ionicons/icons";

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
      tiros_realizados_total: string;
      tiros_anotados_total: string;
      aciertoMedio: string;
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
    const [aciertoTotalMedio, setAciertoTotalMedio] = useState('');

       
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
          //sesion.aciertoMedio = tiros_anotados_sesion / tiros_realizados_sesion * 100;
          
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
    //Recorremos cada sesion y obtenemos todas las zonas
    let tiros_realizados_total = '0';
    let tiros_anotados_total = '0';
    
    sesiones.map((sesion) => {
      //Sumamos los tiros anotados y los acumulamos y los realizados y los acumulados de cada zona
      sesion.zonas.map((zona) => { 
        sesion.tiros_realizados_total = (parseInt(sesion.tiros_realizados_total) + parseInt(zona.tiros_realizados)).toString();
        sesion.tiros_anotados_total = (parseInt(sesion.tiros_anotados_total) + parseInt(zona.tiros_anotados)).toString();
      });
      tiros_realizados_total = (parseInt(tiros_realizados_total) + parseInt(sesion.tiros_realizados_total)).toString();
      tiros_anotados_total = (parseInt(tiros_anotados_total) + parseInt(sesion.tiros_anotados_total)).toString();
      console.log(sesion.tiros_realizados_total);
      console.log(sesion.tiros_anotados_total);
    });   
    console.log(tiros_realizados_total);
    console.log(tiros_anotados_total);
    

    
  } 
 
  async function calcularEstadisticas(){
    const token = cookies.token;
  
    if(!token ){
      // Si no hay token, redirigimos a la página de login
      window.location.href = '/login';        
      return;
    }
    try {
    console.log(token);
    const response = await axios.get(`http://${direccionIP}:5000/sesiones`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
      if (response.status === 201) {
        console.log(response.data);
        var tiros_realizados_total_sesiones = 0;
        var tiros_anotados_total_sesiones = 0;
        //Formateamos las sesiones para que guarde en sesiones la fecha con el formato yyyy-mm-dd
        const sesionesFormateadas = await Promise.all(response.data.sesiones.map(async (sesion: Sesion) => {
          const fechaFormateada = new Date(sesion.fecha).toISOString().slice(0, 10);
  
          const response2 = await axios.get(`http://${direccionIP}:5000/sesion`, {
            params: {
              fecha: fechaFormateada,
              hora: sesion.hora
            },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const info = response2.data;
          console.log(info);
          const zonasFormateadas = await info.zonas.map((zona: Zona) => {
            return {
              ...zona,
              fecha: fechaFormateada
            };
          });
          console.log(zonasFormateadas);

          var tr = 0;
          var ta = 0;
          zonasFormateadas.map((zona: { tiros_realizados: string; tiros_anotados: string; }) => { 
            tr += parseInt(zona.tiros_realizados);
            ta += parseInt(zona.tiros_anotados);
          });
          tiros_realizados_total_sesiones += tr;
          tiros_anotados_total_sesiones += ta;
          return {
            ...sesion,
            fecha: fechaFormateada,
            zonas: zonasFormateadas,
            tiros_realizados_total: tr.toString(),
            tiros_anotados_total: ta.toString(),
            aciertoMedio: (ta/tr*100).toFixed(2)
          };
        }));
         
        setSesiones(sesionesFormateadas); 
        const aciertoMedio =(tiros_anotados_total_sesiones/tiros_realizados_total_sesiones*100).toFixed(2);
        console.log(aciertoMedio);

        if(aciertoMedio == ''){
          console.log("Es NaN")
          setAciertoTotalMedio('0');
        } else{
          console.log("NO es NaN")
          setAciertoTotalMedio(aciertoMedio);
        }
        console.log(sesiones);  
      } 
    } catch(error: any) {
      if (error.response.status === 404) {
        console.log("ERROR: no hay sesiones");
        setError("No hay estadísticas porque no hay sesiones registradas")
      } else {
        console.log("Ha habido un error inesperado");
        setCookie('token','');
        history.push('/login');
      }
    };
  };


  useEffect(() => {
    calcularEstadisticas();  
  }, []);  

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      calcularEstadisticas();
      event.detail.complete();
    }, 1500);
  }

  return (
    <IonPage>
          
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Estadísticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Arrastra para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando...">
          </IonRefresherContent>
        </IonRefresher>

        <p style={{textAlign: "center"}}>Arrastra para actualizar estadisticas...</p>
          <> 
            {sesiones?.length == 0 || error ? (
                <h4 id="texto">No hay estadísticas porque no hay sesiones disponibles</h4>
            ) : (
              <div className="filasAlterna"> 
              
              % acierto total medio: 
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-text">
                  {aciertoTotalMedio}
                  </div>
                </div>
              </div>
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
                  <IonCol size="auto">
                    <div style={{width: "70px"}}>{sesion.tiros_realizados_total}</div>
                  </IonCol>
                  <IonCol size="auto">
                    <div style={{width: "70px"}}>{sesion.aciertoMedio}</div>
                  </IonCol>
                  
                </IonRow>

                
              ))}
              </div>
              
            )}
          </>
      </IonContent>
    </IonPage>
  );
};

export default Estadisticas;