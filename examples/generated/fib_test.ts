import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("fibonacci small", () => {
	const result = fibonacci(5);
	assertEquals(result, [0, 1, 1, 2, 3]);
});

Deno.test("fibonacci medium", () => {
	const result = fibonacci(8);
	assertEquals(result, [0, 1, 1, 2, 3, 5, 8, 13]);
});
Deno.test("edge case n is zero", () => {
	try {
		fibonacci(0);
	} catch (e) {
		assertEquals(e.message, "Cannot calculate Fibonacci sequence with n=0.");
	}
});

Deno.test("large number input", () => {
	const result = fibonacci(30);
	assertEquals(result.length, 30);
})
