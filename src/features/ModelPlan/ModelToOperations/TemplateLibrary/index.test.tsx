import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mtoModelPlanTemplateMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import { vi } from 'vitest';

import { MTOModalContext } from 'contexts/MTOModalContext';

import TemplateLibrary from './index';

// Mock only the hooks that need specific behavior
vi.mock('hooks/useMessage', () => ({
  default: () => ({
    clearMessage: vi.fn(),
    message: null
  })
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = {
  search: '',
  pathname:
    '/models/test-id/collaboration-area/model-to-operations/template-library'
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => ({ modelID })
  };
});

// Mock context
const mockContextValue = {
  isMTOModalOpen: false,
  setMTOModalOpen: vi.fn(),
  mtoModalState: {
    categoryID: '',
    categoryName: '',
    rowType: 'category' as const,
    subCategoryID: '',
    modalType: 'addTemplate' as const,
    mtoTemplate: undefined
  },
  setMTOModalState: vi.fn(),
  resetMTOModalState: vi.fn()
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MTOModalContext.Provider value={mockContextValue}>
        <MockedProvider mocks={mtoModelPlanTemplateMock}>{ui}</MockedProvider>
      </MTOModalContext.Provider>
    </BrowserRouter>
  );
};

describe('TemplateLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the template library page', () => {
    renderWithProviders(<TemplateLibrary />);

    expect(
      screen.getByText(
        'Browse the model-to-operations (MTO) matrix templates available in MINT. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added. Add any templates that are relevant for your MTO.'
      )
    ).toBeInTheDocument();
  });

  it('displays breadcrumbs', () => {
    renderWithProviders(<TemplateLibrary />);

    // Check for breadcrumb navigation
    expect(screen.getByText('Model collaboration area')).toBeInTheDocument();
  });

  it('shows return to MTO link', () => {
    renderWithProviders(<TemplateLibrary />);

    const returnLink = screen.getByText('Return to model-to-operations matrix');
    expect(returnLink).toBeInTheDocument();
    expect(returnLink.closest('a')).toHaveAttribute(
      'href',
      `/models/${modelID}/collaboration-area/model-to-operations/matrix`
    );
  });

  it('displays template cards when data is available', async () => {
    renderWithProviders(<TemplateLibrary />);

    await waitFor(() => {
      expect(screen.getByText('Standard categories')).toBeInTheDocument();
    });

    expect(
      screen.getByText('These are the standard categories for MTOs.')
    ).toBeInTheDocument();
  });

  it('shows search functionality', async () => {
    renderWithProviders(<TemplateLibrary />);

    await waitFor(() => {
      expect(screen.getByText('Standard categories')).toBeInTheDocument();
    });

    // Look for search input by placeholder or label
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'standard' } });
    expect(searchInput).toHaveValue('standard');
  });

  it('displays pagination controls', async () => {
    renderWithProviders(<TemplateLibrary />);

    await waitFor(() => {
      // Look for pagination buttons or controls
      const paginationButtons = screen.queryAllByRole('button');
      expect(paginationButtons.length).toBeGreaterThan(0);
    });
  });

  it('shows page size selector', async () => {
    renderWithProviders(<TemplateLibrary />);

    await waitFor(() => {
      // Look for page size selector
      const pageSizeSelect = screen.getByRole('combobox');
      expect(pageSizeSelect).toBeInTheDocument();
    });
  });

  it('handles template card interactions', async () => {
    renderWithProviders(<TemplateLibrary />);

    await waitFor(() => {
      expect(screen.getByText('Standard categories')).toBeInTheDocument();
    });

    // Look for the actual buttons in the template cards
    const addButtons = screen.getAllByText('Add to matrix');
    const aboutButtons = screen.getAllByText('About this template');

    expect(addButtons.length).toBeGreaterThan(0);
    expect(aboutButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);
    fireEvent.click(aboutButtons[0]);

    // These should trigger navigation
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderWithProviders(<TemplateLibrary />);
    expect(asFragment()).toMatchSnapshot();
  });
});
