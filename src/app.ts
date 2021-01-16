import { interpret } from "xstate";
import { toggleMachine } from "./scripts/state";

// Anime
import anime from "animejs/lib/anime.es.js";

// Vars
const button = <HTMLInputElement>document.querySelector('#addNote')
const toggleService = interpret(toggleMachine);

const toggle = () => {
  button.onclick = () => toggleService.send('TOGGLE')
};

const buttonDisabled = (btnStatus: boolean) => {
  button.disabled = btnStatus
};

const animate = (status: any) => {
  const tl = anime.timeline();
  if (status === "active") {
    buttonDisabled(true);
    tl.add({
      targets: button,
      translateY: [0, -12, 0],
      scale: [1, 0.85, 1],
      rotate: 316,
      duration: 600,
      easing: "easeInOutSine",
    })
      .add(
        {
          targets: ".note-selectors .first",
          translateY: [0, 80],
          duration: 3200,
          scaleY: [1.8, 1],
        },
        "-=400"
      )
      .add(
        {
          targets: ".note-selectors .other",
          translateY: function (el) {
            return [el.getAttribute("data-from"), el.getAttribute("data-to")];
          },
          scaleY: [0, 1],
          duration: 1600,
          opacity: {
            value: 1,
            duration: 10,
          },
          delay: anime.stagger(240),
          complete: function () {
            buttonDisabled(false);
          },
        },
        "-=2600"
      );
  } else if (status === "inactive") {
    buttonDisabled(true);
    tl.add({
      targets: button,
      rotate: 0,
      duration: 600,
      easing: "easeInOutSine",
    }).add(
      {
        targets: ".note-selectors .selector",
        translateY: function (el) {
          return [el.getAttribute("data-to"), 0];
        },
        duration: 400,
        delay: anime.stagger(60),
        easing: "easeInOutSine",
        complete: function () {
          buttonDisabled(false);
        },
      },
      "-=400"
    );
  }
};

const init = () => {
  toggleService
    .onTransition((state) => {
      console.log(state.value);
      animate(state.value);
    })
    .start();
  toggle();
};

init();
