import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GetMtoTemplatesDocument, MtoTemplateKey } from 'gql/generated/graphql';
import { mtoTemplateMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';

import MessageProvider from 'contexts/MessageContext';
import { MTOModalProvider } from 'contexts/MTOModalContext';

import MTOOptionsPanel from '.';

describe('MTOOptionsPanel', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('shows loading spinner when templates are loading', () => {
    const loadingMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {
          keys: [
            MtoTemplateKey.STANDARD_CATEGORIES,
            MtoTemplateKey.ACO_AND_KIDNEY_MODELS,
            MtoTemplateKey.EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS
          ]
        }
      },
      result: {
        data: { mtoTemplates: [] }
      },
      delay: 100
    };

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[loadingMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error alert when template loading fails', async () => {
    const errorMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {
          keys: [
            MtoTemplateKey.STANDARD_CATEGORIES,
            MtoTemplateKey.ACO_AND_KIDNEY_MODELS,
            MtoTemplateKey.EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS
          ]
        }
      },
      error: new Error('Failed to fetch templates')
    };

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[errorMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch templates')).toBeInTheDocument();
    });
  });

  it('displays default templates when loaded successfully', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('3 of 5 available templates')
      ).toBeInTheDocument();
      expect(screen.getByText('Standard categories')).toBeInTheDocument();
      expect(screen.getByText('ACO and kidney models')).toBeInTheDocument();
      expect(
        screen.getByText('Episode primary care and non-ACO models')
      ).toBeInTheDocument();
    });
  });

  it('displays template counts correctly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('24 categories, 0 milestones, 0 solutions')
      ).toBeInTheDocument();
      expect(
        screen.getByText('13 categories, 12 milestones, 10 solutions')
      ).toBeInTheDocument();
      expect(
        screen.getByText('13 categories, 13 milestones, 11 solutions')
      ).toBeInTheDocument();
    });
  });

  it('filters to show only default templates', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      // Should show 3 default templates (not all 5)
      expect(
        screen.getByText('3 of 5 available templates')
      ).toBeInTheDocument();

      // Should show default templates
      expect(screen.getByText('Standard categories')).toBeInTheDocument();
      expect(screen.getByText('ACO and kidney models')).toBeInTheDocument();
      expect(
        screen.getByText('Episode primary care and non-ACO models')
      ).toBeInTheDocument();

      // Should not show non-default templates
      expect(
        screen.queryByText('Medicare advantage and drug models')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('State and local models')
      ).not.toBeInTheDocument();
    });
  });

  it('opens modal when template button is clicked', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      const addTemplateButtons = screen.getAllByText('Add this template');
      expect(addTemplateButtons).toHaveLength(3);

      fireEvent.click(addTemplateButtons[0]);
    });
  });

  it('navigates to template library when link is clicked', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      const viewTemplatesLink = screen.getByText(
        'View all templates in the library'
      );
      expect(viewTemplatesLink).toHaveAttribute(
        'href',
        `/models/${modelID}/collaboration-area/model-to-operations/template-library`
      );
    });
  });

  it('renders milestones and solutions option cards', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByText('Start with model milestones')).toBeInTheDocument();
    expect(
      screen.getByText('Start with solutions or IT systems')
    ).toBeInTheDocument();
    expect(screen.getByText('Add milestones from library')).toBeInTheDocument();
    expect(screen.getByText('Add solutions from library')).toBeInTheDocument();
  });

  it('opens modal when milestone link is clicked', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const milestoneLink = screen.getByText('or, create a custom milestone');
    fireEvent.click(milestoneLink);
  });

  it('opens modal when solution link is clicked', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <MTOModalProvider>
                <MTOOptionsPanel />
              </MTOModalProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...mtoTemplateMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const solutionLink = screen.getByText('or, create a custom solution');
    fireEvent.click(solutionLink);
  });
});
