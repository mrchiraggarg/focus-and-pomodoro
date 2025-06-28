export const motivationalQuotes = [
  "Great work! You're building momentum one session at a time.",
  "Focus is the gateway to all thinking: perception, memory, learning, reasoning, problem solving, and decision making.",
  "The successful warrior is the average man with laser-like focus.",
  "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
  "You are what you repeatedly do. Excellence is not an act, but a habit.",
  "The ability to concentrate and to use your time well is everything if you want to succeed in business—or almost anywhere else for that matter.",
  "Focused attention is the gateway to higher learning.",
  "Where focus goes, energy flows and results show.",
  "Success is the product of daily habits—not once-in-a-lifetime transformations.",
  "The art of being wise is knowing what to overlook.",
  "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.",
  "You have power over your mind—not outside events. Realize this, and you will find strength.",
];

export const getRandomQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};