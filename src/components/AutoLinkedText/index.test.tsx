import React from 'react';
import { render, screen } from '@testing-library/react';

import AutoLinkedText, { getSafeHref } from './index';

describe('AutoLinkedText', () => {
  it('renders http and https URLs as safe external links', () => {
    render(
      <AutoLinkedText text="Review https://www.cms.gov and http://example.com." />
    );

    expect(
      screen.getByRole('link', { name: 'https://www.cms.gov' })
    ).toHaveAttribute('href', 'https://www.cms.gov');
    expect(
      screen.getByRole('link', { name: 'http://example.com' })
    ).toHaveAttribute('href', 'http://example.com');
    expect(
      screen.getByRole('link', { name: 'http://example.com' })
    ).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('normalizes www URLs to https while preserving display text', () => {
    render(<AutoLinkedText text="Go to www.cms.gov" />);

    expect(screen.getByRole('link', { name: 'www.cms.gov' })).toHaveAttribute(
      'href',
      'https://www.cms.gov'
    );
  });

  it('renders bare email addresses as mailto links', () => {
    render(<AutoLinkedText text="Contact MINTTeam@cms.hhs.gov" />);

    expect(
      screen.getByRole('link', { name: 'MINTTeam@cms.hhs.gov' })
    ).toHaveAttribute('href', 'mailto:MINTTeam@cms.hhs.gov');
  });

  it('renders simple explicit mailto links', () => {
    render(<AutoLinkedText text="Contact mailto:MINTTeam@cms.hhs.gov" />);

    expect(
      screen.getByRole('link', { name: 'mailto:MINTTeam@cms.hhs.gov' })
    ).toHaveAttribute('href', 'mailto:MINTTeam@cms.hhs.gov');
  });

  it('leaves unsafe protocols as plain text', () => {
    render(
      <AutoLinkedText text="Bad javascript:alert(1) data:text/html,test" />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/javascript:alert\(1\)/)).toBeInTheDocument();
  });

  it('leaves mailto links with non-email payloads as plain text', () => {
    render(
      <AutoLinkedText text="Bad mailto:javascript:alert(1) mailto:user@example.com?subject=hi" />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      screen.getByText(/mailto:javascript:alert\(1\)/)
    ).toBeInTheDocument();
  });

  it('leaves URLs with username or password credentials as plain text', () => {
    render(
      <AutoLinkedText text="Bad https://cms.gov@evil.example/path https://user:pass@example.com" />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/cms\.gov@evil\.example/)).toBeInTheDocument();
  });

  it('leaves punycode and IDN hostnames as plain text', () => {
    const cyrillicSmallEs = '\u0441';

    render(
      <AutoLinkedText
        text={`Bad https://xn--ms-nmc.gov https://${cyrillicSmallEs}ms.gov`}
      />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/xn--ms-nmc\.gov/)).toBeInTheDocument();
  });

  it('does not include trailing punctuation in URL links', () => {
    render(
      <AutoLinkedText text="Review https://www.cms.gov, then continue." />
    );

    expect(
      screen.getByRole('link', { name: 'https://www.cms.gov' })
    ).toHaveAttribute('href', 'https://www.cms.gov');
    expect(screen.getByText(/, then continue\./)).toBeInTheDocument();
  });

  it('rejects hrefs with control characters', () => {
    expect(getSafeHref('https://www.cms.gov\nbad')).toBeNull();
  });

  it('rejects hrefs with unsafe unicode format characters', () => {
    expect(getSafeHref('https://www.cms.gov/\u202Ebad')).toBeNull();
  });
});
