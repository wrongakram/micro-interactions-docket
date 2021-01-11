import { Machine } from "xstate";

type ToggleEvent = {
  type: "TOGGLE";
};
// Our State Machine
export const machine = Machine<ToggleEvent>({
  id: "toggleButton",
  initial: "idle",
  states: {
    idle: {
      on: { TOGGLE: "active" },
    },
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
});
