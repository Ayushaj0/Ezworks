import { useState } from 'react';
import { uploadComplete } from './services/api';
import './App.css';

const servicesList = [
  { title: "Presentation Design", desc: "Professional presentations that captivate your audience." },
  { title: "Audio - Visual Production", desc: "High-quality audio and visual content production." },
  { title: "Translation Services", desc: "Accurate translations across multiple languages." },
  { title: "Graphic Design", desc: "Creative and impactful visual designs." },
  { title: "Research & Analytics", desc: "Data-driven insights and analysis." },
  { title: "Data Processing", desc: "Efficient and accurate data processing solutions." }
];

function Header({ searchTerm, setSearchTerm }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    
    // Test cases
    const testEmails = [
      'test@example.com',        // Valid email ✅
      'user.name@domain.com',    // Valid email with dot ✅
      'user+label@domain.com',   // Valid email with plus ✅
      'test@ez.works',          // Not allowed domain ❌
      'invalid.email',          // Invalid format ❌
      '',                       // Empty email ❌
      'test@.com',             // Invalid format ❌
      '@domain.com',           // Invalid format ❌
      'test@domain',           // Invalid format ❌
    ];

    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
    if (!regex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true, error: null };
  };

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      const result = await uploadComplete({ email });
      setMessage(result.message || 'Form Submitted');
      setEmail(''); // Clear email on success
    } catch (error) {
      setError(error.message || 'Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img 
          src="https://dxw9jueyijhmn.cloudfront.net/ez_website/frontend_img/CommonImages/logo.webp" 
          alt="EZ Works Logo"
          className="logo-img"
        />
        <h1 className="company-name">EZ Works</h1>
      </div>
      <div className="header-content">
        <h2 className="title">Suite of Business Support Services</h2>
        <p className="subtitle">Empowering your business with professional solutions</p>
        <div className="search-contact">
          <div className="search-box">
            <textarea 
              placeholder="Email Address..."
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // Clear error on change
                setMessage(''); // Clear message on change
              }}
              className={`search-textarea ${error ? 'error' : ''} ${message ? 'success' : ''}`}
            ></textarea>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <i className="search-icon">🔍</i>
          </div>
          <button 
            className="contact-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Submitting...' : 'Contact Me'}</span>
            <i className="arrow-icon">→</i>
          </button>
        </div>
      </div>
    </header>
  );
}

function ServiceCard({ title, desc }) {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = servicesList.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="services">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <ServiceCard key={index} title={service.title} desc={service.desc} />
          ))
        ) : (
          <p>No services found</p>
        )}
      </main>
    </div>
  );
}

export default App;