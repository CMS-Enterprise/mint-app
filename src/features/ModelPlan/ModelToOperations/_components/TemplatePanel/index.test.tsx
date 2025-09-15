import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoTemplateKey } from 'gql/generated/graphql';
import { modelID, mtoTemplateMockData } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';
import {
  MTOModalContext,
  MTOModalState,
  MtoTemplateType
} from 'contexts/MTOModalContext';

import TemplatePanel from './index';

// Mock the MTOModalContext
const mockSetMTOModalState = vi.fn();
const mockSetMTOModalOpen = vi.fn();

const mockMTOModalContext = {
  setMTOModalOpen: mockSetMTOModalOpen,
  mtoModalState: {
    modalType: 'addTemplate',
    mtoTemplate: {
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
    } as MtoTemplateType,
    categoryID: '',
    categoryName: '',
    rowType: 'category',
    subCategoryID: '',
    toggleRow: vi.fn()
  } as MTOModalState,
  setMTOModalState: mockSetMTOModalState,
  isMTOModalOpen: false,
  resetMTOModalState: vi.fn()
};

describe('TemplatePanel Component', () => {
  const mockTemplate: MtoTemplateType = mtoTemplateMockData[0];

  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    // Check if the component renders the template name
    expect(screen.getByText('Standard categories')).toBeInTheDocument();

    // Check if the component renders the template description
    expect(
      screen.getByText('These are the standard categories for MTOs.')
    ).toBeInTheDocument();

    // Check if the component renders the template count text
    expect(
      screen.getByText(/24 categories, 0 milestones, 0 solutions/)
    ).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders template content section', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    // Check if the template content section is rendered
    expect(screen.getByText('Template contents')).toBeInTheDocument();
  });

  it('calls setMTOModalState and setMTOModalOpen when "Add to Matrix" button is clicked', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    const addToMatrixButton = screen.getByText('Add to matrix');
    fireEvent.click(addToMatrixButton);

    expect(mockSetMTOModalState).toHaveBeenCalledWith({
      modalType: 'addTemplate',
      mtoTemplate: mockTemplate
    });
    expect(mockSetMTOModalOpen).toHaveBeenCalledWith(true);
  });

  it('renders navigation tabs for milestones and solutions', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    // Check if both tabs are rendered
    expect(screen.getByText('Milestones')).toBeInTheDocument();
    expect(screen.getByText('Solutions and IT systems')).toBeInTheDocument();
  });

  it('switches between milestones and solutions tabs', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    // Initially, milestones tab should be active
    const milestonesTab = screen.getByText('Milestones');
    expect(milestonesTab.closest('button')).toHaveClass('usa-current');

    // Click on solutions tab
    const solutionsTab = screen.getByText('Solutions and IT systems');
    fireEvent.click(solutionsTab);

    // Solutions tab should now be active
    expect(solutionsTab.closest('button')).toHaveClass('usa-current');
  });

  it('displays flattened milestone data when milestones tab is active', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    // Check if milestone-related content is displayed
    expect(screen.getByText(/Category:/)).toBeInTheDocument();
    expect(screen.getByText(/Sub-category:/)).toBeInTheDocument();
    expect(screen.getByText(/SubCategory 1/)).toBeInTheDocument();
    expect(screen.getByText(/Milestone:/)).toBeInTheDocument();
  });

  it('displays flattened solution data when solutions tab is active', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={mockTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    // Switch to solutions tab
    const solutionsTab = screen.getByText('Solutions and IT systems');
    fireEvent.click(solutionsTab);

    // Check if solution-related content is displayed
    expect(screen.getByText(/Solution:/)).toBeInTheDocument();
    expect(screen.getByText(/Related milestones:/)).toBeInTheDocument();
  });

  it('displays no items message when template has no data', () => {
    const emptyTemplate: MtoTemplateType = {
      __typename: 'MTOTemplate',
      id: '1',
      name: 'Empty template',
      description: 'This template has no data.',
      key: MtoTemplateKey.STANDARD_CATEGORIES,
      categoryCount: 0,
      milestoneCount: 0,
      solutionCount: 0,
      primaryCategoryCount: 0,
      categories: []
    };

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/template-library',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplatePanel
                  template={emptyTemplate}
                  closeModal={mockCloseModal}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/template-library?page=1&template=EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS`
        ]
      }
    );

    render(<RouterProvider router={router} />);

    // Should show no milestones message (default tab is milestones)
    expect(
      screen.getByText(
        'There are no milestones or categories included in this template.'
      )
    ).toBeInTheDocument();

    // Switch to solutions tab and check for no solutions message
    const solutionsTab = screen.getByText('Solutions and IT systems');
    fireEvent.click(solutionsTab);

    expect(
      screen.getByText(
        'There are no solutions or IT systems included in this template.'
      )
    ).toBeInTheDocument();
  });
});
