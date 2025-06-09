export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.4, ease: 'easeOut' },
});

// export const fadeInUp = {
//   initial: { opacity: 0, y: 10 },
//   animate: { opacity: 1, y: 0 },
//   transition: (delay = 0) => ({
//     duration: 0.4,
//     ease: 'easeOut',
//     delay,
//   }),
// };
