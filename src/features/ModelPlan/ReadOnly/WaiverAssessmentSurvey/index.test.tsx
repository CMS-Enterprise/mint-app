import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { modelID, waiverAssessmentSurveyMocks } from 'tests/mock/readonly';

import ReadOnlyWaiverAssessmentSurvey from './index';

describe('Read Only Model Plan Summary -- Waiver Assessment Survey', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/waiver-assessment-survey',
          element: <ReadOnlyWaiverAssessmentSurvey modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/waiver-assessment-survey`
        ]
      }
    );

    render(
      <MockedProvider mocks={waiverAssessmentSurveyMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/waiver-assessment-survey',
          element: <ReadOnlyWaiverAssessmentSurvey modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/waiver-assessment-survey`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={waiverAssessmentSurveyMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
