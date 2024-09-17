import React from 'react';
import { render, screen } from '@testing-library/react';

import Label from './index';

describe('The Label component', () => {
  it('renders without crashing', () => {
    render(<Label htmlFor="test">Test</Label>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('displays children (text)', () => {
    render(<Label htmlFor="test">Test</Label>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('displays children (HTML)', () => {
    render(
      <Label htmlFor="test">
        <div data-testid="label-child">Hi</div>
      </Label>
    );
    expect(screen.getByTestId('label-child')).toBeInTheDocument();
  });

  it('renders an aria-label', () => {
    render(
      <Label htmlFor="test" aria-label="aria test">
        Test
      </Label>
    );
    expect(screen.getByLabelText('aria test')).toBeInTheDocument();
  });
});
