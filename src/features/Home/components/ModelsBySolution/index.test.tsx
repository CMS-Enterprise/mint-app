import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GeneralStatus,
  GetModelsByMtoSolutionDocument,
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables,
  ModelStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';
import setup from 'tests/util';

import ModelsBySolution from './index';

const createMockModels = (solutionKey: MtoCommonSolutionKey, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    modelPlanID: `model-plan-${solutionKey}-${i}`,
    modelPlan: {
      id: `model-${solutionKey}-${i}`,
      modelName: `Model ${i + 1} for ${solutionKey}`,
      status: i % 3 === 0 ? ModelStatus.ACTIVE : ModelStatus.PLAN_DRAFT,
      generalStatus: i % 3 === 0 ? GeneralStatus.ACTIVE : GeneralStatus.PLANNED,
      abbreviation: `M${i + 1}`,
      basics: {
        id: `basics-${i}`,
        modelCategory: null,
        __typename: 'PlanBasics' as const
      },
      timeline: {
        id: `timeline-${i}`,
        performancePeriodStarts: null,
        performancePeriodEnds: null,
        __typename: 'PlanTimeline' as const
      },
      __typename: 'ModelPlan' as const
    },
    __typename: 'ModelPlanAndMTOCommonSolution' as const
  }));
};

const mockInnovation: MockedResponse<
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables
>[] = [
  {
    request: {
      query: GetModelsByMtoSolutionDocument,
      variables: { solutionKey: MtoCommonSolutionKey.INNOVATION }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByMTOSolutionKey: createMockModels(
          MtoCommonSolutionKey.INNOVATION,
          5
        )
      }
    }
  }
];

const mockCbosc: MockedResponse<
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables
>[] = [
  {
    request: {
      query: GetModelsByMtoSolutionDocument,
      variables: { solutionKey: MtoCommonSolutionKey.CBOSC }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByMTOSolutionKey: createMockModels(
          MtoCommonSolutionKey.CBOSC,
          3
        )
      }
    }
  }
];

const mockEmpty: MockedResponse<
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables
>[] = [
  {
    request: {
      query: GetModelsByMtoSolutionDocument,
      variables: { solutionKey: MtoCommonSolutionKey.ACO_OS }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByMTOSolutionKey: []
      }
    }
  }
];

describe('ModelsBySolution', () => {
  it('renders with no solutions selected', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[]}>
          <ModelsBySolution solutionKeys={[]} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'It looks like you forgot to select at least one solution.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Select solutions')).toBeInTheDocument();
  });

  it('shows loading spinner while fetching data', () => {
    const loadingMock: MockedResponse<
      GetModelsByMtoSolutionQuery,
      GetModelsByMtoSolutionQueryVariables
    >[] = [
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.INNOVATION }
        },
        result: {
          data: {
            __typename: 'Query',
            modelPlansByMTOSolutionKey: []
          }
        },
        delay: 100
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={loadingMock}>
          <ModelsBySolution solutionKeys={[MtoCommonSolutionKey.INNOVATION]} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays models after loading', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockInnovation}>
          <ModelsBySolution solutionKeys={[MtoCommonSolutionKey.INNOVATION]} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Model 1 for INNOVATION/)).toBeInTheDocument();
    });

    // Should show banner with counts
    expect(screen.getByTestId('total-count')).toHaveTextContent('5');
  });

  it('displays navigation tabs when fewer than 6 solutions', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[...mockInnovation, ...mockCbosc]}>
          <ModelsBySolution
            solutionKeys={[
              MtoCommonSolutionKey.INNOVATION,
              MtoCommonSolutionKey.CBOSC
            ]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should show navigation buttons (solution names/acronyms)
      expect(screen.getByText('4innovation')).toBeInTheDocument(); // INNOVATION acronym
      expect(screen.getByText('CBOSC')).toBeInTheDocument();
    });
  });

  it('displays select dropdown when 6 or more solutions', async () => {
    const allMocks = [
      ...mockInnovation,
      ...mockCbosc,
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.ACO_OS }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.ACO_OS,
              2
            )
          }
        }
      },
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.CCW }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.CCW,
              2
            )
          }
        }
      },
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.AMS }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.AMS,
              2
            )
          }
        }
      },
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.APPS }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.APPS,
              2
            )
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={allMocks}>
          <ModelsBySolution
            solutionKeys={[
              MtoCommonSolutionKey.INNOVATION,
              MtoCommonSolutionKey.CBOSC,
              MtoCommonSolutionKey.ACO_OS,
              MtoCommonSolutionKey.CCW,
              MtoCommonSolutionKey.AMS,
              MtoCommonSolutionKey.APPS
            ]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should show select dropdown instead of tabs
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  it('switches between solutions using navigation', async () => {
    const { user } = setup(
      <MemoryRouter>
        <MockedProvider mocks={[...mockInnovation, ...mockCbosc]}>
          <ModelsBySolution
            solutionKeys={[
              MtoCommonSolutionKey.INNOVATION,
              MtoCommonSolutionKey.CBOSC
            ]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    // Initially shows INNOVATION models
    await waitFor(() => {
      expect(screen.getByText(/Model 1 for INNOVATION/)).toBeInTheDocument();
    });

    // Click on CBOSC button
    const cboscButton = screen.getByText('CBOSC');
    await user.click(cboscButton);

    // Should now show CBOSC models
    await waitFor(() => {
      expect(screen.getByText(/Model 1 for CBOSC/)).toBeInTheDocument();
      expect(
        screen.queryByText(/Model 1 for INNOVATION/)
      ).not.toBeInTheDocument();
    });
  });

  it('switches solutions using select dropdown', async () => {
    const allMocks = [
      ...mockInnovation,
      ...mockCbosc,
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.ACO_OS }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.ACO_OS,
              2
            )
          }
        }
      },
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.CCW }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.CCW,
              2
            )
          }
        }
      },
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.AMS }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.AMS,
              2
            )
          }
        }
      },
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.APPS }
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlansByMTOSolutionKey: createMockModels(
              MtoCommonSolutionKey.APPS,
              2
            )
          }
        }
      }
    ];

    const { user } = setup(
      <MemoryRouter>
        <MockedProvider mocks={allMocks}>
          <ModelsBySolution
            solutionKeys={[
              MtoCommonSolutionKey.INNOVATION,
              MtoCommonSolutionKey.CBOSC,
              MtoCommonSolutionKey.ACO_OS,
              MtoCommonSolutionKey.CCW,
              MtoCommonSolutionKey.AMS,
              MtoCommonSolutionKey.APPS
            ]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    // Change selection to CBOSC
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, MtoCommonSolutionKey.CBOSC);

    await waitFor(() => {
      expect(screen.getByText(/Model 1 for CBOSC/)).toBeInTheDocument();
    });
  });

  it('sorts solutions alphabetically by name', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[...mockInnovation, ...mockCbosc]}>
          <ModelsBySolution
            solutionKeys={[
              MtoCommonSolutionKey.CBOSC,
              MtoCommonSolutionKey.INNOVATION
            ]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const buttonTexts = buttons
        .map(btn => btn.textContent)
        .filter(
          text =>
            text && (text.includes('4innovation') || text.includes('CBOSC'))
        );

      // 4innovation should come before CBOSC alphabetically
      expect(buttonTexts[0]).toContain('4innovation');
      expect(buttonTexts[1]).toContain('CBOSC');
    });
  });

  it('handles empty results from query', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockEmpty}>
          <ModelsBySolution solutionKeys={[MtoCommonSolutionKey.ACO_OS]} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/There is no record of any models using this solution/)
      ).toBeInTheDocument();
    });
  });

  it('sorts models alphabetically by name', async () => {
    const unsortedMocks: MockedResponse<
      GetModelsByMtoSolutionQuery,
      GetModelsByMtoSolutionQueryVariables
    >[] = [
      {
        request: {
          query: GetModelsByMtoSolutionDocument,
          variables: { solutionKey: MtoCommonSolutionKey.INNOVATION }
        },
        result: {
          data: {
            __typename: 'Query',
            modelPlansByMTOSolutionKey: [
              {
                modelPlanID: 'model-z',
                modelPlan: {
                  id: 'model-z',
                  modelName: 'Zebra Model',
                  status: ModelStatus.PLAN_DRAFT,
                  generalStatus: GeneralStatus.PLANNED,
                  abbreviation: 'ZM',
                  basics: {
                    id: 'basics-z',
                    modelCategory: null,
                    __typename: 'PlanBasics' as const
                  },
                  timeline: {
                    id: 'timeline-z',
                    performancePeriodStarts: null,
                    performancePeriodEnds: null,
                    __typename: 'PlanTimeline' as const
                  },
                  __typename: 'ModelPlan' as const
                },
                __typename: 'ModelPlanAndMTOCommonSolution' as const
              },
              {
                modelPlanID: 'model-a',
                modelPlan: {
                  id: 'model-a',
                  modelName: 'Alpha Model',
                  status: ModelStatus.PLAN_DRAFT,
                  generalStatus: GeneralStatus.PLANNED,
                  abbreviation: 'AM',
                  basics: {
                    id: 'basics-a',
                    modelCategory: null,
                    __typename: 'PlanBasics' as const
                  },
                  timeline: {
                    id: 'timeline-a',
                    performancePeriodStarts: null,
                    performancePeriodEnds: null,
                    __typename: 'PlanTimeline' as const
                  },
                  __typename: 'ModelPlan' as const
                },
                __typename: 'ModelPlanAndMTOCommonSolution' as const
              }
            ]
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={unsortedMocks}>
          <ModelsBySolution solutionKeys={[MtoCommonSolutionKey.INNOVATION]} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const cards = screen.getAllByRole('heading', { level: 3 });
      // Alpha should come before Zebra
      expect(cards[1]).toHaveTextContent('Alpha Model');
      expect(cards[2]).toHaveTextContent('Zebra Model');
    });
  });

  it('displays correct solution name in banner', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockCbosc}>
          <ModelsBySolution solutionKeys={[MtoCommonSolutionKey.CBOSC]} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should show full solution name and acronym in banner
      expect(
        screen.getByText(/Consolidated Business Operations Support Center/i)
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot with single solution', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={mockInnovation}>
          <ModelsBySolution solutionKeys={[MtoCommonSolutionKey.INNOVATION]} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with multiple solutions', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={[...mockInnovation, ...mockCbosc]}>
          <ModelsBySolution
            solutionKeys={[
              MtoCommonSolutionKey.INNOVATION,
              MtoCommonSolutionKey.CBOSC
            ]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with no solutions selected', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={[]}>
          <ModelsBySolution solutionKeys={[]} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
