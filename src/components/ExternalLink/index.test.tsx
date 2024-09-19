import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';

import ExternalLink from './index';

describe('ExternalLink', () => {
  const defaultProps = {
    href: 'https://example.com',
    children: 'Click me'
  };

  it('renders without crashing', () => {
    render(<ExternalLink {...defaultProps} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('opens and closes the modal', () => {
    render(<ExternalLink {...defaultProps} />);

    const linkElement = screen.getByText('Click me');

    fireEvent.click(linkElement);

    expect(
      screen.getByText(i18next.t('externalLinkModal:heading'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent === i18next.t('externalLinkModal:description')
      )
    ).toBeInTheDocument();

    const closeButton = screen.getByText(i18next.t('externalLinkModal:leave'));
    fireEvent.click(closeButton);

    expect(
      screen.queryByText(i18next.t('externalLinkModal:heading'))
    ).not.toBeInTheDocument();
  });

  it('has correct link attributes', () => {
    render(<ExternalLink {...defaultProps} />);

    const linkElement = screen.getByText('Click me');

    fireEvent.click(linkElement);

    const externalLink = screen.getByText(i18next.t('externalLinkModal:leave'));

    expect(externalLink).toHaveAttribute('href', 'https://example.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
