import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoTemplateKey } from 'gql/generated/graphql';
import { mtoTemplateMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';
import {
  MTOModalContext,
  MTOModalState,
  MtoTemplateType
} from 'contexts/MTOModalContext';

import TemplateCard, { TemplateCardType } from './index';

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

describe('TemplateCard Component', () => {
  const mockTemplate: TemplateCardType = {
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
  };

  const mockSetIsSidepanelOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplateCard
                  template={mockTemplate}
                  setIsSidepanelOpen={mockSetIsSidepanelOpen}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mtoTemplateMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

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

  it('renders with custom className', () => {
    const customClassName = 'custom-template-card';

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplateCard
                  className={customClassName}
                  template={mockTemplate}
                  setIsSidepanelOpen={mockSetIsSidepanelOpen}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(
      <MockedProvider mocks={mtoTemplateMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const cardElement = screen
      .getByText('Standard categories')
      .closest('.custom-template-card');
    expect(cardElement).toBeInTheDocument();
  });

  it('calls setMTOModalState and setMTOModalOpen when "Add to Matrix" button is clicked', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplateCard
                  template={mockTemplate}
                  setIsSidepanelOpen={mockSetIsSidepanelOpen}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(
      <MockedProvider mocks={mtoTemplateMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const addToMatrixButton = screen.getByText('Add to matrix');
    fireEvent.click(addToMatrixButton);

    expect(mockSetMTOModalState).toHaveBeenCalledWith({
      modalType: 'addTemplate',
      mtoTemplate: mockTemplate
    });
    expect(mockSetMTOModalOpen).toHaveBeenCalledWith(true);
  });

  it('calls setIsSidepanelOpen and navigates when "About this template" button is clicked', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplateCard
                  template={mockTemplate}
                  setIsSidepanelOpen={mockSetIsSidepanelOpen}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(
      <MockedProvider mocks={mtoTemplateMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const aboutTemplateButton = screen.getByText('About this template');
    fireEvent.click(aboutTemplateButton);

    expect(mockSetIsSidepanelOpen).toHaveBeenCalledWith(true);
  });

  it('renders template count with different values', () => {
    const templateWithCounts: TemplateCardType = {
      ...mockTemplate,
      categoryCount: 5,
      milestoneCount: 10,
      solutionCount: 15
    };

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <MTOModalContext.Provider value={mockMTOModalContext}>
                <TemplateCard
                  template={templateWithCounts}
                  setIsSidepanelOpen={mockSetIsSidepanelOpen}
                />
              </MTOModalContext.Provider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(
      <MockedProvider mocks={mtoTemplateMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      screen.getByText(/5 categories, 10 milestones, 15 solutions/)
    ).toBeInTheDocument();
  });
});
