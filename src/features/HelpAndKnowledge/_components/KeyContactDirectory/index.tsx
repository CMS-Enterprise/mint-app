import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Accordion,
  Button,
  GridContainer,
  Link
} from '@trussworks/react-uswds';
import {
  GetAllKeyContactsQuery,
  useGetAllKeyContactsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';

import KeyContactTable from './KeyContactTable';

import './index.scss';

const Categories = [
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350',
    category: 'Healthcare'
  },
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e351',
    category: 'CMS Programs'
  }
];

export type SmeType = GetAllKeyContactsQuery['keyContacts'][number];

const KeyContactDirectory = () => {
  const { t } = useTranslation('helpAndKnowledge');

  // Used to check if user is assessment for rendering different content and access
  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();

  const isAssessmentTeam = isAssessment(groups, flags);

  const categories = Categories; // Replace with actual data fetching logic

  const { data: smeData, loading: loadingSmes } = useGetAllKeyContactsQuery();

  const smes: Record<string, SmeType[]> = useMemo(() => {
    const reformattedSmes = smeData?.keyContacts.reduce(
      (allSmes, sme) => {
        return {
          ...allSmes,
          [sme.subjectCategoryID]: allSmes[sme.subjectCategoryID]
            ? [...allSmes[sme.subjectCategoryID], sme]
            : [sme]
        };
      },
      {} as { [key: string]: SmeType[] }
    );
    return reformattedSmes || {};
  }, [smeData]);

  if (loadingSmes) {
    return <PageLoading testId="key-contact-directory" />;
  }

  return (
    <div
      id={convertToLowercaseAndDashes(t('keyContactDirectory.jumpToLabel'))}
      className="padding-y-4 padding-bottom-6 margin-bottom-neg-7"
      style={{ scrollMarginTop: '3.5rem' }}
    >
      <GridContainer>
        <div>
          <h2 className="margin-0">{t('keyContactDirectory.header')}</h2>

          <p className="margin-top-1 margin-bottom-2 font-body-md line-height-sans-4">
            {isAssessmentTeam ? (
              t('keyContactDirectory.descriptionForAssessment')
            ) : (
              <Trans
                i18nKey="helpAndKnowledge:keyContactDirectory.descriptionForGeneral"
                components={{
                  email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                }}
              />
            )}
          </p>

          {isAssessmentTeam && (
            <div className="margin-bottom-4">
              <Button
                type="button"
                unstyled
                onClick={() => {}}
                className="line-height-sans-4"
              >
                {t('keyContactDirectory.addSubjectCategory')}
              </Button>
              <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
              <Button
                type="button"
                unstyled
                onClick={() => {}}
                className="line-height-sans-4"
              >
                {t('keyContactDirectory.addSme')}
              </Button>
            </div>
          )}
        </div>

        {categories.length === 0 && (
          <Alert
            type="info"
            heading={t('keyContactDirectory.emptyDirectoryHeading')}
          >
            <Trans
              i18nKey={
                isAssessmentTeam
                  ? 'helpAndKnowledge:keyContactDirectory.emptyDirectoryInfoForAssessment'
                  : 'helpAndKnowledge:keyContactDirectory.emptyDirectoryInfoForGeneral'
              }
              components={{
                email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
              }}
            />
          </Alert>
        )}

        {categories.length > 0 &&
          categories.map(category => (
            <Accordion
              key={category.id}
              className="margin-bottom-3 key-contact-accordion"
              bordered={false}
              multiselectable
              items={[
                {
                  title: category.category,
                  content: (
                    <KeyContactTable
                      smes={smes[category.id] || []}
                      isAssessmentTeam={isAssessmentTeam}
                    />
                  ),
                  expanded: true,
                  id: category.id,
                  headingLevel: 'h4'
                }
              ]}
            />
          ))}
      </GridContainer>
    </div>
  );
};

export default KeyContactDirectory;
