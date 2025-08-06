import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { BeneficiariesType } from 'gql/generated/graphql';
import i18next from 'i18next';
import { benficiaryMocks as mocks, modelID } from 'tests/mock/readonly';

import ReadOnlyBeneficiaries from './index';

describe('Read Only Model Plan Summary -- Beneficiaries', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/beneficiaries',
          element: <ReadOnlyBeneficiaries modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/beneficiaries`]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/beneficiaries',
          element: <ReadOnlyBeneficiaries modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/beneficiaries`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
