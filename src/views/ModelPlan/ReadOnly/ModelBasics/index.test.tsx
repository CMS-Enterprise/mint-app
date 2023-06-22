import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetAllBasics from 'queries/ReadOnly/GetAllBasics';
import { GetAllBasics_modelPlan_basics as GetAllBasicsTypes } from 'queries/ReadOnly/types/GetAllBasics';
import {
  CMMIGroup,
  CMSCenter,
  ModelCategory,
  ModelType,
  TaskStatus
} from 'types/graphql-global-types';
import { translateModelCategory } from 'utils/modelPlan';

import ReadOnlyModelBasics from './index';

const basicMockData: GetAllBasicsTypes = {
  __typename: 'PlanBasics',
  id: '123',
  demoCode: '1234',
  amsModelID: '43532323',
  modelCategory: ModelCategory.PRIMARY_CARE_TRANSFORMATION,
  cmsCenters: [CMSCenter.CENTER_FOR_MEDICARE, CMSCenter.OTHER],
  cmsOther: 'The Center for Awesomeness',
  cmmiGroups: [
    CMMIGroup.STATE_AND_POPULATION_HEALTH_GROUP,
    CMMIGroup.POLICY_AND_PROGRAMS_GROUP
  ],
  modelType: ModelType.MANDATORY,
  problem: 'There is not enough candy',
  goal: 'To get more candy',
  testInterventions: 'The great candy machine',
  note: "The machine doesn't work yet",
  completeICIP: '2022-06-03T19:32:24.412662Z',
  clearanceStarts: '2022-06-03T19:32:24.412662Z',
  clearanceEnds: '2022-06-03T19:32:24.412662Z',
  announced: '2022-06-03T19:32:24.412662Z',
  applicationsStart: '2022-06-03T19:32:24.412662Z',
  applicationsEnd: '2022-06-03T19:32:24.412662Z',
  performancePeriodStarts: '2022-06-03T19:32:24.412662Z',
  performancePeriodEnds: '2022-06-03T19:32:24.412662Z',
  wrapUpEnds: '2022-06-03T19:32:24.412662Z',
  highLevelNote: 'Theses are my best guess notes',
  phasedIn: false,
  phasedInNote: "This can't be phased in",
  status: TaskStatus.IN_PROGRESS
};

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetAllBasics,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          nameHistory: ['First Name', 'Second Name'],
          basics: basicMockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/model-basics">
            <ReadOnlyModelBasics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--model-basics')
      ).toBeInTheDocument();
      expect(screen.getByText('Second Name')).toBeInTheDocument();
      expect(
        screen.getByText(
          translateModelCategory(ModelCategory.PRIMARY_CARE_TRANSFORMATION)
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/model-basics">
            <ReadOnlyModelBasics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--model-basics')
      ).toBeInTheDocument();
      expect(screen.getByTestId('other-entry')).toHaveTextContent(
        'The Center for Awesomeness'
      );
      expect(screen.getByText('Second Name')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
