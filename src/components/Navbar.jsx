import { useState, useEffect } from 'react'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__container">
        <a href="#" className="navbar__logo">
          <span className="navbar__logo-icon">&#9749;</span>
          Brew & Bean
        </a>
        <button
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#testimonials" onClick={() => setMenuOpen(false)}>Reviews</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
