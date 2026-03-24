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

  sqrt() {
    this.resetAfterError();

    const n = Number(this.currentValue);

    if (n < 0) {
      this.currentValue = "Error";
      this.previousValue = null;
      this.operator = null;
      this.waitingForOperand = false;
      this.justEvaluated = true;
      this.historyText = "Calculation error";
      return;
    }

    this.currentValue = normalizeNumber(Math.sqrt(n));
    this.justEvaluated = false;
    if (this.operator === null) {
      this.historyText = trimDisplay(this.currentValue);
    }
  }

  square() {
    this.resetAfterError();

    const n = Number(this.currentValue);
    this.currentValue = normalizeNumber(n * n);
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
