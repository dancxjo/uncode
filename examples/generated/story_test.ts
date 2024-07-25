import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("generateStory with magical forest prompt", () => {
	const result = generateStory("Once upon a time in a magical forest");
	assertEquals(result, "Once upon a time in a magical forest, there lived a young girl named Lily who had the ability to talk to animals. Every day, she would embark on adventures with her animal friends, exploring the enchanting woods and discovering hidden secrets.");
});
