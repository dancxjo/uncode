import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
Deno.test("isPalindrome string with letters and numbers", () => {
	const result = isPalindrome('racecar');
	assertEquals(result, true);
});

Deno.test("isPalindrome string with only letters", () => {
	const result = isPalindrome('hello');
	assertEquals(result, false);
});

Deno.test("isPalindrome string with special characters and spaces", () => {
	const result = isPalindrome('A man. A plan. A canal. Panama!');
	assertEquals(result, true);
});
