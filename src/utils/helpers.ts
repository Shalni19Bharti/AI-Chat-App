export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export const downloadJSON = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateChatTitle = (firstMessage: string, maxLength: number = 50): string => {
  if (!firstMessage || firstMessage.trim().length === 0) {
    return 'New Chat';
  }

  let cleaned = firstMessage.trim();

  const prefixes = [
    /^(can you|could you|would you|will you)\s+/i,
    /^(how do i|how can i|how to|how does)\s+/i,
    /^(what is|what are|what does|what do)\s+/i,
    /^(explain|tell me about|describe|show me)\s+/i,
    /^(please|pls)\s+/i,
    /^(help me|help with)\s+/i,
  ];

  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, '');
  }

  cleaned = cleaned.trim();

  if (cleaned.length === 0) {
    cleaned = firstMessage.trim();
  }

  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength - 10 && lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};