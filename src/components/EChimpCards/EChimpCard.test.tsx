import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { ECHIMP_URL_SSO } from 'constants/echimp';

import EChimpCard, { EChimpCardProps, echimpUrl } from './EChimpCard';

describe('EChimpCard', () => {
  const defaultProps: EChimpCardProps = {
    id: '123',
    title: 'Echimp CR',
    crStatus: 'Open',
    emergencyCrFlag: true,
    sensitiveFlag: false,
    implementationDate: '2022-07-30T05:00:00Z',
    setShowCRorTDLWithId: () => {},
    setIsSidepanelOpen: () => {},
    isCR: true
  };

  it('renders without errors', async () => {
    const { asFragment } = render(<EChimpCard {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Echimp CR')).toBeInTheDocument();
      expect(screen.getByTestId('emergency__cr-tag')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the correct echimp url', () => {
    expect(echimpUrl('ffs', '123')).toBe(
      `${import.meta.env.VITE_ECHIMP_URL}/ffs-ui/123/cr-summary`
    );
    expect(echimpUrl('tdl', '123')).toBe(
      `${ECHIMP_URL_SSO}?sysSelect=TDL&crNum=123`
    );
    expect(echimpUrl('ffs')).toBe(ECHIMP_URL_SSO);
    expect(echimpUrl('tdl')).toBe(ECHIMP_URL_SSO);
    expect(echimpUrl()).toBe(ECHIMP_URL_SSO);
  });
});
