import { createMachine, assign } from "xstate";

export const playTheGame = (context, event) => 
 new Promise((resolve, reject) => {
    console.log('calling the real playTheGame')
     resolve(10);
  });

export const dontMockMe = () => 50;

export const game = createMachine(
  {
    id: "game",
    initial: "playing",
    context: {
      score: -1
    },
    states: {
      lost: {},
      playing: {
        always: [
          { target: "won", cond: "checkWon" },
          { target: "lost", cond: "checkLost" },
        ],
        invoke: {
          id: "play",
          src: playTheGame,
          onDone: {
            target: "playing",
            actions: assign({
              score: (context, event) => event.data,
            }),
          },
        },
      },
      won: {},
    },
  },
  {
    guards: {
      checkWon: (context) => context.score > 50,
      checkLost: (context) => context.score <= 50 && context.score >= 0,
    },
  }
);
