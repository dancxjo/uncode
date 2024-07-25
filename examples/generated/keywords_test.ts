import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("extractKeywords", () => {
	const result = extractKeywords("Artificial intelligence refers to the simulation of human intelligence in machines.");
	assertEquals(result, ["Artificial intelligence","simulation","human intelligence","machines"]);
});
