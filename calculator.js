const MAX_DIGITS = 12;

function normalizeNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  return Number.parseFloat(value.toFixed(10)).toString();
}

function trimDisplay(value) {
  if (value === "Error") {
    return value;
  }

  if (value.length <= MAX_DIGITS) {
    return value;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Error";
  }

  return numericValue.toExponential(6);
}

export class Calculator {
  constructor() {
    this.mode = "basic";
    this.clear();
  }

  clear() {
    this.currentValue = "0";
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.historyText = "0";
  }

  toggleMode() {
    this.mode = this.mode === "basic" ? "scientific" : "basic";
    return this.mode;
  }

  applyUnaryFunction(name, fn) {
    this.resetAfterError();
    const value = Number(this.currentValue);
    const result = fn(value);
    const displayInput = trimDisplay(this.currentValue);
    this.currentValue = normalizeNumber(result);
    this.historyText = `${name}(${displayInput})`;
    this.justEvaluated = true;
    this.waitingForOperand = false;
  }

  sin() {
    this.applyUnaryFunction("sin", Math.sin);
  }

  cos() {
    this.applyUnaryFunction("cos", Math.cos);
  }

  tan() {
    this.applyUnaryFunction("tan", Math.tan);
  }

  ln() {
    this.applyUnaryFunction("ln", (v) => (v <= 0 ? NaN : Math.log(v)));
  }

  log() {
    this.applyUnaryFunction("log", (v) => (v <= 0 ? NaN : Math.log10(v)));
  }

  sqrt() {
    this.applyUnaryFunction("\u221a", (v) => (v < 0 ? NaN : Math.sqrt(v)));
  }

  square() {
    this.applyUnaryFunction("sqr", (v) => v * v);
  }

  reciprocal() {
    this.applyUnaryFunction("1/", (v) => (v === 0 ? Infinity : 1 / v));
  }

  factorial() {
    this.resetAfterError();
    const value = Number(this.currentValue);
    const displayInput = trimDisplay(this.currentValue);

    if (!Number.isInteger(value) || value < 0 || value > 170) {
      this.currentValue = "Error";
      this.historyText = `fact(${displayInput})`;
      this.justEvaluated = true;
      return;
    }

    let result = 1;
    for (let i = 2; i <= value; i++) {
      result *= i;
    }
    this.currentValue = normalizeNumber(result);
    this.historyText = `fact(${displayInput})`;
    this.justEvaluated = true;
    this.waitingForOperand = false;
  }

  insertConstant(name) {
    this.resetAfterError();
    const value = name === "pi" ? Math.PI : Math.E;
    this.currentValue = normalizeNumber(value);
    this.historyText = name === "pi" ? "\u03c0" : "e";
    this.justEvaluated = true;
    this.waitingForOperand = false;
  }

  power() {
    this.resetAfterError();
    this.chooseOperator("^");
  }

  resetAfterError() {
    if (this.currentValue === "Error") {
      this.clear();
    }
  }

  inputDigit(digit) {
    this.resetAfterError();

    if (this.waitingForOperand || this.justEvaluated) {
      this.currentValue = digit;
      this.waitingForOperand = false;
      this.justEvaluated = false;
      if (this.previousValue === null && this.operator === null) {
        this.historyText = "0";
      }
      return;
    }

    this.currentValue = this.currentValue === "0" ? digit : this.currentValue + digit;
  }

  inputDecimal() {
    this.resetAfterError();

    if (this.waitingForOperand || this.justEvaluated) {
      this.currentValue = "0.";
      this.waitingForOperand = false;
      this.justEvaluated = false;
      if (this.previousValue === null && this.operator === null) {
        this.historyText = "0";
      }
      return;
    }

    if (!this.currentValue.includes(".")) {
      this.currentValue += ".";
    }
  }

  toggleSign() {
    this.resetAfterError();

    if (this.currentValue === "0") {
      return;
    }

    this.currentValue = this.currentValue.startsWith("-")
      ? this.currentValue.slice(1)
      : `-${this.currentValue}`;
  }

  percentage() {
    this.resetAfterError();

    this.currentValue = normalizeNumber(Number(this.currentValue) / 100);
    this.justEvaluated = false;
    if (this.operator === null) {
      this.historyText = trimDisplay(this.currentValue);
    }
  }

  deleteDigit() {
    this.resetAfterError();

    if (this.waitingForOperand || this.justEvaluated) {
      return;
    }

    if (this.currentValue.length <= 1 || this.currentValue === "-0") {
      this.currentValue = "0";
      return;
    }

    this.currentValue = this.currentValue.slice(0, -1);

    if (this.currentValue === "-" || this.currentValue === "") {
      this.currentValue = "0";
    }
  }

  chooseOperator(nextOperator) {
    this.resetAfterError();

    const inputValue = Number(this.currentValue);

    if (this.previousValue === null) {
      this.previousValue = inputValue;
    } else if (this.operator && !this.waitingForOperand) {
      const result = this.compute(this.previousValue, inputValue, this.operator);

      if (result === "Error") {
        this.currentValue = result;
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.justEvaluated = true;
        this.historyText = "Calculation error";
        return;
      }

      this.previousValue = Number(result);
      this.currentValue = result;
    }

    this.operator = nextOperator;
    this.waitingForOperand = true;
    this.justEvaluated = false;
    this.historyText = `${trimDisplay(this.previousValue.toString())} ${this.operator}`;
  }

  evaluate() {
    this.resetAfterError();

    if (this.operator === null || this.previousValue === null || this.waitingForOperand) {
      return;
    }

    const leftOperand = trimDisplay(this.previousValue.toString());
    const rightOperand = trimDisplay(this.currentValue);
    const operation = this.operator;
    const result = this.compute(this.previousValue, Number(this.currentValue), this.operator);
    this.currentValue = result;
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = true;
    this.historyText = result === "Error" ? "Calculation error" : `${leftOperand} ${operation} ${rightOperand} =`;
  }

  compute(leftOperand, rightOperand, operator) {
    switch (operator) {
      case "+":
        return normalizeNumber(leftOperand + rightOperand);
      case "-":
        return normalizeNumber(leftOperand - rightOperand);
      case "*":
        return normalizeNumber(leftOperand * rightOperand);
      case "/":
        if (rightOperand === 0) {
          return "Error";
        }
        return normalizeNumber(leftOperand / rightOperand);
      case "^":
        return normalizeNumber(Math.pow(leftOperand, rightOperand));
      default:
        return normalizeNumber(rightOperand);
    }
  }

  getHistory() {
    return this.historyText;
  }

  getDisplayValue() {
    return trimDisplay(this.currentValue);
  }
}
