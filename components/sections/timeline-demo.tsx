import React from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

export function TimelineDemo() {
  const data = [
    {
      title: "Étape 1",
      content: (
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
            Importation Intelligente
          </h4>
          <p className="mb-8 text-sm md:text-base font-normal text-neutral-400">
            Glissez-déposez vos images directement sur notre interface. Nous supportons tous les formats standards (PNG, JPG, WebP) et traitons les fichiers haute résolution sans perte de qualité.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="Upload interface"
              width={500}
              height={300}
              className="rounded-xl object-cover h-40 md:h-60 w-full shadow-2xl border border-white/5"
            />
            <Image
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="Processing"
              width={500}
              height={300}
              className="rounded-xl object-cover h-40 md:h-60 w-full shadow-2xl border border-white/5"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Étape 2",
      content: (
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
            Analyse IA de Précision
          </h4>
          <p className="mb-8 text-sm md:text-base font-normal text-neutral-400">
            Notre algorithme d&apos;apprentissage profond analyse chaque pixel pour identifier le sujet principal. Qu&apos;il s&apos;agisse de cheveux, de transparence ou de détails complexes, l&apos;IA détoure l&apos;image avec une précision chirurgicale en moins de 2 secondes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="AI Analysis"
              width={500}
              height={300}
              className="rounded-xl object-cover h-40 md:h-60 w-full shadow-2xl border border-white/5"
            />
            <Image
              src="https://assets.aceternity.com/features-section.png"
              alt="Edge detection"
              width={500}
              height={300}
              className="rounded-xl object-cover h-40 md:h-60 w-full shadow-2xl border border-white/5"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Étape 3",
      content: (
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
            Exportation et Personnalisation
          </h4>
          <p className="mb-4 text-sm md:text-base font-normal text-neutral-400">
            Une fois l&apos;arrière-plan supprimé, vous pouvez télécharger votre image en PNG transparent ou choisir parmi nos fonds prédéfinis.
          </p>
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <span className="text-emerald-500">✓</span> Fond transparent instantané
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <span className="text-emerald-500">✓</span> Remplacement par couleurs unies ou gradients
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <span className="text-emerald-500">✓</span> Téléchargement HD gratuit
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="Export options"
              width={500}
              height={300}
              className="rounded-xl object-cover h-40 md:h-60 w-full shadow-2xl border border-white/5"
            />
            <Image
              src="https://assets.aceternity.com/cards.png"
              alt="Final result"
              width={500}
              height={300}
              className="rounded-xl object-cover h-40 md:h-60 w-full shadow-2xl border border-white/5"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="how-it-works" className="relative w-full overflow-clip scroll-mt-20">
      <Timeline data={data} />
    </div>
  );
}
