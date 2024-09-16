import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TextAreaField from './index';

describe('The Text Area Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    name: 'Demo TextArea',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('renders without crashing', () => {
    render(<TextAreaField {...requiredProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    const fixture = 'Demo Label';
    render(<TextAreaField {...requiredProps} label={fixture} />);
    expect(screen.getByLabelText(fixture)).toBeInTheDocument();
  });

  it('triggers onChange', () => {
    const event = {
      target: {
        value: 'Hello'
      }
    };
    const mock = vi.fn();
    render(<TextAreaField {...requiredProps} onChange={mock} />);
    fireEvent.change(screen.getByRole('textbox'), event);
    expect(mock).toHaveBeenCalled();
  });
});
