import './About.css'

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__image">
            <div className="about__image-placeholder">
              <span>&#9749;</span>
              <p>Est. 2018</p>
            </div>
          </div>
          <div className="about__content">
            <h2 className="about__title">Our Story</h2>
            <p className="about__text">
              Brew & Bean started with a simple idea: create a space where great coffee brings people together.
              Founded in 2018, we've grown from a small corner cafe to a beloved community gathering spot.
            </p>
            <p className="about__text">
              We source our beans directly from sustainable farms in Colombia, Ethiopia, and Guatemala.
              Each batch is carefully roasted in-house to bring out the unique flavors and characteristics
              of every origin.
            </p>
            <div className="about__stats">
              <div className="about__stat">
                <span className="about__stat-number">15+</span>
                <span className="about__stat-label">Coffee Varieties</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">5K+</span>
                <span className="about__stat-label">Happy Customers</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">7</span>
                <span className="about__stat-label">Years Brewing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
