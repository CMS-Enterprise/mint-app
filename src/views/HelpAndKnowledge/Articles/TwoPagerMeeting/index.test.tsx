import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import TwoPagerMeeting from './index';

describe('TwoPagerMeeting', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TwoPagerMeeting />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
