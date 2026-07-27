/**
 * Birthday message content.
 * ---------------------------------------------------------------------------
 * This is the ONLY file you need to edit to change what the page says.
 * The UI in `page.tsx` reads everything from the exported `birthdayContent`
 * object below — no component code needs to be touched to reword the letter,
 * rename the recipient, swap the teddy-bear emoji, or point at a new song.
 */

export const birthdayContent = {
  /** Browser tab title + meta description (used by app/layout.tsx). */
  meta: {
    title: "Happy Birthday Faysal ❤️",
    description: "A secret birthday message, sealed with love.",
  },

  /** Stage 1 — the sealed envelope. */
  envelope: {
    ariaLabel: "Open your secret message",
    seal: "💌",
    teaser: "Open your secret message, my love...",
    hint: "(tap the envelope)",
  },

  /**
   * The two cuddling teddy bears ("dbdoubat").
   * `bear` is rendered twice (they lean into each other), and `hearts`
   * float up one-by-one between them. Add/remove hearts freely.
   */
  teddy: {
    bear: "🧸",
    hearts: ["💗", "💕", "❤️"],
    caption: "Two teddy bears cuddling", // screen-reader description
  },

  /** Stage 2 — the opened letter. Body paragraphs are typewritten in order. */
  letter: {
    greeting: "My Love,",
    recipient: "Faysal ❤️",
    paragraphs: [
      "Faysal, I just want to tell you that I love you so much—more than you could ever imagine—and I miss you terribly! Wishing you the happiest birthday, filled with health, peace, and long life. May Allah protect your mother and siblings, help you reach every single goal and dream you hold in your heart, and compensate you with endless blessings in your life. 🤲✨",
      "I truly want to see you at the very top, and I believe in you with all my heart... Just thinking of you brings the sweetest smile to my face. 😊💖",
      "Lately, you've been carrying a heavy weight and going through very difficult times—I understand what you're going through, and I am right here by your side. Insha'Allah, God will reward your patience; this is just a temporary test in life. I want you to remember that I am always with you, even if we are physically far apart, my heart and mind are always right there with you. 🫂❤️",
    ],
    signOff: "Always yours,",
    sender: "Abba ❤️",
    resetLabel: "seal it back up ↺",
    resetHint: "press Esc to close",
  },

  /** Emoji that drift slowly up the background on both stages. */
  ambientHearts: ["💗", "🤍", "💕", "❤️", "💖", "💗", "💞"],

  /**
   * Background music. Drop an audio file at `public/music.mp3`
   * (or change `src` to your own path). Playback starts on open and
   * stops on reset; a mute toggle appears while the letter is open.
   */
  music: {
    src: "/music.mp3",
    muteLabel: "Mute music",
    unmuteLabel: "Unmute music",
  },
} as const;

export type BirthdayContent = typeof birthdayContent;