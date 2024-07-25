function isPalindrome(s: string): boolean {
  let rev = s.toLowerCase().split('').reverse().join('');
  return s.toLowerCase() === rev;
}
