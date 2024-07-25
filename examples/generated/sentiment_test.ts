import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("analyzeSentiment positive text", () => {
	const result = analyzeSentiment(['I love the new design of your website!']);
	assertEquals(result, 'Positive');
});

Deno.test("analyzeSentiment negative text", () => {
	const result = analyzeSentiment(['I am not happy with the service provided.']);
	assertEquals(result, 'Negative');
});

Deno.test("analyzeSentiment neutral text", () => {
	const result = analyzeSentiment(['The weather is okay today.']);
	assertEquals(result, 'Neutral');
});

Deno.test("analyzeSentiment multiple sentences", () => {
	const result = analyzeSentiment(['I love the new design of your website!', 'The service was good.']);
	assertEquals(result, 'Positive');
});

Deno.test("analyzeSentiment with emojis", () => {
	const result = analyzeSentiment(['😊 I am very happy!']);
	assertEquals(result, 'Positive');
});

Deno.test("analyzeSentiment with slang", () => {
	const result = analyzeSentiment(['Yaas! That new restaurant is lit!']);
	assertEquals(result, 'Positive');
});

