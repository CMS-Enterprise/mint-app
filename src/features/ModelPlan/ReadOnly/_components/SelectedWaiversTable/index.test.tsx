import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { CommonWaiverType } from 'gql/generated/graphql';
import i18next from 'i18next';

import SelectedWaiversTable, { SelectedWaiver } from '.';

const mockSelectedWaivers: SelectedWaiver[] = [
  {
    __typename: 'Waiver',
    id: '456',
    willUseWaiver: true,
    notUsingReason: '',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'Test Waiver',
      waiverType: CommonWaiverType.PROGRAM_MEDICARE_BE
    }
  },
  {
    __typename: 'Waiver',
    id: '123',
    willUseWaiver: true,
    notUsingReason: '',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'Test Waiver 2',
      waiverType: CommonWaiverType.MEDICAID_PAYMENT
    }
  }
];

const renderWithRouter = ({
  empty = false,
  initialEntries = ['/']
}: {
  empty?: boolean;
  initialEntries?: string[];
}) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <SelectedWaiversTable
            selectedWaivers={empty ? [] : mockSelectedWaivers}
          />
        )
      }
    ],
    {
      initialEntries
    }
  );

  return { router, ...render(<RouterProvider router={router} />) };
};

describe('The SelectedWaiversTable Component', () => {
  it('renders table headers and columns accordingly', () => {
    renderWithRouter({});

    expect(
      screen.getByText(
        i18next.t<string, {}, string>(
          'waiverAssessmentSurveyMisc:selectedWaivers.readonlyColumns.waiverName'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string, {}, string>(
          'waiverAssessmentSurveyMisc:selectedWaivers.readonlyColumns.waiverCategory'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string, {}, string>(
          'waiverAssessmentSurveyMisc:selectedWaivers.readonlyColumns.actions'
        )
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Test Waiver')).toBeInTheDocument();
    expect(screen.getByText('Test Waiver 2')).toBeInTheDocument();
  });

  it('updates params and renders Info Panel when view details is selected', async () => {
    const { router } = renderWithRouter({});

    expect(
      screen.queryByTestId('mock-waiver-info-panel')
    ).not.toBeInTheDocument();

    const actionButtons = screen.getAllByRole('button', {
      name: i18next.t<string, {}, string>(
        'waiverAssessmentSurveyMisc:selectedWaivers.readonlyColumns.viewDetails'
      )
    });

    fireEvent.click(actionButtons[0]);

    expect(router.state.location.search).toContain('waiverId=456');
  });
});
