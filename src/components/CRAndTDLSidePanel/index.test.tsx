import React from 'react';
import { render, screen } from '@testing-library/react';

import CRAndTDLSidePanel from './index';

describe('The CRAndTDLSidePanel component', () => {
  it('renders TDL without crashing', () => {
    const { asFragment } = render(
      <CRAndTDLSidePanel
        isCR={false}
        id="abc123"
        title="Test Title"
        issuedDate="2023"
      />
    );
    expect(screen.getByText('abc123')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('View this in ECHIMP')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
