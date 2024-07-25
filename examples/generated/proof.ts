function correctGrammar(text: string): string {
  return text.replace(/(she|he|it|they)( ?do(es)?| is| has| have| had) (to |at |in |for |by |with )/gi, "$1$2 goes $4");
}
