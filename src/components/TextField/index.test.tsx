import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TextField from './index';

describe('The Text Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    name: 'Demo Input',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('renders without crashing', () => {
    render(<TextField {...requiredProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('triggers onChange', () => {
    const event = {
      target: {
        value: 'Hello'
      }
    };
    const mock = vi.fn();
    render(<TextField {...requiredProps} onChange={mock} />);
    fireEvent.change(screen.getByRole('textbox'), event);
    expect(mock).toHaveBeenCalled();
  });
});
