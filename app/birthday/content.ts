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
    title: "A Little Something For You 💌",
    description: "A secret birthday message, sealed with love.",
  },

  /** Stage 1 — the sealed envelope. */
  envelope: {
    ariaLabel: "Open your secret message",
    seal: "💌",
    teaser: "Open your secret message...",
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
    greeting: "Happy Birthday,",
    recipient: "[Your Love's Name]",
    paragraphs: [
      "On the day the world became a little brighter, I just want you to know how impossibly grateful I am that it's you I get to love.",
      "You are my favorite hello, my hardest goodbye, and every quiet, happy moment in between. Thank you for being my home.",
      "Here's to more laughter, more adventures, and a lifetime of us — cuddled up close, just like our two little dbdoubat. 🧸💕",
    ],
    signOff: "Forever yours,",
    sender: "[Your Name]",
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
