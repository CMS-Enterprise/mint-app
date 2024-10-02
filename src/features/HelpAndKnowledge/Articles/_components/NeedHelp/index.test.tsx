import React from 'react';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import NeedHelp from './index';

describe('NeedHelp', () => {
  it('renders the SummaryBox with the correct heading', () => {
    render(<NeedHelp />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      i18next.t('sixPageMeeting:footerSummaryBox.title')
    );
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<NeedHelp />);

    expect(asFragment).toMatchSnapshot();
  });
});
