import React from 'react';
import { render, screen } from '@testing-library/react';

import FieldErrorMsg from './index';

describe('The FieldErrorMsg component', () => {
  it('renders without crashing', () => {
    render(<FieldErrorMsg>Error</FieldErrorMsg>);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('can render nothing', () => {
    const { container } = render(<FieldErrorMsg />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a message', () => {
    render(
      <FieldErrorMsg>
        <span id="testtest" />
      </FieldErrorMsg>
    );
    expect(screen.getByTestId('testtest')).toBeInTheDocument();
  });
});
