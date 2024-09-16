import React from 'react';
import { render, screen } from '@testing-library/react';

import PageNumber from './index';

describe('The Page Number component', () => {
  it('renders without crashing', () => {
    render(<PageNumber currentPage={0} totalPages={0} />);
  });

  it('renders the correct page numbers', () => {
    render(<PageNumber currentPage={2} totalPages={10} />);
    expect(screen.getByText('Page 2 of 10')).toBeInTheDocument();
  });

  it('renders custom className', () => {
    const fixture = 'test-class-name';
    render(<PageNumber className={fixture} currentPage={2} totalPages={10} />);
    expect(screen.getByTestId('page-num')).toHaveClass(fixture);
  });
});
