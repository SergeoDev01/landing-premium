"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Clock3, Mail, RotateCcw, Send } from "lucide-react";

const fieldClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white transition-all outline-none placeholder:text-neutral-500 focus:border-[#0033ff] focus:ring-2 focus:ring-[#0033ff]/40";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-32 md:px-12">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        {/* ── Gauche : présentation ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
        >
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#0033ff]/30 bg-[#0033ff]/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#4d76ff] uppercase">
            <Mail className="h-3.5 w-3.5" />
            Contact
          </span>

          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Discutons de
            </span>
            <br />
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              votre projet
            </span>
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-400">
            Une question, une suggestion ou un besoin d&apos;outillage sur mesure
            pour vos images&nbsp;? Notre équipe vous répond sous 24&nbsp;heures.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <a
              href="mailto:contact@sergeo-bgremover.fr"
              className="group flex items-center gap-4 text-sm text-neutral-300 transition-colors hover:text-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-[#0033ff]/50">
                <Mail className="h-5 w-5 text-[#4d76ff]" />
              </span>
              contact@sergeo-bgremover.fr
            </a>
            <div className="flex items-center gap-4 text-sm text-neutral-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Clock3 className="h-5 w-5 text-[#4d76ff]" />
              </span>
              Réponse sous 24&nbsp;h
            </div>
          </div>
        </motion.div>

        {/* ── Droite : formulaire ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-[#0033ff]/20 blur-[100px]" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-6 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Merci pour votre message&nbsp;!
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">
                    Votre demande a bien été envoyée. Nous vous répondrons sous
                    24&nbsp;heures.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-[#0033ff]/50 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-xs font-semibold tracking-widest text-neutral-400 uppercase"
                  >
                    Nom
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Votre nom"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-xs font-semibold tracking-widest text-neutral-400 uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="vous@exemple.fr"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-semibold tracking-widest text-neutral-400 uppercase"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Décrivez votre besoin…"
                    className={`${fieldClass} h-auto resize-none py-3`}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0033ff] px-8 text-sm font-semibold text-white uppercase tracking-wide shadow-[0_0_30px_hsl(var(--primary)/0.45)] transition-all hover:shadow-[0_0_50px_hsl(var(--primary)/0.7)] hover:brightness-110"
                >
                  Envoyer
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
