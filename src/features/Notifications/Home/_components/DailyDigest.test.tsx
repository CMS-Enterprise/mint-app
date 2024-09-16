import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  AnalyzedAudit as AnalyzedAuditsTypes,
  TableName
} from 'gql/generated/graphql';
import setup from 'tests/setup';

import DailyDigest from './DailyDigest';

const dailyDigestProps: AnalyzedAuditsTypes[] = [
  {
    __typename: 'AnalyzedAudit',
    id: '6e303abe-0d86-4dab-81f4-f090a985b377',
    modelPlanID: '1bf249a6-577b-42fd-8dd2-46563e3d1d9e',
    modelName: 'Empty Plan',
    date: '2024-03-20T00:00:00Z',
    createdBy: '04194827-1997-470a-b3d4-221abf4b86b6',
    createdByUserAccount: {
      __typename: 'UserAccount',
      id: '04194827-1997-470a-b3d4-221abf4b86b6',
      commonName: 'MINT Doe',
      email: 'mint@doe.oddball.io',
      familyName: 'Doe',
      givenName: 'MINT',
      locale: 'en',
      username: 'mint.doe',
      zoneInfo: 'America/New_York'
    },
    createdDts: '2024-03-20T00:00:00Z',
    changes: {
      __typename: 'AnalyzedAuditChange',
      modelPlan: {
        __typename: 'AnalyzedModelPlan',
        oldName: 'Old Name Plan',
        statusChanges: ['PLAN_COMPLETE', 'ICIP_COMPLETE', 'CMS_CLEARANCE']
      },
      documents: {
        __typename: 'AnalyzedDocuments',
        count: 2
      },
      crTdls: null,
      planSections: {
        __typename: 'AnalyzedPlanSections',
        updated: [TableName.PLAN_BASICS],
        readyForReview: [],
        readyForClearance: []
      },
      modelLeads: {
        __typename: 'AnalyzedModelLeads',
        added: [
          {
            __typename: 'AnalyzedModelLeadInfo',
            id: '04194827-1997-470a-b3d4-221abf4b86b6',
            commonName: 'MINT Doe',
            userAccount: {
              __typename: 'UserAccount',
              id: '04194827-1997-470a-b3d4-221abf4b86b6',
              commonName: 'MINT Doe',
              email: 'mint@doe.oddball.io',
              familyName: 'Doe',
              givenName: 'MINT',
              locale: 'en',
              username: 'mint.doe',
              zoneInfo: 'America/New_York'
            }
          }
        ]
      },
      planDiscussions: null
    }
  }
];

describe('Daily Digest in Notifications', () => {
  it('renders without errors', async () => {
    await act(async () => {
      setup(
        <MemoryRouter initialEntries={[`/notifications`]}>
          <Route path="/notifications">
            <DailyDigest analyzedAudits={dailyDigestProps} />
          </Route>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('notification--daily-digest')
        ).toBeInTheDocument();
        expect(screen.getByText(/Empty Plan/i)).toBeInTheDocument();
        expect(screen.getByText(/previously Old Name/i)).toBeInTheDocument();
        expect(
          screen.getByText(/MINT Doe has been added as a model lead/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/This Model Plan is complete/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Updates to Model Basics/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/2 new documents/i)).toBeInTheDocument();
        expect(
          screen.getByText('View all recent changes').closest('a')
        ).toHaveAttribute(
          'href',
          `/models/${dailyDigestProps[0].modelPlanID}/change-history`
        );
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/notifications`]}>
        <Route path="/notifications">
          <DailyDigest analyzedAudits={dailyDigestProps} />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('notification--daily-digest')
      ).toBeInTheDocument();
      expect(screen.getByText(/Empty Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/previously Old Name/i)).toBeInTheDocument();
      expect(
        screen.getByText(/MINT Doe has been added as a model lead/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This Model Plan is complete/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Updates to Model Basics/i)).toBeInTheDocument();
      expect(screen.getByText(/2 new documents/i)).toBeInTheDocument();
      expect(
        screen.getByText('View all recent changes').closest('a')
      ).toHaveAttribute(
        'href',
        `/models/${dailyDigestProps[0].modelPlanID}/change-history`
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
