import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Clogo.png"; // Adjust path as needed
import "../index.css"; // Ensure animations are included

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll animations for sections
    const sections = document.querySelectorAll(".animate-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div className="bg-background text-octonary min-h-screen font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-background via-tertiary to-quaternary">
        <div className="absolute w-[700px] h-[700px] bg-teal opacity-10 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-yellow opacity-10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse-slow"></div>
        <img src={Logo} alt="CodeUp Logo" className="h-24 w-auto mb-6 animate-fade-in" />
        <h1 className="text-5xl md:text-7xl font-extrabold text-teal mb-4 tracking-wide animate-fade-in-up">
          CodeUp: Code Smart, Learn Fast
        </h1>
        <p className="text-lg md:text-2xl text-senary max-w-2xl mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Simplify coding with AI-powered tools, real-time collaboration, and instant assignments — built for students and teachers!
        </p>
        <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={() => navigate("/login")}
            className="bg-teal text-background px-6 py-3 rounded-lg hover:bg-hover-teal transition-all duration-300 text-lg font-semibold shadow-md hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow text-background px-6 py-3 rounded-lg hover:bg-hover-yellow transition-all duration-300 text-lg font-semibold shadow-md hover:scale-105"
          >
            Register
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 animate-section">
        <h2 className="text-4xl font-bold text-teal text-center mb-12">Why CodeUp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="AIHelp"
            desc="Instant error detection and code suggestions with AI."
            icon="🧠"
            delay="0s"
          />
          <FeatureCard
            title="DostAI"
            desc="Learn coding in Hinglish with your friendly AI buddy."
            icon="💬"
            delay="0.1s"
          />
          <FeatureCard
            title="Collaboration Hub"
            desc="Code together in real-time with friends."
            icon="🤝"
            delay="0.2s"
          />
          <FeatureCard
            title="Smart Assignments"
            desc="Generate ready-to-submit assignments in one click."
            icon="📝"
            delay="0.3s"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-tertiary animate-section">
        <h2 className="text-4xl font-bold text-teal text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-12">
          <StepCard
            step="1. Code with Ease"
            desc="Use our Monaco Editor with AIHelp to write and debug code effortlessly."
            delay="0s"
          />
          <StepCard
            step="2. Collaborate Live"
            desc="Invite friends, track cursors, and build projects together in real-time."
            delay="0.1s"
          />
          <StepCard
            step="3. Submit Smart"
            desc="Convert your code into formatted assignments with outputs included."
            delay="0.2s"
          />
        </div>
      </section>

      {/* Teacher Panel Section */}
      <section className="py-16 px-6 animate-section">
        <h2 className="text-4xl font-bold text-teal text-center mb-12">For Teachers</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-senary mb-6 animate-fade-in-up">
            Create tests, invite students, and let AI evaluate submissions — all while providing detailed feedback when needed.
          </p>
          <div className="relative">
            <div className="absolute w-64 h-64 bg-yellow opacity-20 rounded-full blur-2xl -top-20 -left-20 animate-pulse-slow"></div>
            <div className="bg-quaternary p-6 rounded-lg shadow-lg text-octonary animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-xl font-semibold">“Save hours grading, focus on teaching!”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-background via-tertiary to-quaternary text-center animate-section">
        <h2 className="text-4xl md:text-5xl font-bold text-teal mb-6 animate-fade-in-up">
          Ready to CodeUp Your Skills?
        </h2>
        <p className="text-lg text-senary max-w-xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Join thousands of students and teachers transforming coding education.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={() => navigate("/login")}
            className="bg-teal text-background px-8 py-4 rounded-lg hover:bg-hover-teal transition-all duration-300 text-xl font-semibold shadow-lg hover:scale-110"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow text-background px-8 py-4 rounded-lg hover:bg-hover-yellow transition-all duration-300 text-xl font-semibold shadow-lg hover:scale-110"
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-tertiary text-center text-senary">
        <p>© 2025 CodeUp. All rights reserved.</p>
        <p className="mt-2">Built with <span className="text-teal">React</span>, <span className="text-yellow">AI</span>, and lots of <span className="text-teal">code love</span>.</p>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, desc, icon, delay }) => (
  <div
    className="bg-quaternary p-6 rounded-lg shadow-md hover:bg-tertiary transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-teal mb-2">{title}</h3>
    <p className="text-senary">{desc}</p>
  </div>
);

// Step Card Component
const StepCard = ({ step, desc, delay }) => (
  <div
    className="flex items-start space-x-4 bg-quaternary p-6 rounded-lg shadow-md animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    <div className="bg-teal text-background w-10 h-10 flex items-center justify-center rounded-full font-bold">✓</div>
    <div>
      <h3 className="text-lg font-semibold text-octonary">{step}</h3>
      <p className="text-senary">{desc}</p>
    </div>
  </div>
);

export default LandingPage;