import React from 'react';
import { render, screen } from '@testing-library/react';

import FieldGroup from './index';

describe('The FieldGroup component', () => {
  it('renders without crashing', () => {
    render(<FieldGroup>Test</FieldGroup>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <FieldGroup>
        <div data-testid="test-component" />
      </FieldGroup>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('renders the correct classes', () => {
    const { container } = render(
      <FieldGroup error>
        <div data-testid="test-component" />
      </FieldGroup>
    );

    expect(container.firstChild).toHaveClass('usa-form-group--error');
  });
});
