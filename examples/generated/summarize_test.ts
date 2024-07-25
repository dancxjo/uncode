import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("summarize simple text", () => {
	const result = summarize("Artificial intelligence refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. These machines are capable of performing tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.");
	assertEquals(result, "AI simulates human intelligence in machines for tasks like perception, speech recognition, decision-making, and translation.");
});
