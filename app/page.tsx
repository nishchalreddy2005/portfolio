import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import About from "@/components/about"
import Skills from "@/components/skills"
import Education from "@/components/education"
import Experience from "@/components/experience"
import Projects from "@/components/projects"
import Certifications from "@/components/certifications"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import WelcomePopup from "@/components/welcome-popup"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Education />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
      <WelcomePopup />
    </main>
  )
}

