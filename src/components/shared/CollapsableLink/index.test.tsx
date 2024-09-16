import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import CollapsableLink from './index';

describe('The Collapsable Link component', () => {
  it('renders without crashing', () => {
    render(
      <CollapsableLink id="Test" label="testLabel">
        Hello!
      </CollapsableLink>
    );
    expect(screen.getByText('testLabel')).toBeInTheDocument();
  });

  it('hides content by default', () => {
    render(
      <CollapsableLink id="Test" label="Test">
        <div data-testid="children" />
      </CollapsableLink>
    );

    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Test/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('renders children content when expanded', () => {
    render(
      <CollapsableLink id="Test" label="Test">
        <div data-testid="children" />
      </CollapsableLink>
    );

    fireEvent.click(screen.getByRole('button', { name: /Test/i }));

    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Test/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
