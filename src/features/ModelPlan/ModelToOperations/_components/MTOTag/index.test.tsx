import React from 'react';
import { render, screen } from '@testing-library/react';

import MTOTag from './index';

describe('MTOTag Component', () => {
  it('renders correctly with type "draft"', () => {
    render(<MTOTag type="draft" label="Draft Tag" />);

    // Check that the label is rendered
    expect(screen.getByText('Draft Tag')).toBeInTheDocument();

    // Check that the draft icon is rendered
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders correctly with type "custom"', () => {
    render(<MTOTag type="custom" label="Custom Tag" />);

    // Check that the label is rendered
    expect(screen.getByText('Custom Tag')).toBeInTheDocument();

    // Check that the custom icon is rendered
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders without a tooltip', () => {
    render(<MTOTag type="custom" label="Custom Tag" />);

    // Check that the label is rendered
    expect(screen.getByText('Custom Tag')).toBeInTheDocument();

    // Ensure no tooltip is rendered
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
