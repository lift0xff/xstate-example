import {playTheGame} from './game'
jest.mock('./game', () => {
  const originalModule = jest.requireActual('./game');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    playTheGame: (context, event) => /* this is never called :( */
    new Promise((resolve, reject) => {
      console.log('calling the fake playTheGame');
      context.token.balance = 100;
      resolve(100);
    })
  };
});

import { waitFor } from "xstate/lib/waitFor";
import { interpret } from "xstate";
import {dontMockMe, game} from './game'


test("play the game", async () => {
  const service = interpret(game);
  service.start();
  const readyState = await waitFor(service, (state) => state.matches("won"));
  expect(readyState.matches("won")).toBeTruthy();
  expect(dontMockMe() === 50).toBeTruthy()
  service.stop();
});
