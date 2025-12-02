import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridContainer, Link } from '@trussworks/react-uswds';
import { useGetAllKeyContactsQuery } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';

const Categories = [
  {
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350',
    category: 'Healthcare'
  }
];
const Directory = [
  {
    email: 'pstm@local.cms.gov',
    id: '49bf1cbb-a994-4394-948a-1dd7ef842fde',
    name: 'pstm Doe',
    subjectArea: 'violin',
    subjectCategoryID: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350'
  }
];

const KeyContactDirectory = () => {
  const { t } = useTranslation('helpAndKnowledge');

  // Used to check if user is assessment for rendering different content and access
  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();

  const isAssessmentTeam = isAssessment(groups, flags);

  const categories = Categories; // Replace with actual data fetching logic
  //   const smes = Directory; // Replace with actual data fetching logic

  const { data: smeData, loading: loadingSmes } = useGetAllKeyContactsQuery();
  const smes = useMemo(() => smeData?.keyContacts || [], [smeData]);

  return (
    <div
      id={convertToLowercaseAndDashes(t('keyContactDirectory.jumpToLabel'))}
      className="padding-y-4 padding-bottom-6 margin-bottom-neg-7"
      style={{ scrollMarginTop: '3.5rem' }}
    >
      <GridContainer>
        <div>
          <h2 className="margin-0">{t('keyContactDirectory.header')}</h2>

          <p className="margin-top-1 margin-bottom-3 font-body-md line-height-sans-4">
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

        {categories.length > 0 && <table className="usa-table">hello</table>}
      </GridContainer>
    </div>
  );
};

export default KeyContactDirectory;
