import './Hero.css'

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__overlay"></div>
      <div className="hero__content">
        <p className="hero__tagline">Welcome to Brew & Bean</p>
        <h1 className="hero__title">Crafted with Passion,<br />Served with Love</h1>
        <p className="hero__description">
          Experience the finest hand-roasted coffees sourced from ethical farms around the world.
          Every cup tells a story.
        </p>
        <div className="hero__buttons">
          <a href="#menu" className="btn btn-primary">Explore Menu</a>
          <a href="#contact" className="btn btn-outline">Visit Us</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
