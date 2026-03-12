import test from "node:test";
import assert from "node:assert/strict";

import { Calculator } from "../calculator.js";

test("performs chained addition and multiplication", () => {
  const calculator = new Calculator();

  calculator.inputDigit("1");
  calculator.inputDigit("2");
  calculator.chooseOperator("+");
  calculator.inputDigit("7");
  calculator.chooseOperator("*");
  calculator.inputDigit("3");
  calculator.evaluate();

  assert.equal(calculator.getDisplayValue(), "57");
});

test("supports decimal input and division", () => {
  const calculator = new Calculator();

  calculator.inputDigit("7");
  calculator.inputDecimal();
  calculator.inputDigit("5");
  calculator.chooseOperator("/");
  calculator.inputDigit("2");
  calculator.evaluate();

  assert.equal(calculator.getDisplayValue(), "3.75");
});

test("returns an error when dividing by zero", () => {
  const calculator = new Calculator();

  calculator.inputDigit("9");
  calculator.chooseOperator("/");
  calculator.inputDigit("0");
  calculator.evaluate();

  assert.equal(calculator.getDisplayValue(), "Error");
});

test("can toggle sign and convert to percentage", () => {
  const calculator = new Calculator();

  calculator.inputDigit("5");
  calculator.inputDigit("0");
  calculator.toggleSign();
  calculator.percentage();

  assert.equal(calculator.getDisplayValue(), "-0.5");
});

test("supports deleting digits before evaluation", () => {
  const calculator = new Calculator();

  calculator.inputDigit("8");
  calculator.inputDigit("9");
  calculator.deleteDigit();

  assert.equal(calculator.getDisplayValue(), "8");
});
