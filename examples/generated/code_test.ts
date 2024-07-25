import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("writeSourceCodeForFunction positive numbers", () => {
	const result = writeSourceCodeForFunction(/// Adds two numbers\nfunction add(a: number, b: number): number;\nassert [1,1] == 2);
	assertEquals(result, function add(a: number, b: number): number {\n  return a + b;\n});
});

Deno.test("writeSourceCodeForFunction negative numbers", () => {
	const result = writeSourceCodeForFunction(/// Negative numbers\nfunction subtract(a: number, b: number): number;\nassert [1,-1] == 0);
	assertEquals(result, function subtract(a: number, b: number): number {\n  return a - b;\n});
});

Deno.test("writeSourceCodeForFunction zero and positive numbers", () => {
	const result = writeSourceCodeForFunction(/// Zero and positive numbers\nfunction multiply(a: number, b: number): number;\nassert [0,1] == 0);
	assertEquals(result, function multiply(a: number, b: number): number {\n  return a * b;\n});
});
Deno.test("writeSourceCodeForFunction zero and negative numbers", () => {
	const result = writeSourceCodeForFunction(/// Zero and negative numbers\nfunction divide(a: number, b: number): number;\nassert [0,-1] == 0);
	assertEquals(result, function divide(a: number, b: number): number {\n  return a / b;\n});
});
Deno.test("writeSourceCodeForFunction zero and zero", () => {
	const result = writeSourceCodeForFunction(/// Zero and zero\nfunction remainder(a: number, b: number): number;\nassert [0,0] == 0);
	assertEquals(result, function remainder(a: number, b: number): number {\n  return a % b;\n});
});
