import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render } from '@testing-library/react';
import {
  AuditFieldChangeType,
  DatabaseOperation,
  TableName,
  TranslationDataType
} from 'gql/generated/graphql';

import ChangeRecord, { ChangeRecordType } from './index';

describe('ChangeRecord', () => {
  const mockChangeRecord: ChangeRecordType = {
    id: 'e9e1129d-2317-4acd-8d2b-7ca37b37f802',
    tableName: TableName.PLAN_BASICS,
    date: '2024-04-22T13:55:13.725192Z',
    action: DatabaseOperation.INSERT,
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
  };

  it('renders without crashing', () => {
    render(<ChangeRecord changeRecord={mockChangeRecord} index={1} />);
  });

  it('displays actor name', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    expect(getByText('MINT Doe')).toBeInTheDocument();
  });

  it('displays translated fields', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    expect(getByText('Model type')).toBeInTheDocument();
  });

  it('uses generic metadata for custom timeline date-only updates', () => {
    const customTimelineDateRecord: ChangeRecordType = {
      id: 'bfbf2c34-7e6c-4c12-9d97-605e3aa3aace',
      tableName: TableName.CUSTOM_TIMELINE_DATE,
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.UPDATE,
      translatedFields: [
        {
          id: 'efad5c6d-c7e5-47a4-8981-27b14d9424c3',
          changeType: AuditFieldChangeType.UPDATED,
          dataType: TranslationDataType.DATE,
          fieldName: 'start_date',
          fieldNameTranslated: 'Start date',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: '2026-01-01T00:00:00Z',
          oldTranslated: '01/01/2026',
          new: '2026-02-01T00:00:00Z',
          newTranslated: '02/01/2026',
          __typename: 'TranslatedAuditField'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaGeneric',
        version: 0,
        tableName: TableName.CUSTOM_TIMELINE_DATE,
        relation: 'title',
        relationContent: 'Custom date title'
      },
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };

    const { getByText } = render(
      <ChangeRecord changeRecord={customTimelineDateRecord} index={1} />
    );

    expect(
      getByText(/updated Custom date title in model timeline/)
    ).toBeInTheDocument();
  });

  it('displays discussion content and reveals the topic in details', () => {
    const discussionRecord: ChangeRecordType = {
      id: 'c3a8c2e1-1d4b-4e2a-9f11-2b0d8c6e9a01',
      tableName: TableName.PLAN_DISCUSSION,
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'a11eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.ENUM,
          fieldName: 'topic',
          fieldNameTranslated: 'Discussion topic',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'MODEL_PLAN_MODEL_BASICS',
          newTranslated: 'Model basics',
          __typename: 'TranslatedAuditField'
        },
        {
          id: 'b22eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.STRING,
          fieldName: 'content',
          fieldNameTranslated: 'Type your question or discussion topic',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'How do I get started?',
          newTranslated: 'How do I get started?',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'MINT Doe',
      __typename: 'TranslatedAudit'
    };

    const { getByText, queryByText } = render(
      <MockedProvider>
        <ChangeRecord changeRecord={discussionRecord} index={1} />
      </MockedProvider>
    );

    expect(getByText(/started a Discussion/)).toBeInTheDocument();
    expect(queryByText(/about Model basics/)).not.toBeInTheDocument();
    expect(getByText(/How do I get started?/)).toBeInTheDocument();
    expect(queryByText('Topic: Model basics')).not.toBeInTheDocument();

    fireEvent.click(getByText('Show details'));

    expect(getByText('Topic: Model basics')).toBeInTheDocument();
    expect(getByText('Hide details')).toBeInTheDocument();
  });

  it('renders assessment star avatar for assessor discussion change', () => {
    const discussionRecord: ChangeRecordType = {
      id: 'c3a8c2e1-1d4b-4e2a-9f11-2b0d8c6e9a01',
      tableName: TableName.PLAN_DISCUSSION,
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'c33eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.BOOLEAN,
          fieldName: 'is_assessment',
          fieldNameTranslated: 'Is the user an assessment user?',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'true',
          newTranslated: 'Yes',
          __typename: 'TranslatedAuditField'
        },
        {
          id: 'b22eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.STRING,
          fieldName: 'content',
          fieldNameTranslated: 'Type your question or discussion topic',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'How do I get started?',
          newTranslated: 'How do I get started?',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'Assessment User',
      __typename: 'TranslatedAudit'
    };

    const { getByTestId } = render(
      <MockedProvider>
        <ChangeRecord changeRecord={discussionRecord} index={1} />
      </MockedProvider>
    );

    expect(getByTestId('avatar--assessment')).toBeInTheDocument();
  });

  it('renders initials avatar for non-assessor discussion change', () => {
    const discussionRecord: ChangeRecordType = {
      id: 'c3a8c2e1-1d4b-4e2a-9f11-2b0d8c6e9a01',
      tableName: TableName.DISCUSSION_REPLY,
      date: '2024-04-22T13:55:13.725192Z',
      action: DatabaseOperation.INSERT,
      translatedFields: [
        {
          id: 'b22eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.ANSWERED,
          dataType: TranslationDataType.STRING,
          fieldName: 'content',
          fieldNameTranslated: 'Type your question or discussion topic',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: null,
          oldTranslated: null,
          new: 'A reply',
          newTranslated: 'A reply',
          __typename: 'TranslatedAuditField'
        }
      ],
      actorName: 'Regular User',
      __typename: 'TranslatedAudit'
    };

    const { getByTestId } = render(
      <MockedProvider>
        <ChangeRecord changeRecord={discussionRecord} index={1} />
      </MockedProvider>
    );

    expect(getByTestId('avatar--basic')).toBeInTheDocument();
  });

  it('toggles details when "showDetails" and "hideDetails" are clicked', () => {
    const { getByText } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    const showDetailsButton = getByText('Show details');
    fireEvent.click(showDetailsButton);

    expect(getByText('Hide details')).toBeInTheDocument();
    const hideDetailsButton = getByText('Hide details');

    fireEvent.click(hideDetailsButton);
    expect(showDetailsButton).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <ChangeRecord changeRecord={mockChangeRecord} index={1} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('attributes a manually-marked SIX_PAGER status change to the acting user, not MINT', () => {
    const sixPagerRecord: ChangeRecordType = {
      id: 'd4b7e6a1-9c2e-4f3a-8b1d-1a2b3c4d5e6f',
      tableName: TableName.PLAN_TASK,
      date: '2024-06-28T12:00:00.000000Z',
      action: DatabaseOperation.UPDATE,
      translatedFields: [
        {
          id: '9f1eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.UPDATED,
          dataType: TranslationDataType.ENUM,
          fieldName: 'state',
          fieldNameTranslated: 'State',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: 'TO_DO',
          oldTranslated: 'To do',
          new: 'COMPLETE',
          newTranslated: 'Complete',
          __typename: 'TranslatedAuditField'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaGeneric',
        version: 0,
        tableName: TableName.PLAN_TASK,
        relation: 'SIX_PAGER',
        relationContent:
          'Prepare for your 6-page review meeting with CMMI Front Office'
      },
      actorName: 'Jane McModelteam',
      __typename: 'TranslatedAudit'
    };

    const { getByText, queryByText } = render(
      <ChangeRecord changeRecord={sixPagerRecord} index={1} />
    );

    expect(getByText('Jane McModelteam')).toBeInTheDocument();
    expect(queryByText('MINT')).not.toBeInTheDocument();
    expect(
      getByText(
        /marked a task \(Prepare for your 6-page review meeting with CMMI Front Office\) as Complete/
      )
    ).toBeInTheDocument();
  });

  it('attributes an automatically-activated SIX_PAGER status change to MINT, not the triggering user', () => {
    const sixPagerActivationRecord: ChangeRecordType = {
      id: 'f5c8d7b2-3a4e-4b5c-9d6e-7f8a9b0c1d2e',
      tableName: TableName.PLAN_TASK,
      date: '2024-06-28T12:01:00.000000Z',
      action: DatabaseOperation.UPDATE,
      translatedFields: [
        {
          id: 'a01eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.UPDATED,
          dataType: TranslationDataType.ENUM,
          fieldName: 'state',
          fieldNameTranslated: 'State',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: 'UPCOMING',
          oldTranslated: 'Upcoming',
          new: 'TO_DO',
          newTranslated: 'To do',
          __typename: 'TranslatedAuditField'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaGeneric',
        version: 0,
        tableName: TableName.PLAN_TASK,
        relation: 'SIX_PAGER',
        relationContent:
          'Prepare for your 6-page review meeting with CMMI Front Office'
      },
      // The user who triggered the cascade by completing TWO_PAGER - the backend attributes the
      // SIX_PAGER activation write itself to the MINT system account, not this user.
      actorName: 'Mint System Account',
      __typename: 'TranslatedAudit'
    };

    const { getByText, queryByText } = render(
      <ChangeRecord changeRecord={sixPagerActivationRecord} index={1} />
    );

    expect(getByText('MINT')).toBeInTheDocument();
    expect(queryByText('Mint System Account')).not.toBeInTheDocument();
    expect(
      getByText(
        /automatically marked a task \(Prepare for your 6-page review meeting with CMMI Front Office\) as To do/
      )
    ).toBeInTheDocument();
  });

  it('attributes an automatically-calculated plan task status change to MINT', () => {
    const autoRecord: ChangeRecordType = {
      id: 'a1b2c3d4-5e6f-4a1b-9c2d-3e4f5a6b7c8d',
      tableName: TableName.PLAN_TASK,
      date: '2024-06-28T12:01:00.000000Z',
      action: DatabaseOperation.UPDATE,
      translatedFields: [
        {
          id: '8e1eceab-fbf6-433a-ba2a-fd4482c4484e',
          changeType: AuditFieldChangeType.UPDATED,
          dataType: TranslationDataType.ENUM,
          fieldName: 'state',
          fieldNameTranslated: 'State',
          referenceLabel: null,
          questionType: null,
          notApplicableQuestions: null,
          old: 'UPCOMING',
          oldTranslated: 'Upcoming',
          new: 'TO_DO',
          newTranslated: 'To do',
          __typename: 'TranslatedAuditField'
        }
      ],
      metaData: {
        __typename: 'TranslatedAuditMetaGeneric',
        version: 0,
        tableName: TableName.PLAN_TASK,
        relation: 'MODEL_PLAN',
        relationContent: 'Model Plan'
      },
      actorName: 'Jane McModelteam',
      __typename: 'TranslatedAudit'
    };

    const { getByText, queryByText } = render(
      <ChangeRecord changeRecord={autoRecord} index={1} />
    );

    expect(getByText('MINT')).toBeInTheDocument();
    expect(queryByText('Jane McModelteam')).not.toBeInTheDocument();
    expect(
      getByText(/automatically marked a task \(Model Plan\) as To do/)
    ).toBeInTheDocument();
  });
});
