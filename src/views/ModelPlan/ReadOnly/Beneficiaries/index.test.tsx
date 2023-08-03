import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { benficiaryMocks as mocks, modelID } from 'data/mock/readonly';
import { BeneficiariesType } from 'types/graphql-global-types';
import { translateBeneficiariesType } from 'utils/modelPlan';

import ReadOnlyBeneficiaries from './index';

describe('Read Only Model Plan Summary -- Beneficiaries', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/beneficiaries`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/beneficiaries">
            <ReadOnlyBeneficiaries modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          translateBeneficiariesType(BeneficiariesType.DISEASE_SPECIFIC)
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/beneficiaries`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/beneficiaries">
            <ReadOnlyBeneficiaries modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          translateBeneficiariesType(BeneficiariesType.DISEASE_SPECIFIC)
        )
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
