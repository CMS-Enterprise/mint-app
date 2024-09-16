import React from 'react';
import { render, screen } from '@testing-library/react';

import PageHeading from './index';

describe('Page heading component', () => {
  it('renders without errors', () => {
    render(<PageHeading>Test Heading</PageHeading>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<PageHeading>Test Heading</PageHeading>);
    expect(asFragment()).toMatchSnapshot();
  });
});
