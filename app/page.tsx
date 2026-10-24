import { HeroScrollDemo } from "@/components/sections/hero-scroll-demo";
import { ShaderDemo } from "@/components/sections/shader-demo";
import { TimelineLoader } from "@/components/sections/TimelineLoader";
import { ContactSection } from "@/components/sections/contact";
import { FooterDemo } from "@/components/sections/footer-demo";
import DotField from "@/components/ui/dot-field";
import { NavbarLoader } from "@/components/Navbar/NavbarLoader";

export default function Home() {
  return (
    <main id="home" className="relative min-h-screen text-foreground">

      <NavbarLoader />

      <div className="pointer-events-none fixed inset-0 z-0">
        <DotField
          dotRadius={2}
          dotSpacing={9}
          cursorRadius={200}
          cursorForce={0.12}
          bulgeOnly
          bulgeStrength={4}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(255,255,255,0.06)"
          gradientTo="rgba(255,255,255,0.02)"
          glowColor="#000000"
        />
      </div>

      <div id="services" className="relative z-10 scroll-mt-28">
        <ShaderDemo />
      </div>

      <div id="portfolio" className="relative z-20 -mt-[40vh] scroll-mt-28">
        <HeroScrollDemo />
      </div>

      <div className="relative z-30">
        <TimelineLoader />
      </div>

      <div id="contact" className="relative z-20 scroll-mt-28">
        <ContactSection />
      </div>

      <FooterDemo />

    </main>
  );
}
