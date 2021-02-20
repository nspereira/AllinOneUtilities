interface DashedInputOptions {
  max?: number;
  min?: number;
}

// TODO extra make the line blink

const DashedInput = class {
  private store: number[] = [];
  public max;

  constructor(
    private input: HTMLInputElement,
    private options: DashedInputOptions = {
      max: 4,
    }
  ) {
    const { max } = this.options;
    this.max = max ?? this.max;
    this.init();
  }

  private init() {
    this.surround();

    // init events
    this.input.addEventListener("keyup", this.onKeyboardEvent.bind(this));

    this.drawDisplay();
  }

  private surround() {
    const parent = this.input.parentElement;
    const div = document.createElement("div");
    div.innerHTML = "<div></div>";

    parent.appendChild(div);
    div.appendChild(this.input);

    this.input = div.querySelector("input");
  }

  get value() {
    return this.store.join("");
  }

  private onKeyboardEvent(event: KeyboardEvent) {
    const { key, code } = event;
    if ([key, code].indexOf("Backspace") !== -1) {
      this.store.pop();
    } else {
      if (this.store.length === this.max) {
        return event.preventDefault();
      }
      try {
        const number = parseInt(key, 10);
        if (number) {
          this.store.push(number);
        } else {
          event.preventDefault();
        }
      } catch (error) {
        event.preventDefault();
      }
    }
    this.input.value = "";
    this.updateDisplayValue();
  }

  private drawDisplay() {
    // @ts-ignore
    this.input.style = `position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 0;`;

    // @ts-ignore
    this.input.parentElement.style = `position: relative;`;

    this.updateDisplayValue();
  }

  private updateDisplayValue() {
    this.input.parentElement.querySelector("div").innerHTML = `${Array(this.max)
      .fill("-")
      .map((item, index) => this.store[index] ?? item)
      .map(
        (value) => `
        <span style="width: calc(99.34% / ${this.max}); display: inline-block; text-align: center; font-size: 15rem;">${value}</span>
      `
      )
      .join("")}`;
  }
};

// @ts-ignore
window.DashedInput = DashedInput;
