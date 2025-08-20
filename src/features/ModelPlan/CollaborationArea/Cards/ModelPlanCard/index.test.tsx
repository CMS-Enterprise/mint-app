import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import { collaborationAreaData } from 'tests/mock/general';
import setup from 'tests/util';

import ModelPlanCard, { getLastModifiedSection } from './index';

const modelID: string = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const modelPlan = collaborationAreaData;

describe('ModelPlanCard', () => {
  it('renders without issues', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <ModelPlanCard
              modelID={modelID}
              modelPlan={modelPlan}
              setStatusMessage={() => null}
            />
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/collaboration-area`]
      }
    );

    const { getByText } = setup(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(getByText('Model Plan')).toBeInTheDocument();
    });
  });

  it('returns null if no section of task list is started', () => {
    const result = getLastModifiedSection(modelPlan);
    expect(result).toBeUndefined();
  });

  it('returns most recent task list section', () => {
    const startedModelPlan = { ...modelPlan };

    startedModelPlan.beneficiaries.modifiedDts = '2021-05-12T15:01:39.190679Z';
    startedModelPlan.beneficiaries.modifiedByUserAccount = {
      __typename: 'UserAccount',
      commonName: 'Jane Doe'
    };

    startedModelPlan.generalCharacteristics.modifiedDts =
      '2022-05-12T15:01:39.190679Z';
    startedModelPlan.generalCharacteristics.modifiedByUserAccount = {
      __typename: 'UserAccount',
      commonName: 'John Doe'
    };

    const result = getLastModifiedSection(startedModelPlan);
    expect(result).toEqual(startedModelPlan.generalCharacteristics);
  });

  it('matches the snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <ModelPlanCard
              modelID={modelID}
              modelPlan={modelPlan}
              setStatusMessage={() => null}
            />
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/collaboration-area`]
      }
    );

    const { getByText, queryByText, asFragment } = setup(
      <RouterProvider router={router} />
    );

    await waitFor(() => {
      expect(getByText('Model Plan')).toBeInTheDocument();
      expect(
        queryByText('Most recent edit on 05/12/2022 by')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
