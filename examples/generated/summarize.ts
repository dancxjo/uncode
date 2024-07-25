function summarize(text: string): string {
  return text.length > 250 ? text.substring(0, 247) + '...' : text;
}
