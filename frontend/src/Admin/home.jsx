import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Component.css";
import heroImg from "../assets/background_1.png";

const HomePage = () => {
  const navigate = useNavigate();
  const featureRef = useRef(null);
  const collectionRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (

    <div className="hm_container" style={{ backgroundImage: `url(${heroImg})` }}>


      <section className="hm_hero">

        {/* NAVBAR */}
        <nav className="hm_navbar">
          <div className="hm_logo">📚 PUSTAKALYA   </div>
          <div className="hm_navlinks">
            <span onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</span>
            <span onClick={() => scrollTo(featureRef)}>Features</span>
            <span onClick={() => scrollTo(collectionRef)}>Collections</span>
            <span onClick={() => scrollTo(aboutRef)}>About</span>
            <span onClick={() => scrollTo(contactRef)}>Contact</span>
          </div>
          <button className="hm_nav_btn" onClick={() => navigate("/login")}>
            Get Started →
          </button>
        </nav>


        <div className="hm_hero_content">


          <div className="hm_left">
            <h1>
              More Than Books.
              <br />
              <span>Endless Knowledge.</span>
            </h1>
            <div className="hm_line"></div>
            <p>
              A smart library management system to organize, manage and simplify your entire library operations with efficiency and intelligence.
            </p>
            <button className="hm_main_btn" onClick={() => navigate("/signup")}>
              Explore Library →
            </button>
            <div className="hm_watch">
              <div className="hm_play">▶</div>
              <div>
                <h3>Discover the power of smart libraries</h3>
                <p>Experience next generation digital library management.</p>
              </div>
            </div>
          </div>


          <div className="hm_right">
            <div className="hm_glow"></div>
          </div>

        </div>

      </section>


      <section className="hm_features" ref={featureRef}>
        <div className="hm_section_title">
          <span>FEATURES</span>
          <h2>Everything You Need In One Platform</h2>
        </div>
        <div className="hm_feature_grid">
          <div className="hm_feature_card">
            <div className="hm_feature_icon">📖</div>
            <h3>Book Management</h3>
            <p>Organize thousands of books with advanced search, filtering and smart categorization.</p>
          </div>
          <div className="hm_feature_card">
            <div className="hm_feature_icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track library performance, issued books and user activities in real-time.</p>
          </div>
          <div className="hm_feature_card">
            <div className="hm_feature_icon">⚡</div>
            <h3>Automation</h3>
            <p>Automated issue-return workflows, reminders and smart overdue tracking.</p>
          </div>
        </div>
      </section>


      <section className="hm_collections" ref={collectionRef}>
        <div className="hm_section_title">
          <span>COLLECTIONS</span>
          <h2>Popular Categories</h2>
        </div>
        <div className="hm_collection_grid">
          <div className="hm_collection_card"><h3>Technology</h3></div>
          <div className="hm_collection_card"><h3>Science Fiction</h3></div>
          <div className="hm_collection_card"><h3>Business</h3></div>
          <div className="hm_collection_card"><h3>History</h3></div>
          <div className="hm_collection_card"><h3>Fiction</h3></div>
          <div className="hm_collection_card"><h3>Non-Fiction</h3></div>
          <div className="hm_collection_card"><h3>Graphic Novel</h3></div>
          <div className="hm_collection_card"><h3>Travel</h3></div>
        </div>
      </section>


      <section className="hm_about" ref={aboutRef}>
        <div className="hm_about_left">
          <div className="hm_section_title">
            <span>ABOUT US</span>
          </div>
          <h2>Modern Library Experience Designed For The Future</h2>
          <p>Library SaaS combines elegant design, intelligent automation and seamless management tools to create a powerful digital library ecosystem.</p>
        </div>
        <div className="hm_about_right">
          <div className="hm_about_box">
            <h3>10K+</h3>
            <p>Books Managed</p>
          </div>
          <div className="hm_about_box">
            <h3>2K+</h3>
            <p>Daily Users</p>
          </div>
          <div className="hm_about_box">
            <h3>99%</h3>
            <p>System Reliability</p>
          </div>
        </div>
      </section>


      <section className="hm_contact" ref={contactRef}>
        <div className="hm_section_title">
          <span>CONTACT</span>
          <h2>Let’s Build Smarter Libraries</h2>
        </div>
        <form className="hm_contact_form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>


      <footer className="hm_footer">
        <h2>📚 PUSTAKALYA </h2>
        <p>Smart Digital Library Management System</p><br />
        <p>© 2026 PUSTAKALYA • Built for Smart Digital Learning</p>
      </footer>

    </div>
  );
};

export default HomePage;