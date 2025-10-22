import { useEffect } from 'react';
import '../styles/nosotros.css';

const Nosotros = () => {
  // efecto para animaciones al cargar la pagina
  useEffect(() => {
    // logica para animaciones de entrada
  }, []);

  return (
    <div className="wrapper">
      <div id="app-header"></div>

      {/* contenido principal de la pagina nosotros */}
      <main className="nosotros-main">
        {/* seccion hero */}
        <section className="hero-nosotros">
          <div className="container">
            <div className="hero-content">
              <h1>Sobre Level-Up Gamer</h1>
              <p>
                Conoce más sobre Level-Up Gamer, la tienda online líder dedicada
                a satisfacer las necesidades de los entusiastas de los
                videojuegos en Chile. Descubre nuestra historia, misión y visión
                que nos impulsa cada día.
              </p>
            </div>
          </div>
        </section>

        {/* seccion historia: informacion corporativa */}
        <section className="historia-empresa">
          <div className="container">
            <h2>Nuestra Historia</h2>
            {/* grid de dos columnas: texto e imagen */}
            <div className="historia-grid">
              <div className="historia-text">
                {/* historia de la empresa */}
                <h3>Nuestra Historia</h3>
                <p>
                  Level-Up Gamer es una tienda online dedicada a satisfacer las
                  necesidades de los entusiastas de los videojuegos en Chile.
                  Lanzada hace dos años como respuesta a la creciente demanda
                  durante la pandemia, Level-Up Gamer ofrece una amplia gama de
                  productos para gamers, desde consolas y accesorios hasta
                  computadores y sillas especializadas. Aunque no cuenta con una
                  ubicación física, realiza despachos a todo el país.
                </p>

                {/* mision corporativa */}
                <h3>Misión</h3>
                <p>
                  Proporcionar productos de alta calidad para gamers en todo
                  Chile, ofreciendo una experiencia de compra única y
                  personalizada, con un enfoque en la satisfacción del cliente y
                  el crecimiento de la comunidad gamer.
                </p>

                {/* vision corporativa */}
                <h3>Visión</h3>
                <p>
                  Ser la tienda online líder en productos para gamers en Chile,
                  reconocida por su innovación, servicio al cliente excepcional,
                  y un programa de fidelización basado en gamificación que
                  recompense a nuestros clientes más fieles.
                </p>
              </div>
              {/* imagen representativa del gaming */}
              <div className="historia-imagen">
                <img src="/img/otros/gaming-setup.jpg" alt="Gaming Setup" />
              </div>
            </div>
          </div>
        </section>

        {/* seccion productos: descripcion de productos y servicios ofrecidos */}
        <section className="proyecto-descripcion">
          <div className="container">
            <h2>Nuestros Productos y Servicios</h2>
            <div className="proyecto-content">
              <p>
                Level-Up Gamer ofrece una amplia gama de productos categorizados
                para satisfacer todas las necesidades de los gamers. Desde
                juegos de mesa hasta equipos de alta gama, tenemos todo lo que
                necesitas para llevar tu experiencia gaming al siguiente nivel.
              </p>

              {/* grid de tarjetas con las categorías principales de productos */}
              <div className="proyecto-features">
                {/* tarjeta de consolas */}
                <div className="feature">
                  <i className="bi bi-controller"></i>
                  <h4>Consolas y Accesorios</h4>
                  <p>
                    PlayStation, Xbox, Nintendo y todos los accesorios gaming
                    que necesitas
                  </p>
                </div>
                {/* tarjeta de computadores */}
                <div className="feature">
                  <i className="bi bi-pc-display"></i>
                  <h4>Computadores Gamers</h4>
                  <p>
                    PCs de alta gama diseñados para los gamers más exigentes
                  </p>
                </div>
                {/* tarjeta de perifericos */}
                <div className="feature">
                  <i className="bi bi-mouse"></i>
                  <h4>Periféricos Gaming</h4>
                  <p>
                    Mouse, mousepad, auriculares y todo el equipamiento
                    profesional
                  </p>
                </div>
                {/* tarjeta del programa de fidelizacion */}
                <div className="feature">
                  <i className="bi bi-trophy"></i>
                  <h4>Programa LevelUp</h4>
                  <p>
                    Sistema de puntos y gamificación que recompensa tu fidelidad
                  </p>
                </div>
                {/* tarjeta de juegos de mesa */}
                <div className="feature">
                  <i className="bi bi-dice-5"></i>
                  <h4>Juegos de Mesa</h4>
                  <p>
                    Catan, Carcassonne y los mejores juegos para compartir en
                    familia
                  </p>
                </div>
                {/* tarjeta de sillas gaming */}
                <div className="feature">
                  <i className="bi bi-person-workspace"></i>
                  <h4>Sillas Gamers</h4>
                  <p>Comodidad ergonómica para sesiones de juego prolongadas</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* seccion equipo: presentacion del equipo de level-up gamer */}
        <section className="equipo-desarrolladores">
          <div className="container">
            <h2>Nuestro Equipo</h2>
            <p className="equipo-intro">
              Conoce al talentoso equipo que hace posible Level-Up Gamer. Cada
              miembro aporta su experiencia y pasión por los videojuegos para
              crear la mejor experiencia de compra gaming en Chile.
            </p>
            {/* grid de tarjetas del equipo */}
            <div className="desarrolladores-grid">
              {/* tarjeta del primer miembro del equipo */}
              <div className="miembro-equipo">
                <div className="dev-photo">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuN2MzIG2ObLSgHzGKPmZPr5Wphxt8f1HF1Q&s"
                    alt="Fundador"
                  />
                </div>
                <div className="dev-info">
                  <h3>Alex Ampuero</h3>
                  <p className="dev-role">Co-fundador & CEO</p>
                  <p className="dev-description">
                    Gamer apasionado y emprendedor visionario. Fundó Level-Up
                    Gamer durante la pandemia para satisfacer las necesidades de
                    la comunidad gaming chilena.
                  </p>
                  <div className="dev-skills">
                    <span className="skill">Full Stack</span>
                  </div>
                </div>
              </div>

              {/* tarjeta del segundo miembro del equipo */}
              <div className="miembro-equipo">
                <div className="dev-photo">
                  <img
                    src="https://media.gettyimages.com/id/171368526/es/foto/pouting-cama-king.jpg?s=612x612&w=gi&k=20&c=I_-q1pnLbgzutu8JKLWHcbsg4Hnf6yG0WVrLewO_4zg="
                    alt="Especialista en Comunidad"
                  />
                </div>
                <div className="dev-info">
                  <h3>Christian Mesa</h3>
                  <p className="dev-role">Co-fundador & CTO</p>
                  <p className="dev-description">
                    Gamer profesional y especialista en comunidades. Gestiona
                    nuestro programa de gamificación y mantiene la conexión con
                    nuestra comunidad.
                  </p>
                  <div className="dev-skills">
                    <span className="skill">full stack senior developer</span>
                  </div>
                </div>
              </div>

              {/* tarjeta del tercer miembro del equipo */}
              <div className="miembro-equipo">
                <div className="dev-photo">
                  <img src="/img/IMG_5590.png" alt="Gerente de Productos" />
                </div>
                <div className="dev-info">
                  <h3>Ariel Molina</h3>
                  <p className="dev-role">Unemployed</p>
                  <p className="dev-description">
                    Jugador profesional de juegos esports
                  </p>
                  <div className="dev-skills">
                    <span className="skill">UI/UX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <div id="app-footer"></div>
    </div>
  );
};

export default Nosotros;
