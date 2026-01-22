import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetAllIddocQuestionnaireDocument } from 'gql/generated/graphql';
import {
  iddocQuestionnaireData,
  iddocQuestionnaireMocks,
  modelID
} from 'tests/mock/readonly';

import ReadOnlyIddocQuestionnaire from './index';

describe('Read Only IDDOC Questionnaire', () => {
  it('renders needed iddoc questionnaire without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/iddoc-questionnaire',
          element: <ReadOnlyIddocQuestionnaire modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/iddoc-questionnaire`]
      }
    );

    render(
      <MockedProvider mocks={iddocQuestionnaireMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() =>
      expect(screen.getByText('4i and ACO-OS')).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'Not started'
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'This questionnaire is required for this model due to specific answers in the Model Plan or model-to-operations matrix (MTO).'
        )
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Are technical contacts identified? If so, please specify.'
        )
      ).toBeInTheDocument();
    });
  });

  it('renders not needed iddoc questionnaire without errors', async () => {
    const secondMocks = [
      {
        request: {
          query: GetAllIddocQuestionnaireDocument,
          variables: { id: modelID }
        },
        result: {
          data: {
            __typename: 'Query',
            modelPlan: {
              __typename: 'ModelPlan',
              id: modelID,
              questionnaires: {
                iddocQuestionnaire: { ...iddocQuestionnaireData, needed: false }
              }
            }
          }
        }
      }
    ];
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/iddoc-questionnaire',
          element: <ReadOnlyIddocQuestionnaire modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/iddoc-questionnaire`]
      }
    );

    render(
      <MockedProvider mocks={secondMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() =>
      expect(screen.getByText('4i and ACO-OS')).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'This questionnaire is not needed for this model due to specific answers in the Model Plan or model-to-operations matrix (MTO).'
        )
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'There are 16 questions in this questionnaire that are not applicable to your model because of answers in this Model Plan or selections in this model’s model-to-operations matrix (MTO).'
        )
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Are technical contacts identified? If so, please specify.'
        )
      ).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/iddoc-questionnaire',
          element: <ReadOnlyIddocQuestionnaire modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/iddoc-questionnaire`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={iddocQuestionnaireMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'This questionnaire is required for this model due to specific answers in the Model Plan or model-to-operations matrix (MTO).'
        )
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Are technical contacts identified? If so, please specify.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
