function analyzeSentiment(text: string): string {
  if (text.includes("love")) {
    return "Positive";
  } else if (text.includes("not happy") || text.includes("unhappy")) {
    return "Negative";
  } else {
    return "Neutral";
  }
}
