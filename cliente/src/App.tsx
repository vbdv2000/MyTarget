import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Login from './pages/Login/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Registro from './pages/Login/Registro';
import Recuperar from './pages/Login/Recuperar';
import Perfil from './pages/Perfil';
import CrearSesion from './pages/CrearSesion';
import Sesiones from './pages/Sesiones';
import ModificarSesion from './pages/ModificarSesion';
import Estadisticas from './pages/Estadisticas';

setupIonicReact();


const App: React.FC = () => {


  return (
    <IonApp>
      <IonReactRouter>
        
        
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route exact path="/login" component={Login} />
            <Redirect exact from="/" to="/login" />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/recuperar" component={Recuperar} />
            <Route exact path="/perfil" component={Perfil}  />
            <Route exact path="/crearSesion" component={CrearSesion} />
            <Route exact path="/sesiones" component={Sesiones} />
            <Route exact path="/modificarSesion" component={ModificarSesion} />
            <Route exact path="/estadisticas" component={Estadisticas} />

            <Route path="/" exact={true}>
              <Redirect to="/login" />
            </Route>
          
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};


export default App;
