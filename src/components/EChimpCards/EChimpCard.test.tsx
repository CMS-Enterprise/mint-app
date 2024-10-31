import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import EChimpCard, { EChimpCardProps } from './EChimpCard';

describe('EChimpCard', () => {
  const defaultProps: EChimpCardProps = {
    id: '123',
    title: 'Echimp CR',
    crStatus: 'Open',
    emergencyCrFlag: true,
    sensitiveFlag: false,
    implementationDate: '2022-07-30T05:00:00Z',
    setShowCRorTDLWithId: () => {},
    setIsSidepanelOpen: () => {}
  };

  it('renders without errors', async () => {
    const { asFragment } = render(<EChimpCard {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Echimp CR')).toBeInTheDocument();
      expect(screen.getByTestId('emergency__cr-tag')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
