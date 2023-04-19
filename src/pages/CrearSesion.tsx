import './Principal.css';
import cancha from '../../public/assets/cancha.jpeg';
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonImg, IonInput, IonItem, IonLabel, IonCard, useIonToast } from '@ionic/react';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
const CrearSesion: React.FC = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [present] = useIonToast();
    const history = useHistory();


    const [form1Visible, setForm1Visible] = useState(false);
    const [form2Visible, setForm2Visible] = useState(false);
    const [form3Visible, setForm3Visible] = useState(false);
    const [form4Visible, setForm4Visible] = useState(false);
    const [form5Visible, setForm5Visible] = useState(false);

    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
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

   
    const zona1 = () => {
        setForm1Visible(true);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        console.log('Se hizo clic en el área de la zona1');
    }

    const zona2 = () => {
        setForm2Visible(true);
        setForm1Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        console.log('Se hizo clic en el área de la zona2');
    }

    const zona3 = () => {
        setForm3Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm4Visible(false);
        setForm5Visible(false);
        console.log('Se hizo clic en el área de la zona3');
    }
    const zona4 = () => {
        setForm4Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm5Visible(false);
        console.log('Se hizo clic en el área de la zona3');
    }
    const zona5 = () => {
        setForm5Visible(true);
        setForm1Visible(false);
        setForm2Visible(false);
        setForm3Visible(false);
        setForm4Visible(false);
        console.log('Se hizo clic en el área de la zona3');
    }


    const enviarMensaje = () => {
        console.log('Se hizo clic en el área del triple central');
    }

    const presentToast = () => {
        present({
          message: "Se ha creado la sesión correctamente",
          duration: 1500,
          position: "top",
          cssClass: "custom-toast",
        });
      };  

    const crearSesion = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = cookies.token;
        if(!token ){
        // Si no hay token, redirigimos a la página de login
        history.push('/login');
        return;
        }
        try {
            const response = await axios.post('http://localhost:5000/sesion', 
            { nombre, fecha, hora, tr1, ta1, tr2, ta2, tr3, ta3, tr4, ta4, tr5, ta5},
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }});
            console.log(response);
            presentToast();
            setTimeout(()=>{}, 2000);
            window.location.href = '/sesiones';
            
            
        } catch (err) {
            console.log("Error creando la sesion");
            setCookie('token','');
            history.push('/login');
        }
        console.log('Se crea la sesion');
    }   

    useEffect(() => {
    const token = cookies.token;
     
      if(!token ){
        // Si no hay token, redirigimos a la página de login
        window.location.href = '/login';
        return;
      }
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
                    <IonTitle>Crear sesión</IonTitle>
                </IonToolbar>
                </IonHeader>
                <h3 id="encabezado">
                Crear una sesión de tiro
                </h3>
                <form onSubmit={crearSesion}>
                <IonCard>

                    <IonItem>
                        <IonLabel position="floating">Nombre</IonLabel>
                        <IonInput type="text" value={nombre} onIonChange={e => setNombre(e.detail.value!)} required></IonInput>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Fecha</IonLabel>
                        <IonInput placeholder='Fecha' type="date" value={fecha} onIonChange={e => setFecha(e.detail.value!)} required></IonInput>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Hora</IonLabel>
                        <IonInput placeholder='Hora' type="time" value={hora} onIonChange={e => setHora(e.detail.value!)} required></IonInput>
                    </IonItem>
                </IonCard>
                <IonImg className='cancha' src={cancha} alt="cancha" />
                
                <div style={{ position: "absolute", left: "8%", top: "45%", transform: "translate(-50%, 45%)"}}>
                    <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona1}>1</IonButton>
                </div>
                
                <div style={{ position: "absolute", left: "13%", top: "61%", transform: "translate(-50%, -50%)" }}>
                    <IonButton fill="outline" shape="round" color={"danger"} onClick={zona2}>2</IonButton>
                </div>
                
                <div style={{ position: "absolute", left: "47%", top: "68%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <IonButton fill="outline" shape="round" color={"danger"} onClick={zona3}>3</IonButton>
                </div>

                <div style={{ position: "absolute", left: "83%", top: "61%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <IonButton fill="outline" shape="round" color={"danger"} onClick={zona4}>4</IonButton>
                </div>

                <div style={{ position: "absolute", left: "89%", top: "45%", transform: "translate(-50%, 50%)", textAlign: "center" }}>
                    <IonButton size='small' fill="outline" shape="round" color={"danger"} onClick={zona5}>5</IonButton>
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
                <IonButton shape="round" color={'success'} className='boton_crearSesion' type='submit' expand='full'>Crear sesión</IonButton>
                </form>
                
            </IonContent>
        </IonPage>
        </>
    );
};

export default CrearSesion;

