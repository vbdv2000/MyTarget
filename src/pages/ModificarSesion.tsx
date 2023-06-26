import './Principal.css';
import cancha from '../images/cancha.jpeg';
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonImg, IonInput, IonItem, IonLabel, IonCard, useIonToast } from '@ionic/react';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { direccionIP } from '../config';
const ModificarSesion: React.FC = () => {

    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [present] = useIonToast();
    const history = useHistory();


    const [form1Visible, setForm1Visible] = useState(false);
    const [form2Visible, setForm2Visible] = useState(false);
    const [form3Visible, setForm3Visible] = useState(false);
    const [form4Visible, setForm4Visible] = useState(false);
    const [form5Visible, setForm5Visible] = useState(false);
    const [form6Visible, setForm6Visible] = useState(false);
    const [form7Visible, setForm7Visible] = useState(false);
    const [form8Visible, setForm8Visible] = useState(false);
    const [form9Visible, setForm9Visible] = useState(false);
    const [form10Visible, setForm10Visible] = useState(false);
    
    
    const [nombre, setNombre] = useState('');
    
    const [tr1, settr1] = useState('');
    const [ta1, setta1] = useState('');
    const [tr2, settr2] = useState('');
    const [ta2, setta2] = useState('');
    const [tr3, settr3] = useState('');
    const [ta3, setta3] = useState('');
    const [tr4, settr4] = useState('');
    const [ta4, setta4] = useState('');
    const [tr5, settr5] = useState('');
    const [ta5, setta5] = useState('');
    const [tr6, settr6] = useState('');
    const [ta6, setta6] = useState('');
    const [tr7, settr7] = useState('');
    const [ta7, setta7] = useState('');
    const [tr8, settr8] = useState('');
    const [ta8, setta8] = useState('');
    const [tr9, settr9] = useState('');
    const [ta9, setta9] = useState('');
    const [tr10, settr10] = useState('');
    const [ta10, setta10] = useState('');

   
    const zona1 = () => {
        setForm1Visible(true);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 1');
    }

    const zona2 = () => {
        setForm2Visible(true);
        setForm1Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 2');
    }

    const zona3 = () => {
        setForm3Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 3');
    }
    const zona4 = () => {
        setForm4Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 4');
    }
    const zona5 = () => {
        setForm5Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 5');
    }
    const zona6 = () => {
        setForm6Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 6');
    }
    const zona7 = () => {
        setForm7Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 7');
    }
    const zona8 = () => {
        setForm8Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm9Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 8');
    }
    const zona9 = () => {
        setForm9Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm10Visible(false);
        console.log('Se hizo clic en el área de la zona 9');
    }
    const zona10 = () => {
        setForm10Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        setForm6Visible(false);
        setForm7Visible(false);
        setForm8Visible(false);
        setForm9Visible(false);
        console.log('Se hizo clic en el área de la zona 10');
    }



    const presentToast = () => {
        present({
          message: "Se ha modificado la sesión correctamente",
          duration: 1500,
          position: "top",
          cssClass: "custom-toast",
        });
      };  

    const saveSesion = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = cookies.token;
        if(!token ){
            // Si no hay token, redirigimos a la página de login
            history.push('/login');
            return;
        }
        try {
            const response = await axios.put(`http://${direccionIP}:5000/sesion`, 
            { 
                nombre, fecha, hora, tr1, ta1, tr2, ta2, tr3, ta3, tr4, ta4, tr5, ta5, tr6, ta6, tr7, ta7, tr8, ta8, tr9, ta9, tr10, ta10},
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }});
            console.log(response);
            presentToast();
            setTimeout(()=>{}, 2000);
            window.location.href = '/sesiones';
            
            
        } catch (err) {
            console.log("Error modificando la sesion");
            setCookie('token','');
            history.push('/login');
        }
        console.log('Se modifica la sesion');
    }   

    useEffect(() => {
        async function llamadaAPI (){
            const token = cookies.token;
           
            if(!token ){
              // Si no hay token, redirigimos a la página de login
              history.push('/login');
              return;
            }
            const params = new URLSearchParams(window.location.search);
            const nuevaFecha = params.get("fecha") ?? ''; //Se hace esto para que compile, si el valor de las params es nulo, el valor es ''
            const nuevaHora = params.get("hora") ?? '';
            console.log(params);
            setFecha(nuevaFecha);
            setHora(nuevaHora);
            try {
                console.log(nuevaFecha);
                console.log(nuevaHora);
                const response = await axios.get(`http://${direccionIP}:5000/sesion`, 
                {
                    params: {
                        fecha: nuevaFecha,
                        hora: nuevaHora
                    },
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response.data)
                const sesion = response.data;
                
                setNombre(sesion.sesion.nombre);
                console.log(fecha);
                settr1(sesion.zonas[0].tiros_realizados);
                setta1(sesion.zonas[0].tiros_anotados);
                settr2(sesion.zonas[1].tiros_realizados);
                setta2(sesion.zonas[1].tiros_anotados);
                settr3(sesion.zonas[2].tiros_realizados);
                setta3(sesion.zonas[2].tiros_anotados);
                settr4(sesion.zonas[3].tiros_realizados);
                setta4(sesion.zonas[3].tiros_anotados);
                settr5(sesion.zonas[4].tiros_realizados);
                setta5(sesion.zonas[4].tiros_anotados);
                
                settr6(sesion.zonas[5].tiros_realizados);
                setta6(sesion.zonas[5].tiros_anotados);
                settr7(sesion.zonas[6].tiros_realizados);
                setta7(sesion.zonas[6].tiros_anotados);
                settr8(sesion.zonas[7].tiros_realizados);
                setta8(sesion.zonas[7].tiros_anotados);
                settr9(sesion.zonas[8].tiros_realizados);
                setta9(sesion.zonas[8].tiros_anotados);
                settr10(sesion.zonas[9].tiros_realizados);
                setta10(sesion.zonas[9].tiros_anotados);
                
            }  catch (error) {
            setCookie('token','');
            history.push('/login');
            console.log("Algo ha ido mal obteniendo la sesion");
            }
            
        };
      
        llamadaAPI();
    }, []);


    return (
        <>
        <IonPage>
            <IonContent>
                <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Modificar sesión de tiro</IonTitle>
                </IonToolbar>
                </IonHeader>
                
                <form onSubmit={saveSesion}>
                <IonCard>

                    <IonItem>
                        <IonLabel position="floating">Nombre</IonLabel>
                        <IonInput type="text" value={nombre} onIonChange={e => setNombre(e.detail.value!)} required></IonInput>
                    </IonItem>
                    
                    <IonItem>
                        <IonLabel position="floating">Fecha</IonLabel>
                        <IonInput placeholder='Fecha' type="date"  value={fecha} onIonChange={e => setFecha(e.detail.value!)} readonly required></IonInput>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Hora</IonLabel>
                        <IonInput placeholder='Hora' type="time" value={hora} onIonChange={e => setHora(e.detail.value!)} readonly required></IonInput>
                    </IonItem>
                </IonCard>
                <div style={{position: 'relative'}}>
                    <IonImg className='cancha' src={cancha} alt="cancha" />
                    
                    <div style={{ position: "absolute", left: "7%", top: "3%", transform: "translate(-50%, 45%)"}}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona1}>{ta1} / {tr1}</IonButton>
                    </div>
                    
                    <div style={{ position: "absolute", left: "13%", top: "73%", transform: "translate(-50%, -50%)" }}>
                        <IonButton fill="outline" shape="round" color={"danger"} onClick={zona2}>{ta2} / {tr2}</IonButton>
                    </div>
                    
                    <div style={{ position: "absolute", left: "48%", top: "93%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <IonButton fill="outline" shape="round" color={"danger"} onClick={zona3}>{ta3} / {tr3}</IonButton>
                    </div>

                    <div style={{ position: "absolute", left: "82%", top: "73%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <IonButton fill="outline" shape="round" color={"danger"} onClick={zona4}>{ta4} / {tr4}</IonButton>
                    </div>

                    <div style={{ position: "absolute", left: "89%", top: "3%", transform: "translate(-50%, 50%)", textAlign: "center" }}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona5}>{ta5} / {tr5}</IonButton>
                    </div>


                    <div style={{ position: "absolute", left: "30%", top: "3%", transform: "translate(-50%, 45%)"}}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona6}>{ta6} / {tr6}</IonButton>
                    </div>
                    
                    <div style={{ position: "absolute", left: "30%", top: "60%", transform: "translate(-50%, -50%)" }}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona7}>{ta7} / {tr7}</IonButton>
                    </div>
                    
                    <div style={{ position: "absolute", left: "48%", top: "70%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona8}>{ta8} / {tr8}</IonButton>
                    </div>

                    <div style={{ position: "absolute", left: "68%", top: "60%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona9}>{ta9} / {tr9}</IonButton>
                    </div>

                    <div style={{ position: "absolute", left: "68%", top: "3%", transform: "translate(-50%, 50%)", textAlign: "center" }}>
                        <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona10}>{ta10} / {tr10}</IonButton>
                    </div>
                </div>
                {form1Visible && (
                    <div>
                        
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr1} onIonChange={e => settr1(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta1} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr1)){
                                    setta1(tr1.toString());
                                } else {
                                    setta1(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form2Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr2} onIonChange={e => settr2(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta2} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr2)){
                                    setta2(tr2.toString());
                                } else {
                                    setta2(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form3Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr3} onIonChange={e => settr3(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta3} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr3)){
                                    setta3(tr3.toString());
                                } else {
                                    setta3(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form4Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr4} onIonChange={e => settr4(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta4} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr4)){
                                    setta4(tr4.toString());
                                } else {
                                    setta4(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form5Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr5} onIonChange={e => settr5(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta5} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr5)){
                                    setta5(tr5.toString());
                                } else {
                                    setta5(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}

                {form6Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr6} onIonChange={e => settr6(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta6} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr6)){
                                    setta6(tr6.toString());
                                } else {
                                    setta6(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form7Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr7} onIonChange={e => settr7(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta7} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr7)){
                                    setta7(tr7.toString());
                                } else {
                                    setta7(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form8Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr8} onIonChange={e => settr8(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta8} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr8)){
                                    setta8(tr8.toString());
                                } else {
                                    setta8(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form9Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr9} onIonChange={e => settr9(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta9} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr9)){
                                    setta9(tr9.toString());
                                } else {
                                    setta9(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                {form10Visible && (
                    <div>
                        <IonItem>
                            <IonLabel position="floating">Tiros realizados</IonLabel>
                            <IonInput type="number" value={tr10} onIonChange={e => settr10(e.detail.value!)} required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Tiros anotados</IonLabel>
                            <IonInput type="number" value={ta10} onIonChange={e => {
                                const nuevoValor = parseInt(e.detail.value!);
                                if(nuevoValor > parseInt(tr10)){
                                    setta10(tr10.toString());
                                } else {
                                    setta10(nuevoValor.toString());
                                }
                            }} required></IonInput>
                        </IonItem>
                    </div>
                )}
                <IonButton shape="round" color={'success'} className='boton_crearSesion' type='submit' expand='full'>Guardar sesión</IonButton>
                </form>
                
            </IonContent>
        </IonPage>
        </>
    );
};

export default ModificarSesion;

