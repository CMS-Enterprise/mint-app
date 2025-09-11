import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GetMtoTemplatesDocument, MtoTemplateKey } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/readonly';

import MessageProvider from 'contexts/MessageContext';
import { MTOModalProvider, MtoTemplateType } from 'contexts/MTOModalContext';

import MTOOptionsPanel from '.';

const mockTemplates: MtoTemplateType[] = [
  {
    __typename: 'MTOTemplate',
    id: '1',
    name: 'Standard categories',
    description: 'These are the standard categories for MTOs.',
    key: MtoTemplateKey.STANDARD_CATEGORIES,
    categoryCount: 24,
    milestoneCount: 0,
    solutionCount: 0,
    primaryCategoryCount: 9,
    categories: []
  },
  {
    __typename: 'MTOTemplate',
    id: '2',
    name: 'ACO and kidney models',
    description: 'These are the ACO and Kidney models for MTOs.',
    key: MtoTemplateKey.ACO_AND_KIDNEY_MODELS,
    categoryCount: 13,
    milestoneCount: 12,
    solutionCount: 10,
    primaryCategoryCount: 4,
    categories: []
  },
  {
    __typename: 'MTOTemplate',
    id: '3',
    name: 'Episode primary care and non-ACO models',
    description:
      'These are the Episode Primary Care and Non-ACO models for MTOs.',
    key: MtoTemplateKey.EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS,
    categoryCount: 13,
    milestoneCount: 13,
    solutionCount: 11,
    primaryCategoryCount: 4,
    categories: []
  },
  {
    __typename: 'MTOTemplate',
    id: '4',
    name: 'Medicare advantage and drug models',
    description: 'These are the Medicare Advantage and Drug models for MTOs.',
    key: MtoTemplateKey.MEDICARE_ADVANTAGE_AND_DRUG_MODELS,
    categoryCount: 3,
    milestoneCount: 3,
    solutionCount: 0,
    primaryCategoryCount: 1,
    categories: []
  },
  {
    __typename: 'MTOTemplate',
    id: '5',
    name: 'State and local models',
    description: 'These are the State and Local models for MTOs.',
    key: MtoTemplateKey.STATE_AND_LOCAL_MODELS,
    categoryCount: 14,
    milestoneCount: 0,
    solutionCount: 0,
    primaryCategoryCount: 0,
    categories: []
  }
];

const mocks = [
  {
    request: {
      query: GetMtoTemplatesDocument,
      variables: {}
    },
    result: { data: { mtoTemplates: mockTemplates } }
  }
];

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
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('shows loading spinner when templates are loading', () => {
    const loadingMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
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
      <MockedProvider mocks={[loadingMock]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error alert when template loading fails', async () => {
    const errorMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
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
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch templates')).toBeInTheDocument();
    });
  });

  it('displays default templates when loaded successfully', async () => {
    const successMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
      },
      result: {
        data: { mtoTemplates: mockTemplates }
      }
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
      <MockedProvider mocks={[successMock]} addTypename={false}>
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
    const successMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
      },
      result: {
        data: { mtoTemplates: mockTemplates }
      }
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
      <MockedProvider mocks={[successMock]} addTypename={false}>
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
    const successMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
      },
      result: {
        data: { mtoTemplates: mockTemplates }
      }
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
      <MockedProvider mocks={[successMock]} addTypename={false}>
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
    const successMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
      },
      result: {
        data: { mtoTemplates: mockTemplates }
      }
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
      <MockedProvider mocks={[successMock]} addTypename={false}>
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
    const successMock = {
      request: {
        query: GetMtoTemplatesDocument,
        variables: {}
      },
      result: {
        data: { mtoTemplates: mockTemplates }
      }
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
      <MockedProvider mocks={[successMock]} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const solutionLink = screen.getByText('or, create a custom solution');
    fireEvent.click(solutionLink);
  });
});
