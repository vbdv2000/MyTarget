import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonText, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonViewDidEnter, IonButton, IonCol, IonIcon, IonRow, IonProgressBar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAccordion, IonAccordionGroup, IonItem, IonLabel } from "@ionic/react";
import axios from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { direccionIP } from "../../config";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { chevronDownCircleOutline, createOutline, trash } from "ionicons/icons";
import './Principal.css';
import * as d3 from "d3";

const Estadisticas: React.FC = () => {  
  const history = useHistory();

  interface Sesion {
    fecha: string;
    hora: string;
    nombre: string;
    usuario: string;
    zonas: Zona[];
    tiros_realizados_total: string;
    tiros_anotados_total: string;
    aciertoMedio: string;
    tiros_realizados_2puntos: string;
    tiros_anotados_2puntos: string;
    aciertoMedio_2puntos: string;
    tiros_realizados_3puntos: string;
    tiros_anotados_3puntos: string;
    aciertoMedio_3puntos: string;
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
    
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [error, setError] = useState('');

  //Estadisticas
  const [aciertoTotalMedio, setAciertoTotalMedio] = useState('');
  const [aciertoTotalMedio2puntos, setAciertoTotalMedio2puntos] = useState('');
  const [aciertoTotalMedio3puntos, setAciertoTotalMedio3puntos] = useState('');
  const [aciertosMedio, setAciertosMedio] = useState<String[]>([]);
  const [obtenidas, setObtenidas] = useState(false);

  const [tirosAnotadosTotales, setTirosAnotadosTotales] = useState(0);
  const [tirosRealizadosTotales, setTirosRealizadosTotales] = useState(0);
  const [tirosAnotadosTotales2puntos, setTirosAnotadosTotales2puntos] = useState(0);
  const [tirosRealizadosTotales2puntos, setTirosRealizadosTotales2puntos] = useState(0);
  const [tirosAnotadosTotales3puntos, setTirosAnotadosTotales3puntos] = useState(0);
  const [tirosRealizadosTotales3puntos, setTirosRealizadosTotales3puntos] = useState(0);

  // Ref para los gráficos
  const svgRef1 = useRef(null);
  const svgRef2 = useRef(null);
  const svgRef3 = useRef(null);
  const svgRef4 = useRef(null);
  const svgRef5 = useRef(null);
  const svgRef6 = useRef(null);

  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);



/*
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
  */
 
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
        var tiros_realizados_2puntos_sesiones = 0;
        var tiros_anotados_2puntos_sesiones = 0;
        var tiros_realizados_3puntos_sesiones = 0;
        var tiros_anotados_3puntos_sesiones = 0;
        const aciertosMedio: string[] = [];
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
          const zonasFormateadas = await Promise.all(info.zonas.map((zona: Zona) => {
            return {
              ...zona,
              fecha: fechaFormateada
            };
          }));
          console.log(zonasFormateadas);

          var tr = 0;
          var ta = 0;
          var tr_2puntos = 0;
          var ta_2puntos = 0;
          var tr_3puntos = 0;
          var ta_3puntos = 0;

          await Promise.all(zonasFormateadas.map((zona: { tiros_realizados: string; tiros_anotados: string; posicion: number}) => { 
            tr += parseInt(zona.tiros_realizados);
            ta += parseInt(zona.tiros_anotados);
            if (zona.posicion >= 1 && zona.posicion <= 5){ //zona de 2 puntos
              tr_3puntos += parseInt(zona.tiros_realizados);
              ta_3puntos += parseInt(zona.tiros_anotados);
            } else {
              tr_2puntos += parseInt(zona.tiros_realizados);
              ta_2puntos += parseInt(zona.tiros_anotados);
            }
          }));
          tiros_realizados_total_sesiones += tr;
          tiros_anotados_total_sesiones += ta;
          
          tiros_realizados_2puntos_sesiones += tr_2puntos;
          tiros_anotados_2puntos_sesiones += ta_2puntos;
          tiros_realizados_3puntos_sesiones += tr_3puntos;
          tiros_anotados_3puntos_sesiones += ta_3puntos;
          
          aciertosMedio.push((ta/tr*100).toFixed(2));
          const sesionModificada: Sesion = {
            ...sesion,
            fecha: fechaFormateada,
            zonas: zonasFormateadas,
            tiros_realizados_total: tr.toString(),
            tiros_anotados_total: ta.toString(),
            aciertoMedio: isNaN(ta / tr * 100) ? '0' : (ta/tr*100).toFixed(2),
            tiros_realizados_2puntos: tr_2puntos.toString(),
            tiros_anotados_2puntos: ta_2puntos.toString(),
            aciertoMedio_2puntos:isNaN(ta_2puntos/tr_2puntos*100) ? '0' : (ta_2puntos/tr_2puntos*100).toFixed(2),
            tiros_realizados_3puntos: tr_3puntos.toString(),
            tiros_anotados_3puntos: ta_3puntos.toString(),
            aciertoMedio_3puntos: isNaN(ta_3puntos/tr_3puntos*100) ? '0' : (ta_3puntos/tr_3puntos*100).toFixed(2),
          };
         
          return sesionModificada; 
        }));
        console.log(sesionesFormateadas); 
        setSesiones(sesionesFormateadas); 
        const aciertoMedio =(tiros_anotados_total_sesiones/tiros_realizados_total_sesiones*100).toFixed(2);
        const aciertoMedio2puntos =(tiros_anotados_2puntos_sesiones/tiros_realizados_2puntos_sesiones*100).toFixed(2);
        const aciertoMedio3puntos =(tiros_anotados_3puntos_sesiones/tiros_realizados_3puntos_sesiones*100).toFixed(2);
        console.log(aciertoMedio);
        console.log(aciertosMedio);
        setTirosAnotadosTotales(tiros_anotados_total_sesiones);
        setTirosRealizadosTotales(tiros_realizados_total_sesiones);
        setTirosAnotadosTotales2puntos(tiros_anotados_2puntos_sesiones);
        setTirosRealizadosTotales2puntos(tiros_realizados_2puntos_sesiones);
        setTirosAnotadosTotales3puntos(tiros_anotados_3puntos_sesiones);
        setTirosRealizadosTotales3puntos(tiros_realizados_3puntos_sesiones);
        if(isNaN(parseInt(aciertoMedio))){
          setAciertoTotalMedio('0');
        } else {
          setAciertoTotalMedio(aciertoMedio);
        }

        if(isNaN(parseInt(aciertoMedio2puntos))){
          setAciertoTotalMedio2puntos('0');
        } else {
          setAciertoTotalMedio2puntos(aciertoMedio2puntos);
        }

        if(isNaN(parseInt(aciertoMedio3puntos))){
          setAciertoTotalMedio3puntos('0');
        } else {
          setAciertoTotalMedio3puntos(aciertoMedio3puntos);
        }
        setObtenidas(true);
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


  const crearGraficos = (datos: { fecha: Date; acierto: string; }[], svgRef) => {    
    // Tamaño del gráfico
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 300 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;


    // Eliminamos el SVG para que cuando se actualicen los datos no se muestre el de antes
    d3.select(svgRef.current).selectAll('g').remove();


    // Crear el contenedor SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Escalas para los ejes x e y
    const xScale = d3.scaleTime()
    .domain(d3.extent(datos, d => d.fecha))
    .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0,100])
      .range([height, 0]);

    // Ejes x e y
    const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%d-%m")) // Cambia el tamaño del eje X
    const yAxis = d3.axisLeft(yScale)
      .tickValues(d3.range(0, 101, 20));

    // Agregar ejes al gráfico
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '7px');

    svg.append('g')
      .call(yAxis);

    // Línea del gráfico
    const line = d3.line()
      .x(d => xScale(d.fecha) )
      .y(d => yScale(d.acierto));

    svg.append('path')
      .datum(datos)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
      

    // Puntos de datos
    svg.selectAll('.punto')
      .data(datos)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.fecha))
      .attr('cy', d => yScale(d.acierto))
      .attr('r', 5)
      .attr('fill', 'orange');

    // Valor en cada punto
    svg.selectAll('.valor')
      .data(datos)
      .enter()
      .append('text')
      .attr('class', 'valor')
      .attr('x', d => xScale(d.fecha))
      .attr('y', d => yScale(d.acierto) - 10)
      .text(d => d.acierto);

    // Fecha en cada punto
    svg.selectAll('.fecha')
    .data(datos)
    .enter()
    .append('text')
    .attr('class', 'fecha')
    .attr('x', d => xScale(d.fecha))
    .attr('y', d => yScale(d.acierto) + 15)
    .text(d => d3.timeFormat('%d/%m/%Y')(d.fecha)); // Formato de fecha

    svg.append('style').text(`
      .valor {
        font-size: 8px;
        font-weight: bold;
        text-anchor: middle;
        fill: black;
      }
      .fecha {
        font-size: 8px;
        text-anchor: middle;
        fill: gray;
      }
    `
    );

  };


  useEffect(() => {

    calcularEstadisticas();  

    // Crear gráfico de aciertoMedio
    const aciertoMedio = sesiones.map(d => ({
      fecha: new Date(d.fecha),
      acierto: d.aciertoMedio,
    }));
    crearGraficos(aciertoMedio, svgRef1);  

    // Crear gráfico de aciertoMedio
    let tirosAnotadosTotales = 0;
    let tirosRealizadosTotales = 0;
    const aciertoMedioAcumulado = sesiones.map(d => {
      tirosAnotadosTotales += parseInt(d.tiros_anotados_total);
      tirosRealizadosTotales += parseInt(d.tiros_realizados_total);
      return {
        fecha: new Date(d.fecha),
        acierto: isNaN(tirosAnotadosTotales / tirosRealizadosTotales) ? '0' : (tirosAnotadosTotales * 100 / tirosRealizadosTotales).toFixed(2)
      };
    });
    crearGraficos(aciertoMedioAcumulado, svgRef4);  

    // Crear gráfico de aciertoMedio2puntos
    const aciertoMedio_2puntos = sesiones.map(d => ({
      fecha: new Date(d.fecha),
      acierto: d.aciertoMedio_2puntos,
    }));
    crearGraficos(aciertoMedio_2puntos, svgRef2);  

    // Crear gráfico de aciertoMedio2puntos ACUMULADO
    let tirosAnotadosTotales2puntos = 0;
    let tirosRealizadosTotales2puntos = 0;
    const aciertoMedioAcumulado2puntos = sesiones.map(d => {
      tirosAnotadosTotales2puntos += parseInt(d.tiros_anotados_2puntos);
      tirosRealizadosTotales2puntos += parseInt(d.tiros_realizados_2puntos);
      return {
        fecha: new Date(d.fecha),
        acierto: isNaN(tirosAnotadosTotales2puntos / tirosRealizadosTotales2puntos) ? '0' : (tirosAnotadosTotales2puntos * 100 / tirosRealizadosTotales2puntos).toFixed(2)
      };
    });
    crearGraficos(aciertoMedioAcumulado2puntos, svgRef5);  

    // Crear gráfico de aciertoMedio
    const aciertoMedio_3puntos = sesiones.map(d => ({
      fecha: new Date(d.fecha),
      acierto: d.aciertoMedio_3puntos,
    }));
    crearGraficos(aciertoMedio_3puntos, svgRef3);  

    // Crear gráfico de aciertoMedio3puntos ACUMULADO
    let tirosAnotadosTotales3puntos = 0;
    let tirosRealizadosTotales3puntos = 0;
    const aciertoMedioAcumulado3puntos = sesiones.map(d => {
      tirosAnotadosTotales3puntos += parseInt(d.tiros_anotados_3puntos);
      tirosRealizadosTotales3puntos += parseInt(d.tiros_realizados_3puntos);
      return {
        fecha: new Date(d.fecha),
        acierto: isNaN(tirosAnotadosTotales3puntos / tirosRealizadosTotales3puntos) ? '0' : (tirosAnotadosTotales3puntos * 100 / tirosRealizadosTotales3puntos).toFixed(2)
      };
    });
    crearGraficos(aciertoMedioAcumulado3puntos, svgRef6);  

  }, [obtenidas]);  

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    try{
      setTimeout(() => {
        // Any calls to load data go here
        calcularEstadisticas();

        // Crear gráfico de aciertoMedio
        const aciertoMedio = sesiones.map(d => ({
          fecha: new Date(d.fecha),
          acierto: d.aciertoMedio,
        }));
        crearGraficos(aciertoMedio, svgRef1);  

        // Crear gráfico de aciertoMedio ACUMULADO
        let tirosAnotadosTotales = 0;
        let tirosRealizadosTotales = 0;
        const aciertoMedioAcumulado = sesiones.map(d => {
          tirosAnotadosTotales += parseInt(d.tiros_anotados_total);
          tirosRealizadosTotales += parseInt(d.tiros_realizados_total);
          return {
            fecha: new Date(d.fecha),
            acierto: isNaN(tirosAnotadosTotales / tirosRealizadosTotales) ? '0' : (tirosAnotadosTotales * 100 / tirosRealizadosTotales).toFixed(2)
          };
        });
        crearGraficos(aciertoMedioAcumulado, svgRef4);  

        // Crear gráfico de aciertoMedio2puntos
        const aciertoMedio_2puntos = sesiones.map(d => ({
          fecha: new Date(d.fecha),
          acierto: d.aciertoMedio_2puntos,
        }));
        crearGraficos(aciertoMedio_2puntos, svgRef2);  

        // Crear gráfico de aciertoMedio2puntos ACUMULADO
        let tirosAnotadosTotales2puntos = 0;
        let tirosRealizadosTotales2puntos = 0;
        const aciertoMedioAcumulado2puntos = sesiones.map(d => {
          tirosAnotadosTotales2puntos += parseInt(d.tiros_anotados_2puntos);
          tirosRealizadosTotales2puntos += parseInt(d.tiros_realizados_2puntos);
          return {
            fecha: new Date(d.fecha),
            acierto: isNaN(tirosAnotadosTotales2puntos / tirosRealizadosTotales2puntos) ? '0' : (tirosAnotadosTotales2puntos * 100 / tirosRealizadosTotales2puntos).toFixed(2)
          };
        });
        crearGraficos(aciertoMedioAcumulado2puntos, svgRef5);  


        // Crear gráfico de aciertoMedio
        const aciertoMedio_3puntos = sesiones.map(d => ({
          fecha: new Date(d.fecha),
          acierto: d.aciertoMedio_3puntos,
        }));
        crearGraficos(aciertoMedio_3puntos, svgRef3);  

        // Crear gráfico de aciertoMedio3puntos ACUMULADO
        let tirosAnotadosTotales3puntos = 0;
        let tirosRealizadosTotales3puntos = 0;
        const aciertoMedioAcumulado3puntos = sesiones.map(d => {
          tirosAnotadosTotales3puntos += parseInt(d.tiros_anotados_3puntos);
          tirosRealizadosTotales3puntos += parseInt(d.tiros_realizados_3puntos);
          return {
            fecha: new Date(d.fecha),
            acierto: isNaN(tirosAnotadosTotales3puntos / tirosRealizadosTotales3puntos) ? '0' : (tirosAnotadosTotales3puntos * 100 / tirosRealizadosTotales3puntos).toFixed(2)
          };
        });
        crearGraficos(aciertoMedioAcumulado3puntos, svgRef6);  

        event.detail.complete();
      }, 1500);
    } catch (error: any){
      console.log("Ha habido un error inesperado");
      setCookie('token','');
      history.push('/login');
    }
  }

  const getColor = (valor: number) => {
    if (valor < 30) {
      return "rojo"; // rojo
    } else if (valor >= 30 && valor < 50) {
      return "amarillo"; // amarillo
    } else {
      return "verde"; // verde
    }
    
  };

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

              <>
                <IonCard>
                    <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>% ACIERTO MEDIO</IonCardTitle>
                  <div style={{ display: "flex", margin: "5px", marginTop: "auto"}}>
                    <div style={{ width: "33%", marginRight:"2%", textAlign:"center"}}>
                      <p style={{fontWeight: "bold"}}>Total</p>
                      <IonProgressBar value={parseInt(aciertoTotalMedio) / 100} className={getColor(parseInt(aciertoTotalMedio))}/>
                      <p style={{fontSize: "12px"}}>{aciertoTotalMedio}%</p>
                      <p style={{fontSize: "11px"}}>{tirosAnotadosTotales} / {tirosRealizadosTotales}</p>
                    </div>
                    <div style={{ width: "33%", marginRight:"2%", textAlign:"center" }}>
                      <p style={{fontWeight: "bold"}}>2 puntos</p>
                      <IonProgressBar value={parseInt(aciertoTotalMedio2puntos) !== 0 ? parseInt(aciertoTotalMedio2puntos) / 100 : 0} className={getColor(parseInt (aciertoTotalMedio2puntos))} />
                      <p style={{fontSize: "12px"}}>{aciertoTotalMedio2puntos}%</p>
                      <p style={{fontSize: "11px"}}>{tirosAnotadosTotales2puntos} / {tirosRealizadosTotales2puntos}</p>
                    </div>
                    <div style={{ width: "33%", marginRight:"2%", textAlign:"center" }}>
                      <p style={{fontWeight: "bold"}}>3 puntos</p>
                      <IonProgressBar value={parseInt(aciertoTotalMedio3puntos) !== 0 ? parseInt(aciertoTotalMedio3puntos) / 100 : 0} className={getColor(parseInt(aciertoTotalMedio3puntos))} />
                      <p style={{fontSize: "12px"}}>{aciertoTotalMedio3puntos}%</p>
                      <p style={{fontSize: "11px"}}>{tirosAnotadosTotales3puntos} / {tirosRealizadosTotales3puntos}</p>
                    </div>
                  </div>
                </IonCard>


                <IonAccordionGroup ref={accordionGroup} multiple={true}>
                  <IonAccordion value="first">
                    <IonItem slot="header" color="light">
                      <IonLabel>Acierto total</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content" style={{backgroundColor: "#ffc753"}}>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Acierto medio por sesión (%)</IonCardTitle>
                        <IonCardContent>
                          <svg ref={svgRef1}></svg>
                        </IonCardContent>
                      </IonCard>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Acierto medio acumulado (%)</IonCardTitle>
                        <IonCardContent>
                        <svg ref={svgRef4}></svg>
                        </IonCardContent>
                      </IonCard>
                    </div>
                  </IonAccordion>
                  <IonAccordion value="second">
                    <IonItem slot="header" color="light">
                      <IonLabel>Acierto 2 puntos</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content" style={{backgroundColor: "#ffc753"}}>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Acierto 2 puntos por sesión (%)</IonCardTitle>
                        <IonCardContent>
                          <svg ref={svgRef2}></svg>
                        </IonCardContent>
                      </IonCard>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Acierto 2 puntos acumulado (%)</IonCardTitle>
                        <IonCardContent>
                        <svg ref={svgRef5}></svg>
                        </IonCardContent>
                      </IonCard>
                    </div>
                  </IonAccordion>
                  <IonAccordion value="third">
                    <IonItem slot="header" color="light">
                      <IonLabel>Acierto 3 puntos</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content" style={{backgroundColor: "#ffc753"}}>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Acierto 3 puntos por sesión (%)</IonCardTitle>
                        <IonCardContent>
                          <svg ref={svgRef3}></svg>
                        </IonCardContent>
                      </IonCard>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Acierto 3 puntos acumulado (%)</IonCardTitle>
                        <IonCardContent>
                        <svg ref={svgRef6}></svg>
                        </IonCardContent>
                      </IonCard>

                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
                
                
              </>
            )}
            
          </>
      </IonContent>
    </IonPage>
  );
};

export default Estadisticas;