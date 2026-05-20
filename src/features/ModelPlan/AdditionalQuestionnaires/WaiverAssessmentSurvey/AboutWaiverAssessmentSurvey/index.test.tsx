import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { collaboratorsMocks } from 'tests/mock/readonly';

import AboutWaiverAssessmentSurvey from '.';

describe('AboutWaiverAssessmentSurvey', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/about',
          element: <AboutWaiverAssessmentSurvey />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/waiver-assessment-survey/about'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    expect(asFragment()).toMatchSnapshot();
  });
});
