import React from 'react';
import { render, screen } from '@testing-library/react';

import { ErrorAlert, ErrorAlertMessage } from './index';

describe('The ErrorAlert component', () => {
  beforeEach(() => {
    render(
      <ErrorAlert heading="test heading">
        <ErrorAlertMessage message="Message 1" errorKey="Error 1" />
        <ErrorAlertMessage message="Message 2" errorKey="Error 2" />
        <ErrorAlertMessage message="Message 3" errorKey="Error 3" />
        <ErrorAlertMessage message="Message 4" errorKey="Error 4" />
        <ErrorAlertMessage message="Message 5" errorKey="Error 5" />
      </ErrorAlert>
    );
  });

  it('renders a heading', () => {
    expect(
      screen.getByRole('heading', { name: /test heading/i })
    ).toBeInTheDocument();
  });

  it('renders children', () => {
    const messages = screen.getAllByText(/Message \d/);
    expect(messages).toHaveLength(5);
  });
});
