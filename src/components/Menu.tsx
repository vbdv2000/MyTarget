import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRow,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { homeSharp, archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, statsChartSharp, basketballSharp, personCircleSharp, personSharp, basketball } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Inicio',
    url: '/page/Inicio',
    iosIcon: homeSharp,
    mdIcon: mailSharp
  },
  {
    title: 'Estadísticas',
    url: '/page/Stats',
    iosIcon: statsChartSharp,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'Sesiones de tiro',
    url: '/page/Sesiones',
    iosIcon: basketballSharp,
    mdIcon: heartSharp
  },
  {
    title: 'Perfil',
    url: '/perfil',
    iosIcon: personSharp,
    mdIcon: archiveSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent> 
        <IonRow>
          <IonCol style={{ textAlign:"center" }}>
            <IonIcon ios={basketball} md={basketball}
                style={{ fontSize: "70px", }}
            />
            <p>
            <IonLabel id='title'>
                MyBasket Target
            </IonLabel>
            </p>
          </IonCol>
        </IonRow>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Víctor Berenguer Del Valle</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Alero 
            <br></br>
            C.B. Jorge Juan
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

        
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
