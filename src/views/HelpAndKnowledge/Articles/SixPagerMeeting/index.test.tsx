import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import SixPagerMeeting from './index';

describe('SixPagerMeeting', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SixPagerMeeting />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
