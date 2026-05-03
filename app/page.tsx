import { HeroScrollDemo } from "@/components/sections/hero-scroll-demo";
import { ShaderDemo } from "@/components/sections/shader-demo";
import { ThemeToggle } from "@/components/theme-toggle";
import DotField from "@/components/ui/dot-field";
import { NavbarLoader } from "@/components/Navbar/NavbarLoader";

export default function Home() {
  return (
    <main id="home" className="relative min-h-screen text-foreground">

      <NavbarLoader />

      <div className="fixed right-4 top-4 z-[1100]">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0">
        <DotField
          dotRadius={2}
          dotSpacing={9}
          cursorRadius={200}
          cursorForce={0.12}
          bulgeOnly
          bulgeStrength={4}
          glowRadius={250}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="#0033ff"
          gradientTo="#000721"
          glowColor="#000000"
        />
      </div>

      <div id="services" className="relative z-10 scroll-mt-28">
        <ShaderDemo />
      </div>

      <div id="portfolio" className="relative z-20 -mt-[33vh] scroll-mt-28">
        <HeroScrollDemo />
      </div>

      <div id="contact" className="relative z-20 h-px scroll-mt-28" />

    </main>
  );
}
