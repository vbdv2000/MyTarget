import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonText, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonViewDidEnter, IonButton, IonCol, IonIcon, IonRow, IonProgressBar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonImg } from "@ionic/react";
import axios from "axios";
import cancha from '../images/cancha.jpeg';
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { direccionIP } from '../config';
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { chevronDownCircleOutline} from "ionicons/icons";
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
  }
    
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [error, setError] = useState('');

  // Estadisticas generales de todas las sesiones
  const [aciertoTotalMedio, setAciertoTotalMedio] = useState('');
  const [aciertoTotalMedio2puntos, setAciertoTotalMedio2puntos] = useState('');
  const [aciertoTotalMedio3puntos, setAciertoTotalMedio3puntos] = useState('');
  const [obtenidas, setObtenidas] = useState(false);

  // Tiros totales de todas las sesiones para mostrar debajo
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

  // Tiros por zonas
  var [tr1, settr1] = useState(0);
  var [ta1, setta1] = useState(0);
  var [aciertoZona1, setAciertoZona1] = useState('');
  var [tr2, settr2] = useState(0);
  var [ta2, setta2] = useState(0);
  var [aciertoZona2, setAciertoZona2] = useState('');
  var [tr3, settr3] = useState(0);
  var [ta3, setta3] = useState(0);
  var [aciertoZona3, setAciertoZona3] = useState('');
  var [tr4, settr4] = useState(0);
  var [ta4, setta4] = useState(0);
  var [aciertoZona4, setAciertoZona4] = useState('');
  var [tr5, settr5] = useState(0);
  var [ta5, setta5] = useState(0);
  var [aciertoZona5, setAciertoZona5] = useState('');
  var [tr6, settr6] = useState(0);
  var [ta6, setta6] = useState(0);
  var [aciertoZona6, setAciertoZona6] = useState('');
  var [tr7, settr7] = useState(0);
  var [ta7, setta7] = useState(0);
  var [aciertoZona7, setAciertoZona7] = useState('');
  var [tr8, settr8] = useState(0);
  var [ta8, setta8] = useState(0);
  var [aciertoZona8, setAciertoZona8] = useState('');
  var [tr9, settr9] = useState(0);
  var [ta9, setta9] = useState(0);
  var [aciertoZona9, setAciertoZona9] = useState('');
  var [tr10, settr10] = useState(0);
  var [ta10, setta10] = useState(0);
  var [aciertoZona10, setAciertoZona10] = useState('');

  // Booleanos para mostrar % y anotados/realizados al pulsar en una zona
  const [mostrarTiros1, setMostrarTiros1] = useState(false);
  const [mostrarTiros2, setMostrarTiros2] = useState(false);
  const [mostrarTiros3, setMostrarTiros3] = useState(false);
  const [mostrarTiros4, setMostrarTiros4] = useState(false);
  const [mostrarTiros5, setMostrarTiros5] = useState(false);
  const [mostrarTiros6, setMostrarTiros6] = useState(false);
  const [mostrarTiros7, setMostrarTiros7] = useState(false);
  const [mostrarTiros8, setMostrarTiros8] = useState(false);
  const [mostrarTiros9, setMostrarTiros9] = useState(false);
  const [mostrarTiros10, setMostrarTiros10] = useState(false);

  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
 
  async function calcularEstadisticas(){
    const token = cookies.token;
  
    if(!token ){
      // Si no hay token, redirigimos a la página de login
      window.location.href = '/login';        
      return;
    }
    try {
    console.log(token);
    const response = await axios.get(`${direccionIP}/sesiones`,{
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
        var realizados_zonas: number[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var anotados_zonas: number[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //Formateamos las sesiones para que guarde en sesiones la fecha con el formato yyyy-mm-dd
        const sesionesFormateadas = await Promise.all(response.data.sesiones.map(async (sesion: Sesion) => {
          const fechaFormateada = new Date(sesion.fecha).toISOString().slice(0, 10);
          const horaFormateada = new Date(sesion.hora).toISOString().slice(11, 16);
  
          const response2 = await axios.get(`${direccionIP}/sesion`, {
            params: {
              fecha: fechaFormateada,
              hora: horaFormateada
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
              fecha: fechaFormateada,
              hora: horaFormateada
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

            if (zona.posicion == 1){
              realizados_zonas[0] += parseInt(zona.tiros_realizados);
              anotados_zonas[0] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 2){
              realizados_zonas[1] += parseInt(zona.tiros_realizados);
              anotados_zonas[1] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 3){
              realizados_zonas[2] += parseInt(zona.tiros_realizados);
              anotados_zonas[2] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 4){
              realizados_zonas[3] += parseInt(zona.tiros_realizados);
              anotados_zonas[3] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 5){
              realizados_zonas[4] += parseInt(zona.tiros_realizados);
              anotados_zonas[4] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 6){
              realizados_zonas[5] += parseInt(zona.tiros_realizados);
              anotados_zonas[5] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 7){
              realizados_zonas[6] += parseInt(zona.tiros_realizados);
              anotados_zonas[6] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 8){
              realizados_zonas[7] += parseInt(zona.tiros_realizados);
              anotados_zonas[7] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 9){
              realizados_zonas[8] += parseInt(zona.tiros_realizados);
              anotados_zonas[8] += parseInt(zona.tiros_anotados);
            } else if (zona.posicion === 10){
              realizados_zonas[9] += parseInt(zona.tiros_realizados);
              anotados_zonas[9] += parseInt(zona.tiros_anotados);
            }            
          }));

          
          tiros_realizados_total_sesiones += tr;
          tiros_anotados_total_sesiones += ta;
          
          tiros_realizados_2puntos_sesiones += tr_2puntos;
          tiros_anotados_2puntos_sesiones += ta_2puntos;
          tiros_realizados_3puntos_sesiones += tr_3puntos;
          tiros_anotados_3puntos_sesiones += ta_3puntos;
          
          const sesionModificada: Sesion = {
            ...sesion,
            fecha: fechaFormateada,
            hora: horaFormateada,
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
        // Estadísticas por zonas acumuladas para el mapa
        settr1(realizados_zonas[0]);   
        setta1(anotados_zonas[0]);
        setAciertoZona1((realizados_zonas[0] == 0) ? '0' : (anotados_zonas[0] * 100 / realizados_zonas[0]).toFixed(2));

        settr2(realizados_zonas[1]); 
        setta2(anotados_zonas[1]);
        setAciertoZona2((realizados_zonas[1] == 0) ? '0' : (anotados_zonas[1] * 100 / realizados_zonas[1]).toFixed(2));

        settr3(realizados_zonas[2]); 
        setta3(anotados_zonas[2]);
        setAciertoZona3((realizados_zonas[2] == 0) ? '0' : (anotados_zonas[2] * 100 / realizados_zonas[2]).toFixed(2));

        settr4(realizados_zonas[3]); 
        setta4(anotados_zonas[3]);
        setAciertoZona4((realizados_zonas[3] == 0) ? '0' : (anotados_zonas[3] * 100 / realizados_zonas[3]).toFixed(2));

        settr5(realizados_zonas[4]); 
        setta5(anotados_zonas[4]);
        setAciertoZona5((realizados_zonas[4] == 0) ? '0' : (anotados_zonas[4] * 100 / realizados_zonas[4]).toFixed(2));

        settr6(realizados_zonas[5]); 
        setta6(anotados_zonas[5]);
        setAciertoZona6((realizados_zonas[5] == 0) ? '0' : (anotados_zonas[5] * 100 / realizados_zonas[5]).toFixed(2));

        settr7(realizados_zonas[6]); 
        setta7(anotados_zonas[6]);
        setAciertoZona7((realizados_zonas[6] == 0) ? '0' : (anotados_zonas[6] * 100 / realizados_zonas[6]).toFixed(2));

        settr8(realizados_zonas[7]); 
        setta8(anotados_zonas[7]);
        setAciertoZona8((realizados_zonas[7] == 0) ? '0' : (anotados_zonas[7] * 100 / realizados_zonas[7]).toFixed(2));

        settr9(realizados_zonas[8]); 
        setta9(anotados_zonas[8]);
        setAciertoZona9((realizados_zonas[8] == 0) ? '0' : (anotados_zonas[8] * 100 / realizados_zonas[8]).toFixed(2));

        settr10(realizados_zonas[9]); 
        setta10(anotados_zonas[9]);
        setAciertoZona10((realizados_zonas[9] == 0) ? '0' : (anotados_zonas[9] * 100 / realizados_zonas[9]).toFixed(2));  
        console.log(anotados_zonas[0] * 100 / realizados_zonas[0] );
        console.log(((realizados_zonas[0] == 0) ? 'Holaaa' : (anotados_zonas[0] * 100 / realizados_zonas[0]).toString()));
        
        // Estadísticas para datos por sesiones
        console.log(sesionesFormateadas); 
        setSesiones(sesionesFormateadas); 
        const aciertoMedio =(tiros_anotados_total_sesiones/tiros_realizados_total_sesiones*100).toFixed(2);
        const aciertoMedio2puntos =(tiros_anotados_2puntos_sesiones/tiros_realizados_2puntos_sesiones*100).toFixed(2);
        const aciertoMedio3puntos =(tiros_anotados_3puntos_sesiones/tiros_realizados_3puntos_sesiones*100).toFixed(2);
        console.log(aciertoMedio);
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


  const crearGraficos = (datos: { fecha: Date; acierto: string; }[], svgRef: MutableRefObject<null>) => {    
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


    const fechas = [];
    for (let obj of datos) {
      fechas.push(obj.fecha);
    }

    var domain : any = d3.extent(fechas);
    // Escalas para los ejes x e y
    const xScale = d3.scaleTime()
    .domain(domain)
    .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0,100])
      .range([height, 0]);

    // Ejes x e y
    const xAxis = d3.axisBottom(xScale);
     // Cambia el tamaño del eje X
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
    const line : any = d3.line()
      .x(function(d: any){ return xScale(d.fecha); })
      .y(function(d: any){ return yScale(d.acierto);});

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
      .attr('cy', d => yScale(parseInt(d.acierto)))
      .attr('r', 5)
      .attr('fill', 'orange');

    // Valor en cada punto
    svg.selectAll('.valor')
      .data(datos)
      .enter()
      .append('text')
      .attr('class', 'valor')
      .attr('x', d => xScale(d.fecha))
      .attr('y', d => yScale(parseInt(d.acierto)) - 10)
      .text(d => d.acierto);

    // Fecha en cada punto
    svg.selectAll('.fecha')
    .data(datos)
    .enter()
    .append('text')
    .attr('class', 'fecha')
    .attr('x', d => xScale(d.fecha))
    .attr('y', d => yScale(parseInt(d.acierto)) + 15)
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

  const getColorCodigo = (valor: number) => {
    if (valor < 15) {
      return "#f92d2d"; // rojo
    } else if (valor >= 15 && valor < 30) {
      return "#ffadad"; // rojo claro
    } else if (valor >= 30 && valor < 55) {
      return "#f6ff8e"; // amarillo
    } else if (valor >= 50 && valor < 65) {
      return "#98ff8e"; // verde claro
    } else {
      return "#30ff1c"; // verde
    }
    
  };


  const mostrar1 = () => {
    setMostrarTiros1(true);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar2 = () => {
    setMostrarTiros2(true);
    setMostrarTiros1(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar3 = () => {
    setMostrarTiros3(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar4 = () => {
    setMostrarTiros4(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar5 = () => {
    setMostrarTiros5(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar6 = () => {
    setMostrarTiros6(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar7 = () => {
    setMostrarTiros7(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar8 = () => {
    setMostrarTiros8(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros9(false);
    setMostrarTiros10(false);
  }
  const mostrar9 = () => {
    setMostrarTiros9(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros10(false);
  }
  const mostrar10 = () => {
    setMostrarTiros10(true);
    setMostrarTiros1(false);
    setMostrarTiros2(false);
    setMostrarTiros3(false);
    setMostrarTiros4(false);
    setMostrarTiros5(false);
    setMostrarTiros6(false);
    setMostrarTiros7(false);
    setMostrarTiros8(false);
    setMostrarTiros9(false);
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
                  <IonAccordion value="fourth">
                    <IonItem slot="header" color="light">
                      <IonLabel>Mapa de zonas calientes/frías</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content" style={{backgroundColor: "#ffc753"}}>
                      <IonCard>
                        <IonCardTitle style={{ textAlign: "center", fontSize: "18px", marginTop: "10px"}}>Mapa por zonas</IonCardTitle>
                        <IonCardContent>
                          {mostrarTiros1 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona1}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta1} / {tr1}</span></>}
                          {mostrarTiros2 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona2}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta2} / {tr2}</span></>}
                          {mostrarTiros3 && <><span style={{ fontSize: "14px", fontWeight: "bold" }}>{aciertoZona3}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta3} / {tr3}</span></>}
                          {mostrarTiros4 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona4}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta4} / {tr4}</span></>}
                          {mostrarTiros5 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona5}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta5} / {tr5}</span></>}
                          {mostrarTiros6 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona6}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta6} / {tr6}</span></>}
                          {mostrarTiros7 && <><span style={{ fontSize: "14px", fontWeight: "bold" }}>{aciertoZona7}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta7} / {tr7}</span></>}
                          {mostrarTiros8 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona8}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta8} / {tr8}</span></>}
                          {mostrarTiros9 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona9}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta9} / {tr9}</span></>}
                          {mostrarTiros10 && <><span style={{ fontSize: "14px", fontWeight: "bold"}}>{aciertoZona10}% </span><br /><span style={{ fontSize: "12px", margin: "0" }}>{ta10} / {tr10}</span></>}

                          
                          <div style={{position: 'relative'}}>
                            <IonImg className='cancha' src={cancha} alt="cancha" />
                            
                            <div style={{ textAlign:"center", position: "absolute", left: "3%", top: "0%", transform: "translate(-50%, 15%)"}}>
                              <IonButton onClick={mostrar1} style={{ height: "70px", width: "50px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona1)) }} size="small" fill="outline" shape="round">
                                <span style={{ fontSize: "13px", fontWeight: "bold", margin: "0" }}>{aciertoZona1} %</span>
                              </IonButton>
                            </div>
                            
                            <div style={{ textAlign:"center",position: "absolute", left: "15%", top: "78%", transform: "translate(-50%, -50%)" }}>
                              <IonButton onClick={mostrar2} style={{height:"40px", width: "70px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona2))}} fill="outline" shape="round" >
                                <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona2} %</span> 
                              </IonButton>
                            </div>
                            
                            <div style={{ textAlign:"center", position: "absolute", left: "48%", top: "93%", transform: "translate(-50%, -50%)"}}>
                              <IonButton onClick={mostrar3} style={{width: "90px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona3))}} fill="outline" size='default' shape="round">
                                <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona3} %</span> 
                              </IonButton>
                            </div>

                            <div style={{ position: "absolute", left: "82%", top: "78%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                                <IonButton  onClick={mostrar4} style={{height:"40px", width: "70px",color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona4))}} fill="outline" shape="round" >
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona4} %</span> 
                                </IonButton>
                            </div>

                            <div style={{ position: "absolute", left: "87%", top: "0%", transform: "translate(-50%, 15%)", textAlign: "center" }}>
                                <IonButton onClick={mostrar5} style={{height:"70px", width: "50px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona5))}} shape="round" size='default' fill="outline">
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0"}}>{aciertoZona5} %</span> 
                                </IonButton>
                            </div>



                            <div style={{ textAlign:"center",position: "absolute", left: "27%", top: "0%", transform: "translate(-50%, 15%)"}}>
                                <IonButton onClick={mostrar6} style={{height:"60px", width: "50px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona6))}} size='small' fill="outline" shape="round">
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona6} %</span> 
                                </IonButton>
                            </div>
                            
                            <div style={{ position: "absolute", left: "27%", top: "55%", transform: "translate(-50%, -50%)" }}>
                                <IonButton onClick={mostrar7} style={{height:"40px", width: "50px", color: "black", display: "flex", alignItems: "center", backgroundColor: getColorCodigo(parseInt(aciertoZona7)) }} size='small' fill="outline" shape="round">
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona7} %</span> 
                                </IonButton>
                            </div>
                            
                            <div style={{ position: "absolute", left: "46%", top: "70%", transform: "translate(-50%, -50%)", textAlign: "center"}}>
                                <IonButton onClick={mostrar8} style={{height:"35px", width: "70px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona8))}} size='small' fill="outline" shape="round">
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona8} %</span> 
                                </IonButton>
                            </div>

                            <div style={{ position: "absolute", left: "67%", top: "55%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                                <IonButton onClick={mostrar9} style={{height:"40px", width: "50px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona9))}} size='small' fill="outline" shape="round" >
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona9} %</span> 
                                </IonButton>
                            </div>

                            <div style={{ position: "absolute", left: "67%", top: "0%", transform: "translate(-50%, 15%)", textAlign: "center" }}>
                                <IonButton onClick={mostrar10} style={{height:"60px", width: "50px", color: "black", backgroundColor: getColorCodigo(parseInt(aciertoZona10))}} size='small' fill="outline" shape="round" >
                                  <span style={{ fontSize: "12px", fontWeight: "bold", margin: "0" }}>{aciertoZona10} %</span> 
                                </IonButton>
                            </div>
                          </div>
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