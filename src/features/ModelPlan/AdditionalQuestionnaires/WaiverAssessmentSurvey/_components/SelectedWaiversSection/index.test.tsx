import React from 'react';
import { render } from '@testing-library/react';

import SelectedWaiversSection from './index';

describe('SelectedWaiversSection Component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<SelectedWaiversSection allWaivers={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
