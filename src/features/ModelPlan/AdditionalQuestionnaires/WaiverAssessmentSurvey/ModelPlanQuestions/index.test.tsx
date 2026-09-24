import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { modelID, modelPlanQuestionsMocks } from 'tests/mock/general';

import ModelPlanQuestions from './index';

describe('ModelPlanQuestions Component', () => {
  const setupRouter = () => {
    return createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions',
          element: <ModelPlanQuestions />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions`
        ]
      }
    );
  };

  it('renders page after data loads', async () => {
    const router = setupRouter();

    render(
      <MockedProvider mocks={modelPlanQuestionsMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    expect(screen.getByText(/Model Plan questions/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        'The following questions are included in your Model Plan and will help verify which waivers may be required for your model. Please check any answers entered and update any that are not accurate.'
      )
    ).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const router = setupRouter();

    const { asFragment } = render(
      <MockedProvider mocks={modelPlanQuestionsMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    expect(asFragment()).toMatchSnapshot();
  });
});
