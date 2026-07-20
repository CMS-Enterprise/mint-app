import React from 'react';

const LINK_CANDIDATE_REGEX =
  /(?:https?:\/\/|www\.)[^\s<>"']+|mailto:[^\s<>"']+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const TRAILING_PUNCTUATION_REGEX = /[),.;:!?]+$/;

// Reject invisible/bidi formatting chars that can obscure the visible URL.
const UNSAFE_FORMAT_CHARACTER_REGEX =
  /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/;

// Reject ASCII control chars before URL parsing normalizes or ignores them.
const hasUnsafeControlCharacters = (href: string) =>
  href.split('').some(character => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });

const hasUnsafeCharacters = (href: string) =>
  hasUnsafeControlCharacters(href) || UNSAFE_FORMAT_CHARACTER_REGEX.test(href);

// Reject punycode/IDN hostnames to avoid visually deceptive homograph domains.
const hasPunycodeHostname = (hostname: string) =>
  hostname
    .toLowerCase()
    .split('.')
    .some(part => part.startsWith('xn--'));

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

  if (hasUnsafeCharacters(href)) {
    return null;
  }

  if (href.toLowerCase().startsWith('www.')) {
    href = `https://${href}`;
  } else if (EMAIL_REGEX.test(href)) {
    href = `mailto:${href}`;
  } else if (href.toLowerCase().startsWith('mailto:')) {
    const emailAddress = href.slice('mailto:'.length);

    if (!EMAIL_REGEX.test(emailAddress)) {
      return null;
    }

    href = `mailto:${emailAddress}`;
  }

  try {
    const url = new URL(href);

    if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
      return null;
    }

    if (url.protocol === 'mailto:') {
      return href;
    }

    if (url.username || url.password || hasPunycodeHostname(url.hostname)) {
      return null;
    }

    return href;
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
