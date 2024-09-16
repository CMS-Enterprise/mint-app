import React from 'react';
import { render, screen } from '@testing-library/react';

import HelpText from './index';

describe('The Help Text component', () => {
  it('renders without crashing', () => {
    render(<HelpText>Hello!</HelpText>);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders a text child', () => {
    render(<HelpText>Test</HelpText>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders a markup', () => {
    const { container } = render(
      <HelpText>
        <div className="test-1-2-1-2" />
      </HelpText>
    );

    expect(container.getElementsByClassName('test-1-2-1-2').length).toBe(1);
  });
});
