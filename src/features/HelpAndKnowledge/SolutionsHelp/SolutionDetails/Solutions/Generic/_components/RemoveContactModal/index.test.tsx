import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  SolutionContactType,
  SolutionContractorType,
  SolutionSystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonSolutionCmsComponent,
  MtoCommonSolutionOwnerType
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import RemoveContactModal from '.';

const teamMember: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  mailboxTitle: '',
  mailboxAddress: '',
  isTeam: false,
  role: 'Project Lead',
  isPrimary: true,
  receiveEmails: false
};

const contractor: SolutionContractorType = {
  __typename: 'MTOCommonSolutionContractor',
  id: '123',
  contractTitle: 'TAGAWA',
  contractorName: 'Rose Blue'
};

const owner: SolutionSystemOwnerType = {
  __typename: 'MTOCommonSolutionSystemOwner',
  id: 'not a real id',
  cmsComponent: MtoCommonSolutionCmsComponent.OFFICE_OF_COMMUNICATIONS_OC,
  ownerType: MtoCommonSolutionOwnerType.BUSINESS_OWNER
};

const mocks = [...possibleSolutionsMock];

// ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
// eslint-disable-next-line
console.error = vi.fn();

describe('RemoveContactModal Component', () => {
  it('should render team member context when given team member point of contact', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <RemoveContactModal
                isModalOpen
                closeModal={() => {}}
                pointOfContact={teamMember}
                contactType="teamOrMember"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(getByText('Point of contact to be removed:')).toBeInTheDocument();
    expect(queryByText('Contractor to be removed:')).not.toBeInTheDocument();
  });

  it('should render contractor context when given contractor point of contact', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <RemoveContactModal
                isModalOpen
                closeModal={() => {}}
                pointOfContact={contractor}
                contactType="contractor"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(getByText('Contractor to be removed:')).toBeInTheDocument();
    expect(
      queryByText('Point of contact to be removed:')
    ).not.toBeInTheDocument();
  });

  it('should render owner context when given owner point of contact', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <RemoveContactModal
                isModalOpen
                closeModal={() => {}}
                pointOfContact={owner}
                contactType="owner"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(
      getByText('Business Owner or System Owner to be removed:')
    ).toBeInTheDocument();
    expect(
      queryByText('Point of contact to be removed:')
    ).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <RemoveContactModal
                isModalOpen
                closeModal={() => {}}
                pointOfContact={teamMember}
                contactType="teamOrMember"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const modal = screen.getByTestId('remove-contact-modal');
    expect(modal).toMatchSnapshot();
  });
});
