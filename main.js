import { Calculator } from "./calculator.js";

const calculator = new Calculator();
const display = document.querySelector("[data-display]");
const history = document.querySelector("[data-history]");
const buttons = document.querySelectorAll("[data-action]");

function render() {
  display.textContent = calculator.getDisplayValue();
  history.textContent = calculator.getHistory();
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

render();
