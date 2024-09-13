import React from 'react';
import { render, screen } from '@testing-library/react';

import CheckboxField from './index';

describe('The Checkbox Field component', () => {
  it('renders without crashing', () => {
    render(
      <CheckboxField
        id="TestTextbox"
        label="Test Textbox"
        name="Test"
        onChange={() => {}}
        onBlur={() => {}}
        value="Test"
      />
    );
    expect(screen.getByLabelText('Test Textbox')).toBeInTheDocument();
  });

  it('has the correct value', () => {
    const fixture = 'Test';
    render(
      <CheckboxField
        id="TestTextbox"
        label="Test Textbox"
        name="Test"
        onChange={() => {}}
        onBlur={() => {}}
        value={fixture}
      />
    );
    expect(screen.getByLabelText('Test Textbox')).toHaveValue(fixture);
  });
});
