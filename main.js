import { Calculator } from "./calculator.js";

const calculator = new Calculator();
const display = document.querySelector("[data-display]");
const history = document.querySelector("[data-history]");
const buttons = document.querySelectorAll("[data-action]");
const scientificKeys = document.querySelector("[data-scientific-keys]");
const modeToggle = document.querySelector('[data-action="toggle-mode"]');
const modeLabels = document.querySelectorAll(".mode-switch__label");

function render() {
  display.textContent = calculator.getDisplayValue();
  history.textContent = calculator.getHistory();
}

function updateModeUI(mode) {
  const isScientific = mode === "scientific";
  modeToggle.setAttribute("aria-pressed", String(isScientific));

  if (isScientific) {
    scientificKeys.removeAttribute("hidden");
    requestAnimationFrame(() => {
      scientificKeys.classList.add("scientific-keys--visible");
    });
  } else {
    scientificKeys.classList.remove("scientific-keys--visible");
    scientificKeys.addEventListener("transitionend", () => {
      if (calculator.mode === "basic") {
        scientificKeys.setAttribute("hidden", "");
      }
    }, { once: true });
  }

  modeLabels[0].classList.toggle("mode-switch__label--active", !isScientific);
  modeLabels[1].classList.toggle("mode-switch__label--active", isScientific);
}

function handleAction(action, value) {
  switch (action) {
    case "digit":
      calculator.inputDigit(value);
      break;
    case "decimal":
      calculator.inputDecimal();
      break;
    case "operator":
      calculator.chooseOperator(value);
      break;
    case "equals":
      calculator.evaluate();
      break;
    case "clear":
      calculator.clear();
      break;
    case "toggle-sign":
      calculator.toggleSign();
      break;
    case "percent":
      calculator.percentage();
      break;
    case "delete":
      calculator.deleteDigit();
      break;
    case "toggle-mode": {
      const newMode = calculator.toggleMode();
      updateModeUI(newMode);
      return;
    }
    case "sin":
      calculator.sin();
      break;
    case "cos":
      calculator.cos();
      break;
    case "tan":
      calculator.tan();
      break;
    case "ln":
      calculator.ln();
      break;
    case "log":
      calculator.log();
      break;
    case "sqrt":
      calculator.sqrt();
      break;
    case "square":
      calculator.square();
      break;
    case "power":
      calculator.power();
      break;
    case "factorial":
      calculator.factorial();
      break;
    case "reciprocal":
      calculator.reciprocal();
      break;
    case "constant":
      calculator.insertConstant(value);
      break;
    default:
      break;
  }

  render();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    handleAction(button.dataset.action, button.dataset.value);
  });
});

window.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^\d$/.test(key)) {
    handleAction("digit", key);
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    handleAction("operator", key);
    return;
  }

  if (key === "." || key === ",") {
    handleAction("decimal");
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    handleAction("equals");
    return;
  }

  if (key === "Backspace") {
    handleAction("delete");
    return;
  }

  if (key === "Escape") {
    handleAction("clear");
    return;
  }

  if (key === "%") {
    handleAction("percent");
  }
});

updateModeUI("basic");
render();
