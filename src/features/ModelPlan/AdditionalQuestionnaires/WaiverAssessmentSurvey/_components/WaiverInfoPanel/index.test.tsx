import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CommonWaiverType,
  GetCommonWaiverDocument,
  GetCommonWaiverQuery,
  GetCommonWaiverQueryVariables
} from 'gql/generated/graphql';

import { WaiverSelectionForm } from 'types/waivers';

import WaiverInfoPanel from './index';

const waiverId = '15736fa3-d5d0-4c2e-a233-2a59113b9806';

const commonWaiverMockData: GetCommonWaiverQuery['commonWaiver'] = {
  __typename: 'CommonWaiver',
  id: waiverId,
  name: 'Test Waiver',
  description: 'Test waiver description',
  participationAgreementLanguageLink: 'https://example.com/pal',
  cmmiWaiverPointOfContact: 'Jane Doe',
  waiverType: CommonWaiverType.MEDICARE_PAYMENT,
  waiverFocus: 'Site of care',
  whatIsWaived: 'Some regulation',
  hasStandardizationEffort: true,
  hasClaimsDataOrRREGAnalysis: 'Yes',
  isUsedInActiveModels: false
};

const getCommonWaiver = (
  overrides: Partial<GetCommonWaiverQuery['commonWaiver']> = {}
): MockedResponse<GetCommonWaiverQuery, GetCommonWaiverQueryVariables> => ({
  request: {
    query: GetCommonWaiverDocument,
    variables: { id: waiverId }
  },
  result: {
    data: {
      __typename: 'Query',
      commonWaiver: {
        ...commonWaiverMockData,
        ...overrides
      }
    }
  }
});

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<WaiverSelectionForm>({
    defaultValues: {
      waivers: {
        [waiverId]: {
          willUseWaiver: null,
          notUsingReason: ''
        }
      }
    }
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderPanel = ({
  search = '',
  mocks = [getCommonWaiver()]
}: {
  search?: string;
  mocks?: MockedResponse<GetCommonWaiverQuery, GetCommonWaiverQueryVariables>[];
} = {}) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <FormWrapper>
            <WaiverInfoPanel />
          </FormWrapper>
        )
      }
    ],
    {
      initialEntries: [search ? `/?${search}` : '/']
    }
  );

  return render(
    <MockedProvider mocks={mocks}>
      <RouterProvider router={router} />
    </MockedProvider>,
    { container: document.body }
  );
};

describe('WaiverInfoPanel', () => {
  beforeAll(() => {
    Modal.setAppElement(document.body);
  });

  it('does not show waiver details when waiverId is not in the URL', () => {
    renderPanel();

    expect(screen.queryByText('Test Waiver')).not.toBeInTheDocument();
  });

  it('renders waiver details when the panel is open', async () => {
    renderPanel({ search: `waiverId=${waiverId}` });

    await waitFor(() => {
      expect(screen.getByText('Test Waiver')).toBeInTheDocument();
    });

    expect(screen.getByText('Test waiver description')).toBeInTheDocument();
    expect(
      screen.getByText('Link to Participation Agreement Language')
    ).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Medicare payment waivers')).toBeInTheDocument();
    expect(screen.getByText('Site of care')).toBeInTheDocument();
    expect(screen.getByText('Some regulation')).toBeInTheDocument();
    expect(
      screen.getByText('Do you plan to use this waiver with your model?')
    ).toBeInTheDocument();
  });

  it('shows fallback text when point of contact is empty', async () => {
    renderPanel({
      search: `waiverId=${waiverId}`,
      mocks: [getCommonWaiver({ cmmiWaiverPointOfContact: '   ' })]
    });

    await waitFor(() => {
      expect(
        screen.getByText('No point of contact listed')
      ).toBeInTheDocument();
    });
  });

  it('hides waiver select actions on readview', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/read-view',
          element: <WaiverInfoPanel />
        }
      ],
      {
        initialEntries: [`/read-view/?waiverId=${waiverId}`]
      }
    );

    render(
      <MockedProvider mocks={[getCommonWaiver()]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Waiver')).toBeInTheDocument();

      expect(
        screen.queryByText('Do you plan to use this waiver with your model?')
      ).not.toBeInTheDocument();
    });
  });

  it('matches snapshot when open', async () => {
    const { asFragment } = renderPanel({ search: `waiverId=${waiverId}` });

    await waitFor(() => {
      expect(screen.getByText('Test Waiver')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
