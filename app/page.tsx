"use client";

import { useCallback, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Dbdoubat — the two affectionate teddy bears.                              */
/*  They lean toward each other (cuddle/kiss) while little hearts float up.   */
/*  `size` lets us reuse the same pair large on the envelope and small on     */
/*  the opened letter.                                                        */
/* -------------------------------------------------------------------------- */
function Dbdoubat({ size = "text-6xl" }: { size?: string }) {
  return (
    <div className="relative flex items-end justify-center gap-1">
      {/* Floating hearts rising from between the bears */}
      <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center">
        <span className="absolute animate-heart-rise text-xl" style={{ animationDelay: "0s" }}>
          💗
        </span>
        <span className="absolute animate-heart-rise text-sm" style={{ animationDelay: "0.9s" }}>
          💕
        </span>
        <span className="absolute animate-heart-rise text-base" style={{ animationDelay: "1.7s" }}>
          ❤️
        </span>
      </div>

      <span className={`animate-nuzzle-left ${size} drop-shadow-sm`} aria-hidden>
        🧸
      </span>
      <span className={`animate-nuzzle-right ${size} drop-shadow-sm`} aria-hidden>
        🧸
      </span>
      <span className="sr-only">Two teddy bears cuddling</span>
    </div>
  );
}

/* Ambient hearts drifting slowly up the whole background. */
function FloatingBackground() {
  const hearts = [
    { left: "8%", delay: "0s", dur: "13s", size: "text-2xl", char: "💗" },
    { left: "20%", delay: "4s", dur: "16s", size: "text-lg", char: "🤍" },
    { left: "34%", delay: "8s", dur: "12s", size: "text-xl", char: "💕" },
    { left: "52%", delay: "2s", dur: "17s", size: "text-2xl", char: "❤️" },
    { left: "68%", delay: "6s", dur: "14s", size: "text-lg", char: "💖" },
    { left: "82%", delay: "10s", dur: "15s", size: "text-xl", char: "💗" },
    { left: "92%", delay: "3s", dur: "18s", size: "text-base", char: "💞" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h, i) => (
        <span
          key={i}
          className={`absolute bottom-0 animate-drift-up opacity-0 ${h.size}`}
          style={{ left: h.left, animationDelay: h.delay, animationDuration: h.dur }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);

  const open = useCallback(async () => {
    if (opened) return;
    setOpened(true);

    // Dynamically import so canvas-confetti never touches the server bundle.
    const confetti = (await import("canvas-confetti")).default;

    const colors = ["#f472b6", "#fb7185", "#f9a8d4", "#fecdd3", "#ffffff", "#fda4af"];

    // Big centered burst.
    confetti({
      particleCount: 160,
      spread: 90,
      startVelocity: 45,
      origin: { y: 0.6 },
      colors,
    });

    // Two side cannons a beat later for a fuller explosion.
    const sideBurst = (angle: number, x: number) =>
      confetti({
        particleCount: 80,
        angle,
        spread: 65,
        origin: { x, y: 0.7 },
        colors,
      });

    setTimeout(() => {
      sideBurst(60, 0);
      sideBurst(120, 1);
    }, 180);

    // A gentle heart-shaped drizzle to keep the mood.
    const heart = confetti.shapeFromText ? confetti.shapeFromText({ text: "❤️", scalar: 2 }) : undefined;
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

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-pink-50 px-6 py-16 text-rose-900">
      <FloatingBackground />

      {!opened ? (
        /* ---------------------------- STAGE 1 ---------------------------- */
        /* The sealed envelope, guarded by two cuddling teddy bears.        */
        <section className="relative z-10 flex flex-col items-center gap-8 text-center">
          <Dbdoubat size="text-6xl sm:text-7xl" />

          <button
            type="button"
            onClick={open}
            aria-label="Open your secret message"
            className="group animate-bob cursor-pointer rounded-2xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-pink-300"
          >
            {/* Hand-built CSS envelope */}
            <div className="relative h-48 w-72 rounded-xl bg-linear-to-br from-rose-200 to-pink-300 shadow-[0_25px_60px_-15px_rgba(244,114,182,0.6)] sm:h-52 sm:w-80">
              {/* Body seam lines */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute -left-2 top-1/2 h-[120%] w-[120%] origin-top-left -translate-y-1/2 rotate-26 border-t border-rose-100/60" />
                <div className="absolute -right-2 top-1/2 h-[120%] w-[120%] origin-top-right -translate-y-1/2 rotate-[-26deg] border-t border-rose-100/60" />
              </div>

              {/* The flap (a downward triangle sitting on top) */}
              <div
                className="absolute left-0 top-0 h-0 w-0 rounded-t-xl border-transparent"
                style={{
                  borderLeftWidth: "9rem",
                  borderRightWidth: "9rem",
                  borderTopWidth: "6rem",
                  borderTopColor: "#f9a8d4",
                }}
              />

              {/* Wax-seal heart */}
              <div className="absolute left-1/2 top-[38%] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-rose-500 text-2xl shadow-lg ring-4 ring-rose-300/70">
                💌
              </div>
            </div>
          </button>

          <div className="flex flex-col items-center gap-1">
            <p className="font-script text-3xl text-rose-500 sm:text-4xl">
              Open your secret message...
            </p>
            <p className="text-sm text-rose-400">(tap the envelope)</p>
          </div>
        </section>
      ) : (
        /* ---------------------------- STAGE 2 ---------------------------- */
        /* The letter eases open. The same bears stay, smaller, on top.     */
        <section className="animate-letter-in relative z-10 w-full max-w-xl">
          <div className="relative rounded-4xl border border-rose-100 bg-white/90 px-8 py-12 shadow-[0_30px_80px_-20px_rgba(244,114,182,0.55)] backdrop-blur-sm sm:px-14 sm:py-14">
            {/* Bears keep cuddling at the top of the letter */}
            <div className="-mt-24 mb-4 flex justify-center sm:-mt-28">
              <Dbdoubat size="text-5xl" />
            </div>

            <h1 className="text-center font-script text-5xl text-rose-500 sm:text-6xl">
              Happy Birthday,
              <br />
              <span className="text-rose-600">[Your Love&apos;s Name]</span>
            </h1>

            <div className="mx-auto mt-6 h-px w-24 bg-linear-to-r from-transparent via-rose-300 to-transparent" />

            <div className="mt-6 space-y-5 text-center font-letter text-xl leading-relaxed text-rose-900/90 sm:text-2xl">
              <p>
                On the day the world became a little brighter, I just want you to know how
                impossibly grateful I am that it&apos;s <em>you</em> I get to love.
              </p>
              <p>
                You are my favorite hello, my hardest goodbye, and every quiet, happy moment
                in between. Thank you for being my home.
              </p>
              <p>
                Here&apos;s to more laughter, more adventures, and a lifetime of us — cuddled
                up close, just like our two little dbdoubat. 🧸💕
              </p>
            </div>

            <p className="mt-10 text-center font-script text-3xl text-rose-500 sm:text-4xl">
              Forever yours,
              <br />
              [Your Name]
            </p>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setOpened(false)}
                className="cursor-pointer rounded-full border border-rose-200 px-5 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
              >
                seal it back up ↺
              </button>
            </div>
          </div>
        </section>
      )}
    </main>

);
}
