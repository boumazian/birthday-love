"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { birthdayContent as content } from "./content";

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

/** Tracks the user's reduced-motion preference (SSR-safe). */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Typewriter for a list of paragraphs. Types them out in order once `enabled`
 * is true; reveals everything instantly when `instant` (reduced motion) is set.
 * Returns the visible slice of each paragraph, the index currently typing,
 * and whether it has finished.
 */
function useTypewriter(
  paragraphs: readonly string[],
  enabled: boolean,
  instant: boolean,
  speed = 24,
  startDelay = 450,
) {
  const total = useMemo(
    () => paragraphs.reduce((n, p) => n + p.length, 0),
    [paragraphs],
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    if (instant) {
      setCount(total);
      return;
    }
    setCount(0);
    let typed = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        typed += 1;
        setCount(typed);
        if (typed >= total) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [enabled, instant, total, speed, startDelay]);

  const { slices, activeIndex } = useMemo(() => {
    const out: string[] = [];
    let remaining = count;
    let active = -1;
    paragraphs.forEach((p, i) => {
      const take = Math.max(0, Math.min(p.length, remaining));
      out.push(p.slice(0, take));
      if (active === -1 && take < p.length) active = i;
      remaining -= p.length;
    });
    return { slices: out, activeIndex: active };
  }, [count, paragraphs]);

  return { slices, activeIndex, done: count >= total };
}

/* -------------------------------------------------------------------------- */
/*  Presentational pieces                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Dbdoubat — the two affectionate teddy bears. They lean toward each other
 * (cuddle/kiss) while little hearts float up between them. `size` scales the
 * pair so it can be large on the envelope and small on the letter.
 */
function TeddyDuo({ size }: { size: string }) {
  return (
    <div className="relative flex items-end justify-center gap-1">
      {/* Hearts rising from between the bears */}
      <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center">
        {content.teddy.hearts.map((heart, i) => (
          <span
            key={i}
            className="absolute animate-heart-rise"
            style={{ animationDelay: `${i * 0.85}s`, fontSize: "0.8em" }}
          >
            {heart}
          </span>
        ))}
      </div>

      <span className={`animate-nuzzle-left ${size} drop-shadow-sm`} aria-hidden>
        {content.teddy.bear}
      </span>
      <span className={`animate-nuzzle-right ${size} drop-shadow-sm`} aria-hidden>
        {content.teddy.bear}
      </span>
      <span className="sr-only">{content.teddy.caption}</span>
    </div>
  );
}

/** Ambient hearts drifting slowly up the whole background. */
function FloatingBackground() {
  // Deterministic, evenly spread layout (no Math.random → no hydration drift).
  const hearts = content.ambientHearts.map((char, i) => {
    const count = content.ambientHearts.length;
    return {
      char,
      left: `${6 + (i * 88) / Math.max(1, count - 1)}%`,
      delay: `${(i * 2.3) % 11}s`,
      duration: `${12 + (i % 5) * 1.5}s`,
      size: ["text-base", "text-lg", "text-xl", "text-2xl"][i % 4],
    };
  });

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {hearts.map((h, i) => (
        <span
          key={i}
          className={`absolute bottom-0 animate-drift-up opacity-0 ${h.size}`}
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function BirthdayPage() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { slices, activeIndex, done } = useTypewriter(
    content.letter.paragraphs,
    opened,
    prefersReduced,
  );

  const open = useCallback(async () => {
    if (opened) return;
    setOpened(true);

    // Kick off the music (user gesture → autoplay is allowed).
    audioRef.current?.play().catch(() => {
      /* no file yet, or blocked — fail silently */
    });

    // Dynamically import so canvas-confetti never touches the server bundle.
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#f472b6", "#fb7185", "#f9a8d4", "#fecdd3", "#ffffff", "#fda4af"];

    confetti({ particleCount: 160, spread: 90, startVelocity: 45, origin: { y: 0.6 }, colors });

    const sideBurst = (angle: number, x: number) =>
      confetti({ particleCount: 80, angle, spread: 65, origin: { x, y: 0.7 }, colors });
    setTimeout(() => {
      sideBurst(60, 0);
      sideBurst(120, 1);
    }, 180);

    const heart = confetti.shapeFromText
      ? confetti.shapeFromText({ text: "❤️", scalar: 2 })
      : undefined;
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        startVelocity: 30,
        gravity: 0.6,
        scalar: 2,
        origin: { y: 0.4 },
        ...(heart ? { shapes: [heart] } : {}),
      });
    }, 420);
  }, [opened]);

  const reset = useCallback(() => {
    setOpened(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  // Escape key closes the letter and reseals the envelope.
  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened, reset]);

  // Keep the audio element's muted state in sync with the toggle.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-pink-50 px-4 py-12 text-rose-900 sm:px-6 sm:py-16">
      <FloatingBackground />

      {/* Background music — add a file at public/music.mp3 */}
      <audio ref={audioRef} src={content.music.src} loop preload="auto" />

      {/* Mute toggle (only while the letter is open) */}
      {opened && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? content.music.unmuteLabel : content.music.muteLabel}
          className="fixed right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white/80 text-lg shadow-sm backdrop-blur transition-colors hover:bg-rose-50 sm:right-5 sm:top-5"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      {!opened ? (
        /* ---------------------------- STAGE 1 ---------------------------- */
        /* The sealed envelope, guarded by two cuddling teddy bears.        */
        <section className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 text-center sm:gap-10">
          <TeddyDuo size="text-6xl sm:text-7xl" />

          <button
            type="button"
            onClick={open}
            aria-label={content.envelope.ariaLabel}
            className="group animate-bob w-full max-w-[20rem] cursor-pointer rounded-2xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-pink-300"
          >
            {/* Hand-built CSS envelope — fully fluid via aspect-ratio + clip-path */}
            <div className="relative mx-auto aspect-[3/2] w-full overflow-hidden rounded-xl bg-linear-to-br from-rose-200 to-pink-300 shadow-[0_25px_60px_-15px_rgba(244,114,182,0.6)]">
              {/* Bottom pocket (lighter V rising from the base) */}
              <div
                className="absolute inset-0 bg-rose-100/70"
                style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 42%)" }}
              />
              {/* Top flap (darker triangle folding down) */}
              <div
                className="absolute inset-x-0 top-0 h-3/5 bg-pink-300"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              {/* Wax-seal heart */}
              <div className="absolute left-1/2 top-[42%] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-rose-500 text-xl shadow-lg ring-4 ring-rose-300/70 sm:h-14 sm:w-14 sm:text-2xl">
                {content.envelope.seal}
              </div>
            </div>
          </button>

          <div className="flex flex-col items-center gap-1">
            <p className="font-script text-3xl text-rose-500 sm:text-4xl">
              {content.envelope.teaser}
            </p>
            <p className="text-sm text-rose-400">{content.envelope.hint}</p>
          </div>
        </section>
      ) : (
        /* ---------------------------- STAGE 2 ---------------------------- */
        /* The letter eases open. The same bears stay, smaller, on top.     */
        <section className="animate-letter-in relative z-10 mx-auto w-full max-w-md md:max-w-xl">
          <div className="relative rounded-4xl border border-rose-100 bg-white/90 px-6 py-10 shadow-[0_30px_80px_-20px_rgba(244,114,182,0.55)] backdrop-blur-sm sm:px-12 sm:py-14">
            {/* Bears keep cuddling at the top of the letter */}
            <div className="-mt-20 mb-4 flex justify-center sm:-mt-24">
              <TeddyDuo size="text-5xl sm:text-6xl" />
            </div>

            <h1 className="text-center font-script text-[2rem] leading-tight text-rose-500 [text-wrap:balance] sm:text-5xl md:text-6xl">
              {content.letter.greeting}
              <br />
              <span className="text-rose-600">{content.letter.recipient}</span>
            </h1>

            <div className="mx-auto mt-5 h-px w-24 bg-linear-to-r from-transparent via-rose-300 to-transparent sm:mt-6" />

            <div className="mt-6 space-y-4 text-center font-letter text-lg leading-relaxed text-rose-900/90 sm:space-y-5 sm:text-xl md:text-2xl">
              {content.letter.paragraphs.map((_, i) => (
                <p key={i}>
                  {slices[i]}
                  {i === activeIndex && !prefersReduced && (
                    <span className="animate-blink ml-0.5 font-sans text-rose-400">
                      |
                    </span>
                  )}
                </p>
              ))}
            </div>

            {/* Sign-off + controls fade in once the letter finishes typing */}
            <div
              className={`transition-opacity duration-700 ${
                done ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <p className="mt-8 text-center font-script text-3xl text-rose-500 sm:mt-10 sm:text-4xl">
                {content.letter.signOff}
                <br />
                {content.letter.sender}
              </p>

              <div className="mt-8 flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  className="cursor-pointer rounded-full border border-rose-200 px-5 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                >
                  {content.letter.resetLabel}
                </button>
                <span className="text-xs text-rose-300">
                  {content.letter.resetHint}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
