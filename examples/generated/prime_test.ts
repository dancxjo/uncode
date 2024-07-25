import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("isPrime number", () => {
	const result = isPrime(7);
	assertEquals(result, true);
});

Deno.test("isPrime non-prime number", () => {
	const result = isPrime(10);
	assertEquals(result, false);
});

Deno.test("isPrime edge case 2", () => {
	const result = isPrime(1);
	assertEquals(result, false);
});

Deno.test("isPrime edge case 0", () => {
	const result = isPrime(0);
	assertEquals(result, false);
});

Deno.test("isPrime edge case negative number", () => {
	const result = isPrime(-1);
	assertEquals(result, false);
});

Deno.test("isPrime large prime number", () => {
	const result = isPrime(5233);
	assertEquals(result, true);
});

Deno.test("isPrime large non-prime number", () => {
	const result = isPrime(5250);
	assertEquals(result, false);
});
