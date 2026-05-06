import { useState, useEffect } from 'react'
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './index.css'

/* ─── Icons (Inline SVGs) ─────────────────────────────────── */

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
)

/* ─── Global Scroll to Contact Function ──────────────────────── */
const scrollToContact = () => {
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth' });
    // Focus the first input field slightly after scrolling
    setTimeout(() => {
      const firstInput = document.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }, 500);
  }
}

/* ─── Phone Icon ─────────────────────────────────────────── */

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

/* ─── Header ─────────────────────────────────────────────── */

function Header({ onOpenDossier }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div className="logo">
          Sunrise Golf Residences
        </div>
        <div className="contact-nav">
          <a
            href="tel:+34659414567"
            className="header-phone-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              letterSpacing: '0.5px',
              transition: 'opacity 0.3s ease',
              opacity: 0.9,
              whiteSpace: 'nowrap'
            }}
          >
            <PhoneIcon />
            <span className="header-phone-number">+34 659 41 45 67</span>
          </a>
          <button
            onClick={onOpenDossier}
            className="dossier-btn"
            style={{
              backgroundColor: scrolled ? 'var(--text-main)' : 'rgba(255,255,255,0.15)',
              border: scrolled ? '1px solid var(--text-main)' : '1px solid rgba(255,255,255,0.4)',
              color: scrolled ? '#fff' : '#fff',
              padding: '8px 16px',
              borderRadius: '2px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              marginRight: '0',
              cursor: 'pointer'
            }}
          >
            Access Full Dossier
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─── Hero Section ───────────────────────────────────────── */

const KommoStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    .amoforms-code-container input[type="text"],
    .amoforms-code-container input[type="tel"],
    .amoforms-code-container input[type="email"] {
      background-color: #ffffff !important;
      border: 1px solid rgba(0,0,0,0.1) !important;
      color: #333 !important;
      border-radius: 2px !important;
      padding: 14px 10px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      width: 100% !important;
      margin-bottom: 15px !important;
    }
    .amoforms-code-container input:focus {
      border: 1px solid #C5A880 !important;
      outline: none !important;
    }
    .PhoneInput {
      background-color: #ffffff !important;
      border: 1px solid rgba(0,0,0,0.1) !important;
      border-radius: 2px !important;
      padding: 0 10px !important;
      margin-bottom: 15px !important;
      display: flex;
      align-items: center;
      transition: border 0.3s ease;
    }
    .PhoneInput:focus-within {
      border: 1px solid #C5A880 !important;
    }
    .PhoneInputInput {
      border: none !important;
      background: transparent !important;
      padding: 14px 0 !important;
      margin-bottom: 0 !important;
      color: #333 !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      width: 100% !important;
      outline: none !important;
    }
    .amoforms-label {
      color: #333 !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 11px !important;
      text-transform: uppercase !important;
      margin-bottom: 6px !important;
      display: block !important;
    }
    .amoforms-action-btn {
      background-color: #C5A880 !important;
      border: none !important;
      color: #fff !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      border-radius: 2px !important;
      padding: 18px 30px !important;
      width: 100% !important;
      cursor: pointer !important;
      transition: background-color 0.3s ease !important;
    }
    .amoforms-action-btn:hover {
      background-color: #b39770 !important;
    }
  `}} />
)

function Hero() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [status, setStatus] = useState('idle')
  const [formStep, setFormStep] = useState(1)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill all fields to request information.")
      return
    }

    setStatus('submitting')

    // Fire Meta Pixel Lead event immediately on form submission
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }

    try {
      const response = await fetch('/api/kommo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        })
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const contactFormJSX = (
    <div className="glass-box">
      <KommoStyles />
      <h2 className="glass-box-title">Check Availability</h2>
      <p className="glass-box-desc">Request Information</p>

      <div style={{ position: 'relative', minHeight: '280px' }}>
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: status === 'success' ? 1 : 0,
            visibility: status === 'success' ? 'visible' : 'hidden',
            transition: 'opacity 0.8s ease'
          }}
        >
          <h3 style={{
            color: 'var(--text-main)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            Request sent successfully.<br />We will contact you shortly.
          </h3>
        </div>

        <form
          className="amoforms-code-container"
          style={{
            opacity: status === 'success' ? 0 : 1,
            visibility: status === 'success' ? 'hidden' : 'visible',
            transition: 'opacity 0.5s ease'
          }}
          onSubmit={handleSubmit}
        >
          {formStep === 1 && (
            <div style={{ marginBottom: '15px', animation: 'fadeIn 0.5s ease' }}>
              <label className="amoforms-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={status === 'submitting'}
                placeholder="Enter your email"
                required
              />
              <button
                type="button"
                className="amoforms-action-btn"
                onClick={() => {
                  if (formData.email && formData.email.includes('@')) setFormStep(2)
                  else alert('Please enter a valid email address.')
                }}
                style={{ marginTop: '15px' }}
              >
                Check Availability
              </button>
            </div>
          )}

          {formStep === 2 && (
            <div style={{ marginBottom: '15px', animation: 'fadeIn 0.5s ease' }}>
              <label className="amoforms-label">Phone</label>
              <div style={{ position: 'relative' }}>
                <PhoneInput
                  international
                  defaultCountry="ES"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={status === 'submitting'}
                  required
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#333', marginTop: '4px', fontStyle: 'italic', lineHeight: '1.2' }}>
                * Please provide a valid number with WhatsApp. You will receive an immediate verification message.
              </p>
              <button
                type="button"
                className="amoforms-action-btn"
                onClick={() => {
                  if (formData.phone && formData.phone.length > 8) setFormStep(3)
                  else alert('Please enter a valid phone number.')
                }}
                style={{ marginTop: '15px' }}
              >
                Continue
              </button>
              <button type="button" onClick={() => setFormStep(1)} style={{ background: 'none', border: 'none', color: '#666', marginTop: '10px', width: '100%', cursor: 'pointer', textDecoration: 'underline' }}>Back</button>
            </div>
          )}

          {formStep === 3 && (
            <div style={{ marginBottom: '15px', animation: 'fadeIn 0.5s ease' }}>
              <label className="amoforms-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={status === 'submitting'}
                placeholder="Enter your full name"
                required
              />

              {status === 'error' && (
                <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '15px', marginTop: '10px' }}>
                  There was an error processing your request. Please try again.
                </p>
              )}

              <button type="submit" className="amoforms-action-btn" disabled={status === 'submitting'} style={{ marginTop: '15px' }}>
                {status === 'submitting' ? 'Sending...' : 'Check Availability'}
              </button>
              <button type="button" onClick={() => setFormStep(2)} style={{ background: 'none', border: 'none', color: '#666', marginTop: '10px', width: '100%', cursor: 'pointer', textDecoration: 'underline' }}>Back</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero">
        <img src="/assets/hero-golf.jpg" alt="Sunrise Golf Residences La Cala de Mijas" className="hero-bg" />
        <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 70%, var(--bg-dark) 100%)' }}></div>

        <div className="container hero-content">
          <div className="hero-text-area">
            <div style={{ marginBottom: '1.5rem', animation: 'fadeInUp 1s ease-out' }}>
              <h1 className="hero-h1" style={{ marginBottom: '0.5rem', lineHeight: '1.2' }}>
                Sunrise Golf Residences:<br />
                <span className="text-gold" style={{ fontSize: '1.2em', fontWeight: '700', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Your luxury frontline golf retreat in La Cala de Mijas</span>
              </h1>
            </div>

            <div className="mobile-only" style={{ marginTop: '1rem' }}>
              <button
                onClick={() => document.getElementById('mobile-contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="amoforms-action-btn"
                style={{
                  display: 'inline-block',
                  padding: '16px 30px',
                  backgroundColor: 'var(--accent-gold)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 20px rgba(197, 168, 128, 0.4)',
                  borderRadius: '4px'
                }}>
                Get Prices & Floor Plans
              </button>
            </div>
          </div>

          <div className="desktop-only">
            {contactFormJSX}
          </div>
        </div>
      </section>

      {/* Unified Flow: Gallery immediately after Banner */}
      <Gallery />

      {/* Description and Form Section for Mobile/Desktop Unified read */}
      <section id="mobile-contact-form" style={{ backgroundColor: '#F9F8F6', padding: '5rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <p style={{
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-main)',
            fontSize: '1.2rem',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.7',
            fontWeight: '300'
          }}>
            Discover an exclusive collection of 48 contemporary 2 and 3-bedroom homes. A place where modern architecture meets nature, offering panoramic sea and mountain views in the heart of the Costa del Sol.
          </p>
          <div className="mobile-only" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {contactFormJSX}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── Benefits Section ───────────────────────────────────── */

function Benefits() {
  return (
    <section className="benefits">
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="value-add-subtitle">Wellness & Environment</p>
        <h2 className="value-add-title" style={{ marginBottom: '3rem', textAlign: 'center' }}>A Complex Designed for Your Well-being</h2>

        <div className="benefits-grid" style={{ marginBottom: '3rem' }}>
          <div className="benefit-card">
            <div className="benefit-icon"><LeafIcon /></div>
            <h3 className="benefit-title">Unrivaled Surroundings & Views</h3>
            <p className="benefit-desc">Enjoy a unique frontline golf location with spectacular sea and mountain vistas, surrounded by peace and nature.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon"><ShieldIcon /></div>
            <h3 className="benefit-title">Premium Amenities & Wellness</h3>
            <p className="benefit-desc">Exclusive access to resort-style facilities: infinity pool, state-of-the-art gym, private spa, coworking area, and landscaped gardens.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon"><KeyIcon /></div>
            <h3 className="benefit-title">Sustainable Designer Homes</h3>
            <p className="benefit-desc">Light-filled residences featuring high-end finishes, underfloor heating, advanced home automation, and expansive terraces designed for the Mediterranean lifestyle.</p>
          </div>
        </div>

        <button onClick={scrollToContact} className="amoforms-action-btn" style={{
          display: 'inline-block', width: 'auto', padding: '15px 40px', backgroundColor: 'var(--text-main)'
        }}>
          Check Availability
        </button>
      </div>
    </section>
  )
}

/* ─── Values & Location Section ──────────────────────────── */

function ValueAdd() {
  return (
    <section className="value-add">
      <div className="container value-add-content">
        <div>
          <p className="value-add-subtitle">Interiors & Location</p>
          <h2 className="value-add-title">Exclusivity, design, and wellbeing in a privileged setting</h2>
          <p className="value-add-text">
            Located within the prestigious La Cala Golf, you are just 10 minutes from the Mediterranean’s finest beaches and a short drive from the main leisure hubs of Malaga and Marbella.
          </p>
          <ul className="value-add-list">
            <li className="value-add-item">
              <div className="value-add-item-icon"><CheckCircleIcon /></div>
              <div>
                <h4 className="value-add-item-title">Open-plan design</h4>
                <p className="value-add-item-text">Bright living-dining rooms with modern, fully equipped kitchens.</p>
              </div>
            </li>
            <li className="value-add-item">
              <div className="value-add-item-icon"><CheckCircleIcon /></div>
              <div>
                <h4 className="value-add-item-title">Private exteriors</h4>
                <p className="value-add-item-text">Expansive terraces, many with views of the front-line golf or the sea.</p>
              </div>
            </li>
            <li className="value-add-item">
              <div className="value-add-item-icon"><CheckCircleIcon /></div>
              <div>
                <h4 className="value-add-item-title">Guaranteed comfort</h4>
                <p className="value-add-item-text">Advanced home automation and underfloor heating included.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── Location Section ────────────────────────────────────────── */

function LocationMap() {
  return (
    <section className="location-map" style={{ padding: '4rem 0', backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <h2 className="value-add-title" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: 'clamp(2rem, 4vw, 2.5rem)' }}>Discover Your Surroundings</h2>
        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto', fontSize: '1rem', lineHeight: '1.6' }}>
          Immerse yourself in spectacular vistas and the Mediterranean lifestyle directly on the frontline of La Cala Resort.
        </p>
        <div style={{ width: '100%', height: '450px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
          <iframe 
            src="https://maps.google.com/maps?q=36.534954,-4.715968&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border:0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button onClick={scrollToContact} className="amoforms-action-btn" style={{
            display: 'inline-block', width: 'auto', padding: '15px 40px', backgroundColor: 'var(--accent-gold)'
          }}>
            Check Availability
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── Gallery Section ────────────────────────────────────────── */

function Gallery() {
  return (
    <section className="gallery">
      <div className="container">
        <div className="gallery-header" style={{ marginBottom: '2rem' }}>
          <p className="value-add-subtitle">Gallery</p>
          <h2 className="gallery-title">Discover the Coastal Lifestyle</h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src="/assets/gallery-1.jpg" alt="Sunrise Golf Entrance" />
            <div className="gallery-item-caption">Exclusive Main Entrance</div>
          </div>
          <div className="gallery-item">
            <img src="/assets/gallery-2.jpg" alt="Spectacular Infinity Pool" />
            <div className="gallery-item-caption">Spectacular Infinity Pool</div>
          </div>
          <div className="gallery-item">
            <img src="/assets/gallery-3.jpg" alt="Views from the communal areas" />
            <div className="gallery-item-caption">Panoramic Mediterranean Views</div>
          </div>
          <div className="gallery-item">
            <img src="/assets/gallery-4.jpg" alt="Expansive Private Terraces" />
            <div className="gallery-item-caption">Expansive Private Terraces</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button onClick={scrollToContact} className="amoforms-action-btn" style={{
            display: 'inline-block', width: 'auto', padding: '15px 40px', backgroundColor: 'var(--text-main)'
          }}>
            Check Availability
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="footer" style={{ paddingBottom: '3rem' }}>
      <div className="container">
        <p className="footer-text" style={{ marginBottom: '1rem' }}>
          Sunrise Golf Residences - La Cala de Mijas.
          <span className="footer-phone">
            <a href="tel:+34659414567" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
              Phone: +34 659 41 45 67
            </a>
          </span>
          <span className="footer-phone" style={{ marginTop: '0.25rem' }}>
            <a href="https://wa.me/34659414567" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
              WhatsApp: +34 659 41 45 67
            </a>
          </span>
        </p>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a
            href="/politica-de-privacidad"
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--text-light)'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ─── WhatsApp Floating Button ───────────────────────────── */

function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href="https://wa.me/34659414567?text=Hello,%20I%20would%20like%20to%20request%20information%20about%20Sunrise%20Golf%20Residences."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact via WhatsApp"
      className={`whatsapp-float ${visible ? 'visible' : ''}`}
      onClick={() => {
        if (window.fbq) {
          window.fbq('track', 'Lead');
        }
      }}
    >
      <WhatsAppIcon />
    </a>
  )
}

/* ─── Privacy Policy Page ────────────────────────────────── */

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '2.5rem', marginBottom: '2rem' }}>
          Privacy Policy
        </h1>

        <div style={{ fontFamily: 'var(--font-sans)', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            At <strong>Sunrise Golf Residences</strong>, discretion and the protection of our clients' data are fundamental. This Privacy Policy describes how we collect, use, and protect the personal information we obtain through our platform.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
            1. Information we collect
          </h3>
          <p style={{ marginBottom: '1.5rem' }}>
            By requesting access to our portfolio, we collect the strictly necessary data to verify your suitability and to be able to contact you: Full Name, Phone, and Email address.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
            2. Use of information
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            The data provided is used exclusively for the following purposes:
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '0.5rem' }}>
              <li>Initial evaluation of your profile.</li>
              <li>Direct communication for the presentation of available assets.</li>
              <li>Management of the commercial relationship in strict confidentiality.</li>
            </ul>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last updated: March 17, 2026.
            </p>
            <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--accent-gold)', textDecoration: 'none', borderBottom: '1px solid var(--accent-gold)', paddingBottom: '2px' }}>
              &larr; Return to Home
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Dossier Modal Component ───────────────────────────── */

function DossierModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !phone) {
      alert("Please provide both email and phone number to receive the dossier.")
      return
    }

    setStatus('submitting')

    // Fire Meta Pixel Lead event immediately on form submission
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }

    try {
      const response = await fetch('/api/kommo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Dossier Request (Sunrise Golf)',
          phone: phone,
          email: email
        })
      })

      if (response.ok) {
        setStatus('success')
        setTimeout(() => {
          onClose()
          setStatus('idle')
        }, 3000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '40px 30px', borderRadius: '4px',
        maxWidth: '450px', width: '90%', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px',
          fontSize: '1.5rem', color: '#999', cursor: 'pointer'
        }}>
          &times;
        </button>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '10px', textAlign: 'center' }}>
          Access the Full Dossier
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '25px', textAlign: 'center' }}>
          Please enter your details to receive the complete Sunrise Golf dossier.
        </p>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
              Request sent successfully.<br />Check your inbox shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <PhoneInput
                international
                defaultCountry="ES"
                value={phone}
                onChange={setPhone}
                required
                disabled={status === 'submitting'}
                style={{
                  width: '100%', padding: '5px',
                  border: '1px solid #ccc', borderRadius: '2px',
                  fontFamily: 'var(--font-sans)', fontSize: '1rem',
                  backgroundColor: '#fff'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.2', textAlign: 'left' }}>
                * We will send an immediate WhatsApp message to verify this number before sending the dossier.
              </p>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
              style={{
                width: '100%', padding: '15px', marginBottom: '20px',
                border: '1px solid #ccc', borderRadius: '2px',
                fontFamily: 'var(--font-sans)', fontSize: '1rem'
              }}
              disabled={status === 'submitting'}
            />
            {status === 'error' && (
              <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
                Error sending request. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%', padding: '16px', backgroundColor: 'var(--accent-gold)',
                color: '#fff', border: 'none', borderRadius: '2px',
                textTransform: 'uppercase', letterSpacing: '2px',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500',
                transition: 'background-color 0.3s'
              }}
            >
              {status === 'submitting' ? 'Sending...' : 'Get Dossier'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─── App ─────────────────────────────────────────────────── */

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  const grantGoogleConsent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
  }

  useEffect(() => {
    if (getCookieConsentValue("sunrise-cookie-consent") === "true") {
      grantGoogleConsent();
    }

    const handleLocationChange = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  if (currentPath === '/politica-de-privacidad') {
    return (
      <>
        <Header onOpenDossier={() => setIsDossierOpen(true)} />
        <main>
          <PrivacyPolicy />
        </main>
        <Footer />
        <DossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
      </>
    )
  }

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="I Understand"
        cookieName="sunrise-cookie-consent"
        onAccept={grantGoogleConsent}
        style={{ background: "#272522", color: "#F9F8F6", fontFamily: "var(--font-sans)", fontSize: "14px" }}
        buttonStyle={{ backgroundColor: "#C5A880", color: "#fff", fontSize: "12px", borderRadius: "2px", fontWeight: "bold", textTransform: "uppercase", padding: "10px 20px" }}
        expires={150}
      >
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "I Understand", you consent to our use of cookies.
      </CookieConsent>
      <Header onOpenDossier={() => setIsDossierOpen(true)} />
      <main>
        <Hero />
        <Benefits />
        <ValueAdd />
        <LocationMap />
      </main>
      <Footer />
      <WhatsAppButton />
      <DossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
    </>
  )
}
