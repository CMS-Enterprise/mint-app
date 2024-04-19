import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GridContainer, Icon, SummaryBox } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useTranslatedAuditCollectionQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import ChangeRecord from './components/ChangeRecord';

const ChangeHistory = () => {
  const { t } = useTranslation('changeHistory');

  const { modelID } = useParams<{
    modelID: string;
  }>();

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useTranslatedAuditCollectionQuery({
    variables: {
      modelPlanID: modelID
    }
  });

  console.log(data);

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');
  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const changes = [...(data?.translatedAuditCollection || [])];

  const changesSortedByDate = changes?.sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <MainContent>
      <SummaryBox
        className="padding-y-6 padding-x-2 border-0 bg-primary-lighter radius-0 margin-top-0"
        data-testid="read-only-model-summary"
      >
        <GridContainer>
          <div className="display-flex flex-justify">
            <UswdsReactLink
              to={`/models/${modelID}/task-list`}
              className="display-flex flex-align-center margin-bottom-4"
            >
              <Icon.ArrowBack className="text-primary margin-right-1" />
              {t('back')}
            </UswdsReactLink>
          </div>

          <PageHeading
            className="margin-0 line-height-sans-2 minh-6 margin-bottom-2"
            headingLevel="h1"
          >
            {t('heading')}
          </PageHeading>

          <span className="font-body-lg">
            {t('subheading', {
              modelName
            })}
          </span>
        </GridContainer>
      </SummaryBox>

      <GridContainer className="padding-y-4">
        {loading ? (
          <PageLoading />
        ) : (
          <>
            {changesSortedByDate.map(changeRecord => (
              <ChangeRecord changeRecord={changeRecord} key={changeRecord.id} />
            ))}
          </>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default ChangeHistory;
