import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { BeneficiariesType } from 'gql/generated/graphql';
import i18next from 'i18next';
import Sinon from 'sinon';
import { benficiaryMocks as mocks, modelID } from 'tests/mock/readonly';

import ReadOnlyBeneficiaries from './index';

describe('Read Only Model Plan Summary -- Beneficiaries', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

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
          i18next.t<string, {}, string>(
            `beneficiaries:beneficiaries.options.${BeneficiariesType.DISEASE_SPECIFIC}`
          )
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
          i18next.t<string, {}, string>(
            `beneficiaries:beneficiaries.options.${BeneficiariesType.DISEASE_SPECIFIC}`
          )
        )
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});