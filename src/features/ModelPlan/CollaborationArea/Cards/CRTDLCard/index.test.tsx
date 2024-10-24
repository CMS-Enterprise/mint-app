import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import CRTDLCard, { CRTDLType } from './index';

const mockCrtdls: CRTDLType[] = [
  { id: 'crtdl1', __typename: 'EChimpCR' },
  { id: 'crtdl2', __typename: 'EChimpTDL' }
];

describe('CRTDLCard', () => {
  it('renders the card with the correct heading', () => {
    render(
      <Router>
        <CRTDLCard crtdls={mockCrtdls} modelID="model123" />
      </Router>
    );

    expect(
      screen.getByText(i18next.t('collaborationArea:crtdlsCard.heading'))
    ).toBeInTheDocument();
  });

  it('displays a message when there are no crtdls', () => {
    render(
      <Router>
        <CRTDLCard crtdls={[]} modelID="model123" />
      </Router>
    );

    expect(
      screen.getByText(i18next.t('collaborationArea:crtdlsCard.noCrtdls'))
    ).toBeInTheDocument();
  });

  it('displays a list of crtdls when they are present', () => {
    render(
      <Router>
        <CRTDLCard crtdls={mockCrtdls} modelID="model123" />
      </Router>
    );

    expect(screen.getByText('crtdl1, crtdl2')).toBeInTheDocument();
  });

  it('renders the "View All" button when crtdls are present', () => {
    render(
      <Router>
        <CRTDLCard crtdls={mockCrtdls} modelID="model123" />
      </Router>
    );

    expect(
      screen.getByText(i18next.t('collaborationArea:crtdlsCard.viewAll'))
    ).toBeInTheDocument();
  });

  it('does not render the "View All" button when there are no crtdls', () => {
    render(
      <Router>
        <CRTDLCard crtdls={[]} modelID="model123" />
      </Router>
    );

    expect(
      screen.queryByText(i18next.t('collaborationArea:crtdlsCard.viewAll'))
    ).not.toBeInTheDocument();
  });
});
