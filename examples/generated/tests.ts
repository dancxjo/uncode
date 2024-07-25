import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("function add signature", () => {
	assertEquals(typeof add, "function")
});

Deno.test("add positive numbers", () => {
	const result = add(1, 1);
	assertEquals(result, 2)
});

Deno.test("add negative numbers", () => {
	const result = add(-1, -1);
	assertEquals(result, -2)
});

Deno.test("add positive and negative numbers", () => {
	const result = add(1, -1);
	assertEquals(result, 0)
});

Deno.test("add zero and positive numbers", () => {
	const result = add(0, 1);
	assertEquals(result, 1)
});

Deno.test("add zero and negative numbers", () => {
	const result = add(0, -1);
	assertEquals(result, -1)
});

Deno.test("add zero and zero", () => {
	const result = add(0, 0);
	assertEquals(result, 0)
});

Deno.test("add floating points", () => {
	const result = add(1.1, 1.1);
	assertEquals(result, 2.2)
});

Deno.test("add large numbers", () => {
	const result = add(100345, 100345);
	assertEquals(result, 200690)
});

Deno.test("add large negative numbers", () => {
	const result = add(-100345, -100345);
	assertEquals(result, -200690)
});

Deno.test("add large positive and negative numbers", () => {
	const result = add(100345, -100345);
	assertEquals(result, 0)
});
