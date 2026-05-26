import React from 'react';
import { render } from '@testing-library/react';

import { SuggestedWaivers } from '../../MedicarePaymentWaivers';

import SelectedWaiversSection from './index';

const MOCK_ALL_WAIVERS: SuggestedWaivers = [
  {
    __typename: 'SuggestedWaiver',
    id: '123',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'super long survey name Waiver 1'
    }
  },
  {
    __typename: 'SuggestedWaiver',
    id: '456',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'short Waiver 2'
    }
  },
  {
    __typename: 'SuggestedWaiver',
    id: '789',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'Waiver 3'
    }
  }
];

const MOCK_SELECTED_WAIVERS: SuggestedWaivers = [
  {
    __typename: 'SuggestedWaiver',
    id: '456',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'short Waiver 2'
    }
  },
  {
    __typename: 'SuggestedWaiver',
    id: '789',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'Waiver 3'
    }
  }
];

describe('SelectedWaiversSection Component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <SelectedWaiversSection
        allWaivers={MOCK_ALL_WAIVERS}
        selectedWaivers={MOCK_SELECTED_WAIVERS}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
