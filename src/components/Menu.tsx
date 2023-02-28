import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { homeSharp, archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, statsChartSharp, basketballSharp, personCircleSharp, personSharp } from 'ionicons/icons';
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
    title: 'Gráficos',
    url: '/page/Graficos',
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
    url: '/page/Perfil',
    iosIcon: personSharp,
    mdIcon: archiveSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          
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
