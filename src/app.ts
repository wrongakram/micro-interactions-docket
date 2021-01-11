import { machine } from "./scripts/state";
import { interpret } from "xstate";
import anime from "animejs/lib/anime.es.js";

// Varibles
const button: HTMLElement = document.querySelector("#addNote");
const service = interpret(machine);

// Toggle State Function
const toggle = () => {
  button.addEventListener("click", () => {
    // Toggle state
    service.send("TOGGLE");
  });
};
// Disable button while animation is running
const buttonDisabled = (status) => {
  if (status) {
    button.setAttribute("disabled", "");
  } else {
    button.removeAttribute("disabled");
  }
};
// Animation function depending on state
const animate = (state: any) => {
  var tl = anime.timeline();
  if (state === "active") {
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
          translateY: function (el) {
            return [el.getAttribute("data-from"), el.getAttribute("data-to")];
          },
          duration: 3200,
          opacity: {
            value: 1,
            duration: 10,
          },
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
  } else if (state === "inactive") {
    buttonDisabled(true);
    tl.add({
      targets: button,
      rotate: 0,
      duration: 600,
      easing: "easeInOutSine",
    })
      .add(
        {
          targets: ".note-selectors .selector",
          translateY: function (el) {
            return [el.getAttribute("data-to"), 0];
          },
          duration: 400,
          delay: anime.stagger(60),
          easing: "easeInOutSine",
        },
        "-=400"
      )
      .add({
        targets: ".note-selectors .selector",
        opacity: 0,
        complete: function () {
          buttonDisabled(false);
        },
      });
  }
};

const init = () => {
  service
    .onTransition((state) => {
      animate(state.value);
    })
    .start();
  toggle();
};

init();
