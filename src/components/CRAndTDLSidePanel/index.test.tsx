import React from 'react';
import { render, screen } from '@testing-library/react';

import CRAndTDLSidePanel from './index';

describe('The CRAndTDLSidePanel component', () => {
  it('renders TDL without crashing (flag disabled)', () => {
    const { asFragment } = render(
      <CRAndTDLSidePanel
        isCR={false}
        id="abc123"
        title="Test Title"
        status="Test Status"
        issuedDate="2023"
      />
    );
    expect(screen.getByText('abc123')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Status')).toBeInTheDocument();
    expect(screen.queryByText('View this in ECHIMP')).not.toBeInTheDocument(); // TODO Clean up / remove in https://jiraent.cms.gov/browse/MINT-3134
    expect(asFragment()).toMatchSnapshot();
  });
});
