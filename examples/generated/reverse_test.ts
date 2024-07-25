import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("reverseWords single sentence", () => {
	const result = reverseWords("Hello World");
	assertEquals(result, "World Hello");
});

Deno.test("reverseWords multiple sentences", () => {
	const result = reverseWords("The quick brown fox");
	assertEquals(result, "fox brown quick The");
});

