import React from 'react';
import { render, screen } from '@testing-library/react';

import { DropdownField, DropdownItem } from './index';

describe('The Dropdown Field component', () => {
  it('renders without crashing', () => {
    render(
      <DropdownField
        id="TestDropdown"
        value="Value Group"
        name="testDropdown"
        onBlur={() => {}}
        onChange={() => {}}
      >
        <DropdownItem name="Value 1" value="Value1" />
        <DropdownItem name="Value 2" value="Value2" />
      </DropdownField>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

describe('The Dropdown Item component', () => {
  it('renders without crashing', () => {
    render(<DropdownItem name="Value 1" value="Value1" />);
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });
});
