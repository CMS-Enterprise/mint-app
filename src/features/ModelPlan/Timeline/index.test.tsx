import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetTimelineDocument,
  GetTimelineQuery,
  GetTimelineQueryVariables,
  ModelType,
  TaskStatus
} from 'gql/generated/graphql';

import Timeline from './index';

type GetTimelineType = GetTimelineQuery['modelPlan']['timeline'];

const timelineMockData: GetTimelineType = {
  __typename: 'PlanTimeline',
  id: '123',
  completeICIP: '2029-05-12T15:01:39.190679Z',
  clearanceStarts: '2030-06-12T15:01:39.190679Z',
  clearanceEnds: '2028-12-12T15:01:39.190679Z',
  announced: '2029-07-08T15:01:39.190679Z',
  applicationsStart: '2031-02-114T15:01:39.190679Z',
  applicationsEnd: '2031-01-23T15:01:39.190679Z',
  performancePeriodStarts: '2029-06-12T15:01:39.190679Z',
  performancePeriodEnds: '2029-012-28T15:01:39.190679Z',
  wrapUpEnds: '2030-05-08T15:01:39.190679Z',
  highLevelNote: 'High level note',
  readyForReviewByUserAccount: {
    __typename: 'UserAccount',
    commonName: 'ASDF',
    id: '000'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  createdDts: '2022-05-12T15:01:39.190679Z',
  modifiedDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const timelineData: GetTimelineQuery['modelPlan'] = {
  __typename: 'ModelPlan',
  id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
  modelName: 'My excellent plan that I just initiated',
  basics: {
    __typename: 'PlanBasics',
    id: '5c309be3-d9fd-46c4-9c70-b5860a5f7203',
    modelType: [ModelType.VOLUNTARY, ModelType.OTHER],
    modelTypeOther: 'Other model type'
  },
  timeline: timelineMockData
};

const getTimelineQuery = (
  data?: Partial<GetTimelineQuery['modelPlan']>
): MockedResponse<GetTimelineQuery, GetTimelineQueryVariables> => ({
  request: {
    query: GetTimelineDocument,
    variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
  },
  result: {
    data: {
      __typename: 'Query',
      modelPlan: { ...timelineData, ...data }
    }
  }
});

const router = createMemoryRouter(
  [
    {
      path: '/models/:modelID/collaboration-area/model-timeline',
      element: <Timeline />
    }
  ],
  {
    initialEntries: [
      '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-timeline'
    ]
  }
);

describe('Model Timeline page', () => {
  it('renders without errors and matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={[getTimelineQuery()]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(await screen.findByText('High level note')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('displays model type (empty)', async () => {
    const timelineDataWithEmptyModelType = getTimelineQuery({
      basics: {
        ...timelineData.basics,
        modelType: [],
        modelTypeOther: null
      }
    });

    render(
      <MockedProvider mocks={[timelineDataWithEmptyModelType]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Model type' })
    ).toBeInTheDocument();

    const modelTypeText = await screen.findByTestId('model-type-text');

    expect(modelTypeText).toHaveTextContent('No answer entered');
  });

  it('displays model type (comma-separated list)', async () => {
    render(
      <MockedProvider mocks={[getTimelineQuery()]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Model type' })
    ).toBeInTheDocument();

    const modelTypeText = await screen.findByTestId('model-type-text');

    expect(modelTypeText).toHaveTextContent(
      'Voluntary, Other: Other model type'
    );
  });

  it('disables application period dates when model type is mandatory', async () => {
    const timelineDataWithMandatoryModelType = getTimelineQuery({
      basics: {
        ...timelineData.basics,
        modelType: [ModelType.MANDATORY_NATIONAL]
      }
    });

    render(
      <MockedProvider mocks={[timelineDataWithMandatoryModelType]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Model type' })
    ).toBeInTheDocument();

    const applicationStartInput = screen.getByRole('textbox', {
      name: 'Application start date mm/dd/yyyy'
    });
    const applicationEndInput = screen.getByRole('textbox', {
      name: 'Application end date mm/dd/yyyy'
    });

    expect(applicationStartInput).toBeDisabled();
    expect(applicationEndInput).toBeDisabled();
  });

  it('enables application period dates when model type is not mandatory', async () => {
    render(
      <MockedProvider mocks={[getTimelineQuery()]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Model type' })
    ).toBeInTheDocument();

    const applicationStartInput = screen.getByRole('textbox', {
      name: 'Application start date mm/dd/yyyy'
    });
    const applicationEndInput = screen.getByRole('textbox', {
      name: 'Application end date mm/dd/yyyy'
    });

    expect(applicationStartInput).toBeEnabled();
    expect(applicationEndInput).toBeEnabled();
  });
});
