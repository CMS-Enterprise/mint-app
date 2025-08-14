import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { UpdatingMTOStatus } from '.';

describe('Updating your MTO Status Article', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UpdatingMTOStatus />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
