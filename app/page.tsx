"use client";

import Link from "next/link";
import "./../app/app.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="hero-section">
        <h1>Student Project Showcase</h1>
        <p className="tagline">Showcase your best work to the world</p>
        
        <div className="cta-container">
          <Link href="/login">
            <button className="cta-button">Get Started</button>
          </Link>
          
          <Link href="/secure/dashboard" className="secondary-link">
            Go to Dashboard
          </Link>
        </div>
      </div>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Create Your Profile</h3>
            <p>Build a professional profile to showcase your skills and experience.</p>
          </div>
          <div className="feature-card">
            <h3>Showcase Projects</h3>
            <p>Display your best work with customizable project showcases.</p>
          </div>
          <div className="feature-card">
            <h3>Track Analytics</h3>
            <p>Monitor engagement with your profile and projects.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
