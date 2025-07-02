import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Grid, Link as TrussLink } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import { GetAllBasicsQuery, useGetAllBasicsQuery } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { isAssessment } from 'utils/user';

import ReadOnlyBody from '../_components/Body';
import { FilterGroup } from '../_components/FilterView/BodyContent/_filterGroupMapping';
import ReadOnlySection from '../_components/ReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';

import './index.scss';

export type ReadOnlyProps = {
  modelID: string;
  clearance?: boolean;
  filteredView?: FilterGroup;
};

const ReadOnlyModelBasics = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const modelPlanConfig = usePlanTranslation('modelPlan');
  const basicsConfig = usePlanTranslation('basics');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllBasicsQuery({
    variables: {
      id: modelID
    }
  });

  const flags = useFlags();
  const isCollaborator = data?.modelPlan?.isCollaborator;
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const hasEditAccess: boolean = isCollaborator || isAssessment(groups, flags);

  const allBasicsData = (data?.modelPlan.basics ||
    {}) as GetAllBasicsQuery['modelPlan']['basics'];

  const { nameHistory } = data?.modelPlan || {};

  const filteredNameHistory = nameHistory?.filter(
    previousName => previousName !== modelName
  );

  const { demoCode, amsModelID, status } = allBasicsData;

  // Removing unneeded configurations from basicsConfig
  // Removed configurations will be manually rendered
  const {
    demoCode: demoCodeRemoved,
    amsModelID: amsModelIDRemoved,
    ...filteredBasicsConfig
  } = basicsConfig;

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="read-only-model-plan--model-basics"
      data-testid="read-only-model-plan--model-basics"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={basicsMiscT('clearanceHeading')}
        heading={basicsMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={status}
        modelID={modelID}
        modifiedOrCreatedDts={
          allBasicsData.modifiedDts || allBasicsData.createdDts
        }
      />

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <>
          <ReadOnlySection
            field="nameHistory"
            translations={modelPlanConfig}
            values={{ nameHistory: filteredNameHistory }}
            filteredView={filteredView}
          />

          {/* Other Identifiers section */}
          {!filteredView && (
            <div
              className={classNames(
                'bg-base-lightest padding-2 margin-top-4 margin-bottom-4',
                {
                  'maxw-mobile-lg': isTablet
                }
              )}
            >
              <p className="margin-top-0 text-bold">
                {basicsMiscT('otherIdentifiers')}
              </p>

              <p className="line-height-mono-4">
                {basicsMiscT('otherIdentifiersInfo1')}

                <span className="mint-no-print">
                  <TrussLink
                    aria-label="Open AMS in a new tab"
                    href="https://ams.cmmi.cms.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {basicsMiscT('otherIdentifiersInfo2')}
                  </TrussLink>
                </span>

                <span className="mint-only-print-inline">
                  {basicsMiscT('otherIdentifiersInfo2')}
                </span>

                {hasEditAccess
                  ? basicsMiscT('otherIdentifiersInfo3')
                  : basicsMiscT('otherIdentifiersInfo_noEditAccess')}
              </p>

              <Grid row gap>
                <Grid
                  col={6}
                  className={classNames({
                    'padding-bottom-2': isTablet
                  })}
                >
                  <p className="text-bold margin-top-0 margin-bottom-1">
                    {basicsT('amsModelID.label')}
                  </p>

                  {amsModelID || (
                    <div className="text-italic text-base">
                      {miscellaneousT('noneEntered')}
                    </div>
                  )}
                </Grid>
                <Grid col={6}>
                  <p className="text-bold margin-top-0 margin-bottom-1">
                    {basicsT('demoCode.label')}
                  </p>

                  {demoCode || (
                    <div className="text-italic text-base">
                      {miscellaneousT('noneEntered')}
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
          )}

          <ReadOnlyBody
            data={allBasicsData}
            config={filteredBasicsConfig}
            filteredView={filteredView}
          />
        </>
      )}
    </div>
  );
};

export default ReadOnlyModelBasics;
