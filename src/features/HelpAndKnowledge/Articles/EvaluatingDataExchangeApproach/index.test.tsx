import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import EvaluatingDataExchangeApproach from './index';

describe('SixPagerMeeting', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <EvaluatingDataExchangeApproach />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
