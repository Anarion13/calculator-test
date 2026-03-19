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

// --- Mode toggle tests ---

test("starts in basic mode", () => {
  const calculator = new Calculator();
  assert.equal(calculator.mode, "basic");
});

test("toggleMode switches between basic and scientific", () => {
  const calculator = new Calculator();

  assert.equal(calculator.toggleMode(), "scientific");
  assert.equal(calculator.mode, "scientific");

  assert.equal(calculator.toggleMode(), "basic");
  assert.equal(calculator.mode, "basic");
});

// --- Scientific function tests ---

test("sin computes sine of a value in radians", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.sin();
  assert.equal(calculator.getDisplayValue(), "0");

  calculator.clear();
  calculator.inputDigit("1");
  calculator.sin();
  const sinResult = Number(calculator.getDisplayValue());
  assert.ok(Math.abs(sinResult - Math.sin(1)) < 1e-8);
});

test("cos computes cosine of a value in radians", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.cos();
  assert.equal(calculator.getDisplayValue(), "1");
});

test("tan computes tangent of a value in radians", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.tan();
  assert.equal(calculator.getDisplayValue(), "0");
});

test("ln computes natural logarithm", () => {
  const calculator = new Calculator();
  calculator.inputDigit("1");
  calculator.ln();
  assert.equal(calculator.getDisplayValue(), "0");
});

test("ln returns error for zero or negative values", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.ln();
  assert.equal(calculator.getDisplayValue(), "Error");

  calculator.clear();
  calculator.inputDigit("5");
  calculator.toggleSign();
  calculator.ln();
  assert.equal(calculator.getDisplayValue(), "Error");
});

test("log computes base-10 logarithm", () => {
  const calculator = new Calculator();
  calculator.inputDigit("1");
  calculator.inputDigit("0");
  calculator.inputDigit("0");
  calculator.log();
  assert.equal(calculator.getDisplayValue(), "2");
});

test("log returns error for zero or negative values", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.log();
  assert.equal(calculator.getDisplayValue(), "Error");
});

test("sqrt computes square root", () => {
  const calculator = new Calculator();
  calculator.inputDigit("9");
  calculator.sqrt();
  assert.equal(calculator.getDisplayValue(), "3");
});

test("sqrt returns error for negative values", () => {
  const calculator = new Calculator();
  calculator.inputDigit("4");
  calculator.toggleSign();
  calculator.sqrt();
  assert.equal(calculator.getDisplayValue(), "Error");
});

test("square computes the square of a value", () => {
  const calculator = new Calculator();
  calculator.inputDigit("7");
  calculator.square();
  assert.equal(calculator.getDisplayValue(), "49");
});

test("reciprocal computes 1/x", () => {
  const calculator = new Calculator();
  calculator.inputDigit("4");
  calculator.reciprocal();
  assert.equal(calculator.getDisplayValue(), "0.25");
});

test("reciprocal of zero returns error", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.reciprocal();
  assert.equal(calculator.getDisplayValue(), "Error");
});

test("factorial computes n!", () => {
  const calculator = new Calculator();
  calculator.inputDigit("5");
  calculator.factorial();
  assert.equal(calculator.getDisplayValue(), "120");
});

test("factorial of zero is 1", () => {
  const calculator = new Calculator();
  calculator.inputDigit("0");
  calculator.factorial();
  assert.equal(calculator.getDisplayValue(), "1");
});

test("factorial returns error for negative numbers", () => {
  const calculator = new Calculator();
  calculator.inputDigit("3");
  calculator.toggleSign();
  calculator.factorial();
  assert.equal(calculator.getDisplayValue(), "Error");
});

test("factorial returns error for non-integer values", () => {
  const calculator = new Calculator();
  calculator.inputDigit("3");
  calculator.inputDecimal();
  calculator.inputDigit("5");
  calculator.factorial();
  assert.equal(calculator.getDisplayValue(), "Error");
});

test("insertConstant pi inserts pi value", () => {
  const calculator = new Calculator();
  calculator.insertConstant("pi");
  const piResult = Number(calculator.getDisplayValue());
  assert.ok(Math.abs(piResult - Math.PI) < 1e-8);
});

test("insertConstant e inserts Euler's number", () => {
  const calculator = new Calculator();
  calculator.insertConstant("e");
  const eResult = Number(calculator.getDisplayValue());
  assert.ok(Math.abs(eResult - Math.E) < 1e-8);
});

test("power raises x to the y", () => {
  const calculator = new Calculator();
  calculator.inputDigit("2");
  calculator.power();
  calculator.inputDigit("8");
  calculator.evaluate();
  assert.equal(calculator.getDisplayValue(), "256");
});

test("scientific functions update history text", () => {
  const calculator = new Calculator();
  calculator.inputDigit("9");
  calculator.sqrt();
  assert.equal(calculator.getHistory(), "\u221a(9)");
});

test("scientific function result can be used in further calculations", () => {
  const calculator = new Calculator();
  calculator.inputDigit("9");
  calculator.sqrt();
  calculator.chooseOperator("+");
  calculator.inputDigit("1");
  calculator.evaluate();
  assert.equal(calculator.getDisplayValue(), "4");
});
