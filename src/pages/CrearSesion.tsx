import './Principal.css';
import cancha from '../../public/assets/cancha.png';
const CrearSesion: React.FC = () => {

    const handleClick = () => {
        console.log('Se hizo clic en el área sensible');
    }

    return (
        <div>
            <img src={cancha} alt="cancha" useMap="#cancha-map" />
            <map name="cancha-map">
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <button onClick={handleClick}>Presiona aquí</button>
            </div>
                <area shape="circle" coords="0,0,100,100" onClick={handleClick} />
                <area shape="rect" coords="100,100,200,200" onClick={handleClick} />
            </map>
        </div>
    );
};

export default CrearSesion;