import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  GetChangeHistoryDocument,
  GetModelPlanQuery,
  TranslationDataType
} from 'gql/generated/graphql';

import MessageProvider from 'contexts/MessageContext';

import TaskListSideNav from './index';

type GetModelPlanType = GetModelPlanQuery['modelPlan'];

const modelPlan = {
  modelName: 'Test',
  id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905'
} as GetModelPlanType;

const modelPlanId = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const changeHistoryMock = [
  {
    request: {
      query: GetChangeHistoryDocument,
      variables: {
        modelPlanID: modelPlanId
      }
    },
    result: {
      data: {
        translatedAuditCollection: [
          {
            id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
            tableName: 'plan_basics',
            date: '2024-04-22T13:55:13.725192Z',
            action: DatabaseOperation.INSERT,
            metaData: {
              version: 1,
              tableName: 'plan_basics'
            },
            translatedFields: [
              {
                id: 'b23eceab-fbf6-433a-ba2a-fd4482c4484e',
                changeType: AuditFieldChangeType.ANSWERED,
                dataType: TranslationDataType.BOOLEAN,
                fieldName: 'model_type',
                fieldNameTranslated: 'Model type',
                referenceLabel: null,
                questionType: null,
                notApplicableQuestions: null,
                old: null,
                oldTranslated: null,
                new: 'READY',
                newTranslated: 'Ready',
                __typename: 'TranslatedAuditField'
              }
            ],
            actorName: 'MINT Doe',
            __typename: 'TranslatedAudit'
          }
        ]
      }
    }
  }
];

describe('The TaskListSideNavActions', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <MockedProvider mocks={[...changeHistoryMock]} addTypename={false}>
          <Route path="models/:modelID/collaboration-area/task-list">
            <MessageProvider>
              <TaskListSideNav
                modelPlan={modelPlan}
                collaborators={[]}
                setStatusMessage={() => null}
              />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
