import React from 'react';
import { render, screen } from '@testing-library/react';

import { RadioField } from './index';

describe('The Radio Field', () => {
  it('renders without crashing', () => {
    render(
      <RadioField
        id="TestRadio"
        label="A"
        name="Question1"
        onBlur={() => {}}
        onChange={() => {}}
        value="A"
      />
    );
    expect(screen.getByLabelText('A')).toBeInTheDocument();
  });

  it('has the correct value', () => {
    const fixture = 'A';
    render(
      <RadioField
        id="TestRadio"
        label="A"
        name="Question1"
        onBlur={() => {}}
        onChange={() => {}}
        value={fixture}
      />
    );

    const input = screen.getByLabelText('A') as HTMLInputElement;
    expect(input.value).toEqual(fixture);
  });
});
