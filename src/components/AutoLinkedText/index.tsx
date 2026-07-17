import React from 'react';

const LINK_CANDIDATE_REGEX =
  /(?:https?:\/\/|www\.)[^\s<>"']+|mailto:[^\s<>"']+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const TRAILING_PUNCTUATION_REGEX = /[),.;:!?]+$/;

const hasUnsafeControlCharacters = (href: string) =>
  href.split('').some(character => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });

const splitTrailingPunctuation = (candidate: string) => {
  const punctuation = candidate.match(TRAILING_PUNCTUATION_REGEX)?.[0] || '';

  if (!punctuation) {
    return { linkedText: candidate, trailingText: '' };
  }

  return {
    linkedText: candidate.slice(0, -punctuation.length),
    trailingText: punctuation
  };
};

export const getSafeHref = (linkedText: string): string | null => {
  let href = linkedText;

  if (hasUnsafeControlCharacters(href)) {
    return null;
  }

  if (href.toLowerCase().startsWith('www.')) {
    href = `https://${href}`;
  } else if (EMAIL_REGEX.test(href)) {
    href = `mailto:${href}`;
  }

  try {
    const url = new URL(href);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
};

export const getLinkedTextNodes = (text: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  text.replace(LINK_CANDIDATE_REGEX, (candidate, index) => {
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    const { linkedText, trailingText } = splitTrailingPunctuation(candidate);
    const href = getSafeHref(linkedText);

    if (href) {
      nodes.push(
        <a
          href={href}
          key={`${href}-${index}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkedText}
        </a>
      );
    } else {
      nodes.push(linkedText);
    }

    if (trailingText) {
      nodes.push(trailingText);
    }

    lastIndex = index + candidate.length;
    return candidate;
  });

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const AutoLinkedText = ({ text }: { text: string }) => {
  return <>{getLinkedTextNodes(text)}</>;
};

export default AutoLinkedText;
