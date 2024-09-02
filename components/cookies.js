'use client'
import { useState, useEffect } from 'react';

export default function Cookies() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage for user consent status
    const consentStatus = localStorage.getItem('cookieConsent');
    if (!consentStatus) {
      // Show popup if there's no consent status in localStorage
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="cookies-wrap">
        <div className="wrapper">
          <header>
            <i className="bx bx-cookie"></i>
            <h2>Cookies Consent</h2>
          </header>

          <div className="data">
            <p>This website use cookies to help you have a superior and more relevant browsing experience on the website.</p>
          </div>

          <div className="buttons">
            <button className="button" id="acceptBtn" onClick={handleAccept}>Accept</button>
            <button className="button" id="declineBtn" onClick={handleDecline}>Decline</button>
          </div>
        </div>
      </div>
    </>
  )
}