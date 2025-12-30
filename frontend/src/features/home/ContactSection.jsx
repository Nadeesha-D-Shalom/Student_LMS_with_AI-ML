import React, { useState } from "react";
import "./home.css";
import { useScrollReveal } from "../../utils/useScrollReveal";

const ContactSection = () => {
  const { ref, visible } = useScrollReveal();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!/^[A-Za-z\s]{3,}$/.test(data.name)) newErrors.name = "Name must be at least 3 letters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email address";
    if (!/^[0-9]{9,12}$/.test(data.phone)) newErrors.phone = "Phone must be 9-12 digits";
    if (!data.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      alert("Message sent successfully!");
      setData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <section
      ref={ref}
      className={`about-section reveal ${visible ? "visible" : ""}`}
      id="about"
    >
      <div className="contact-glass-container">
        <div className="contact-info">
          <div className="hero-badge">Get in Touch</div>
          <h2>Contact Our Team</h2>
          <p>
            Have questions about our AI-powered learning platform? We're here to help. Reach out to us for support, feedback, or collaboration opportunities.
          </p>
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <span>support@studentlms.ai</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span>123 AI Learning Street, Tech City, CA 94000</span>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          <div className="field">
            <input 
              type="text" 
              name="name" 
              placeholder=" " 
              required 
              onChange={handleChange} 
              value={data.name}
            />
            <label>Full Name</label>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="field">
            <input 
              type="email" 
              name="email" 
              placeholder=" " 
              required 
              onChange={handleChange} 
              value={data.email}
            />
            <label>Email Address</label>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="field">
            <input 
              type="tel" 
              name="phone" 
              placeholder=" " 
              required 
              onChange={handleChange} 
              value={data.phone}
            />
            <label>Phone Number</label>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="field">
            <textarea 
              name="message" 
              placeholder=" " 
              required 
              onChange={handleChange} 
              value={data.message}
            />
            <label>Your Message</label>
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <button className="primary-btn" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;