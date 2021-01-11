import { machine } from "./state";
import { interpret } from "xstate";
import anime from "animejs/lib/anime.es.js";

class ToggleButton {
  button: HTMLElement;
  service = interpret(machine);

  constructor() {
    var animating = false;
    this.button = document.querySelector("#addNote");
  }
  // Toggle Function
  toggle() {
    this.button.addEventListener("click", () => {
      // Toggle state
      console.log();
      this.service.send("TOGGLE");
    });
  }

  animate(state: any) {
    var tl = anime.timeline();
    if (state === "active") {
      tl.add({
        targets: this.button,
        translateY: [0, -12, 0],
        scale: [1, 0.85, 1],
        rotate: 316,
        duration: 600,
        easing: "easeInOutSine",
      })
        .add(
          {
            targets: ".note-selectors #circlePath",
            d: [
              {
                value:
                  "M24 22C24 28.6274 18.6274 34 12 34C5.37258 34 0 28.6274 0 22C0 15.3726 5.37258 0 12 0C18.6274 0 24 15.3726 24 22Z",
              },
              {
                value:
                  "M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z",
              },
            ],
            duration: 600,
            delay: anime.stagger(300),
          },
          "-=400"
        )
        .add(
          {
            targets: ".note-selectors .selector",
            translateY: function (el) {
              return [el.getAttribute("data-from"), el.getAttribute("data-to")];
            },
            duration: 1400,
            opacity: {
              value: 1,
              duration: 400,
            },
            delay: anime.stagger(300),
            complete: function (anim) {
              this.animating = false;
            },
          },
          "-=1600"
        );
    } else if (state === "inactive") {
      tl.add({
        targets: this.button,
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
          complete: function (anim) {
            this.animating = false;
          },
        });
    }
  }

  init() {
    this.service
      .onTransition((state) => {
        this.animate(state.value);
      })
      .start();
    this.toggle();
  }
}

export default ToggleButton;
