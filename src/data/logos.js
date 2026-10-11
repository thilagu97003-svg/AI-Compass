const domains = {
  chatgpt: 'chatgpt.com',
  claude: 'claude.ai',
  gemini: 'gemini.google.com',
  perplexity: 'perplexity.ai',
  cursor: 'cursor.com',
  copilot: 'github.com',
  metaai: 'meta.ai',
  lovable: 'lovable.dev',
};

export function logoUrl(id) {
  const d = domains[id];
  return d ? `https://www.google.com/s2/favicons?domain=${d}&sz=128` : null;
}