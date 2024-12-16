import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GetMtoCategoriesDocument,
  GetMtoMilestoneDocument,
  MtoCommonMilestoneKey,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';
import { modelID } from 'tests/mock/general';

import MessageProvider from 'contexts/MessageContext';

import ActionMenu from '.';

const mocks = [
  {
    request: {
      query: GetMtoMilestoneDocument,
      variables: {
        id: '123'
      }
    },
    result: {
      data: {
        mtoMilestone: {
          __typename: 'MtoMilestone',
          id: '123',
          name: 'Milestone 1',
          key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
          facilitatedBy: [],
          needBy: '2021-08-01',
          status: MtoMilestoneStatus.COMPLETED,
          riskIndicator: MtoRiskIndicator.AT_RISK,
          addedFromMilestoneLibrary: true,
          isDraft: false,
          categories: {
            category: {
              __typename: 'MtoCategory',
              id: '1'
            },
            subCategory: {
              __typename: 'MtoSubcategory',
              id: '2'
            }
          }
        }
      }
    }
  },
  {
    request: {
      query: GetMtoCategoriesDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          mtoMatrix: {
            __typename: 'MtoMatrix',
            categories: [
              {
                __typename: 'MtoCategory',
                id: '123',
                name: 'Category 1',
                subCategories: {
                  __typename: 'MtoSubCategory',
                  id: '123',
                  name: 'SubCategory 1'
                }
              }
            ]
          }
        }
      }
    }
  }
];

describe('Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <ActionMenu
            rowType="milestone"
            milestoneID="123"
            MoveDown={<></>}
            MoveUp={<></>}
          />
        </MessageProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('opens and closes the modal based on URL parameter', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?edit-milestone=123`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
          <MockedProvider mocks={mocks} addTypename={false}>
            <MessageProvider>
              <ActionMenu
                rowType="milestone"
                milestoneID="123"
                MoveDown={<></>}
                MoveUp={<></>}
              />
            </MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
