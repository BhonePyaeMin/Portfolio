import Hero         from "@/components/sections/Hero";
import About        from "@/components/sections/About";
import CareerPath   from "@/components/sections/CareerPath";
import Projects     from "@/components/sections/Projects";
import Skills       from "@/components/sections/Skills";
import Certificates from "@/components/sections/Certificates";
import Contact      from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CareerPath />
      <Projects />
      <Skills />
      <Certificates />
      <Contact />
    </>
  );
}
