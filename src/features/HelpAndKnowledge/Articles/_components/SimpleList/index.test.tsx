import React from 'react';
import { render, screen } from '@testing-library/react';

import SimpleList from './index';

describe('SimpleList', () => {
  const mockHeading = 'Test Heading';
  const mockList = ['Item 1', 'Item 2', 'Item 3'];

  it('renders the heading correctly', () => {
    render(<SimpleList heading={mockHeading} list={mockList} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      mockHeading
    );
  });

  it('renders the list items correctly', () => {
    render(<SimpleList heading={mockHeading} list={mockList} />);

    mockList.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
