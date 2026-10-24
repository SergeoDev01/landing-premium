"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/ui/footer";
import { LogoIcon } from "@/components/logo";

const customNavColumns = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "#services" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Comment ça marche", href: "#how-it-works" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Centre d'aide", href: "#contact" },
      { label: "API", href: "#contact" },
      { label: "Statut du système", href: "#" },
      { label: "Nouveautés", href: "#services" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "#" },
      { label: "Conditions d'utilisation", href: "#" },
      { label: "Confidentialité", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

const customSocialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export function FooterDemo() {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("fr-FR", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Footer
      badgeText="Créé par Sergeo Limta"
      newsletterHeading={"Les dernières nouveautés,\nastuces et mises à jour,\ndans votre boîte mail chaque semaine."}
      newsletterPlaceholder="Votre adresse email"
      newsletterButtonText="S'abonner"
      brandName="Sergeo Bg_Remover"
      brandLogo={<LogoIcon className="size-8" />}
      navColumns={customNavColumns}
      copyright="© 2026 Sergeo Bg_Remover. Tous droits réservés."
      location="Paris, France"
      time={time}
      socialLinks={customSocialLinks}
    />
  );
}
