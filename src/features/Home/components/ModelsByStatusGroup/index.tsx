import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetModelPlansByStatusGroupQuery,
  ModelPlanStatusGroup,
  useGetModelPlansByStatusGroupQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import ModelDetailsTable from '../ModelDetailsTable';

export type ModelPlansType =
  GetModelPlansByStatusGroupQuery['modelPlansByStatusGroup'][number];

const HIDDEN_COLUMNS_BY_STATUS = {
  [ModelPlanStatusGroup.PRE_CLEARANCE]: ['paymentDate', 'endDate'],
  [ModelPlanStatusGroup.IN_CLEARANCE]: ['clearanceDate', 'endDate'],
  [ModelPlanStatusGroup.CLEARED]: ['status', 'clearanceDate', 'endDate'],
  [ModelPlanStatusGroup.ANNOUNCED]: ['status', 'clearanceDate', 'endDate'],
  [ModelPlanStatusGroup.ACTIVE]: ['status', 'clearanceDate', 'paymentDate'],
  [ModelPlanStatusGroup.ENDED]: ['status', 'clearanceDate', 'paymentDate'],
  [ModelPlanStatusGroup.CANCELED]: ['status', 'paymentDate', 'endDate'],
  [ModelPlanStatusGroup.PAUSED]: ['status', 'paymentDate', 'endDate']
};

const ModelsByStatusGroup = () => {
  const { t: customHomeT } = useTranslation('customHome');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const orderedModelPlanStatusGroups = useMemo(
    () => [
      ModelPlanStatusGroup.PRE_CLEARANCE,
      ModelPlanStatusGroup.IN_CLEARANCE,
      ModelPlanStatusGroup.CLEARED,
      ModelPlanStatusGroup.ANNOUNCED,
      ModelPlanStatusGroup.ACTIVE,
      ModelPlanStatusGroup.ENDED,
      ModelPlanStatusGroup.CANCELED,
      ModelPlanStatusGroup.PAUSED
    ],
    []
  );

  const [currentStatus, setCurrentStatus] = useState(
    orderedModelPlanStatusGroups[0]
  );

  const {
    data: modelPlansByStatusGroup,
    loading,
    error
  } = useGetModelPlansByStatusGroupQuery({
    variables: {
      statusGroup: currentStatus as ModelPlanStatusGroup
    }
  });

  const data = useMemo(() => {
    return (modelPlansByStatusGroup?.modelPlansByStatusGroup ??
      []) as ModelPlansType[];
  }, [modelPlansByStatusGroup?.modelPlansByStatusGroup]);

  const statusNavs = orderedModelPlanStatusGroups.map(statusGroup => (
    <button
      type="button"
      key={statusGroup}
      onClick={() => setCurrentStatus(statusGroup)}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': currentStatus === statusGroup
      })}
    >
      <span>
        {customHomeT(
          `settings.${ViewCustomizationType.MODELS_BY_STATUS_GROUP}.status.${statusGroup}.label`
        )}
      </span>
    </button>
  ));

  if (loading) {
    return <PageLoading testId="models-by-status" />;
  }

  if (error) {
    return <Alert type="error">{customHomeT('fetchError')}</Alert>;
  }

  return (
    <div className="models-by-solutions">
      {!isTablet && (
        <Header
          basic
          extended={false}
          className="margin-bottom-4 models-by-solutions__nav-container"
        >
          <div className="usa-nav-container padding-0">
            <PrimaryNav
              items={statusNavs}
              mobileExpanded={false}
              className="flex-justify-start margin-0 padding-0"
            />
          </div>
        </Header>
      )}

      {isTablet && (
        <div className="maxw-mobile-lg">
          <Select
            id="solutionKey"
            name="solutionKey"
            value={currentStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCurrentStatus(e.currentTarget.value as ModelPlanStatusGroup)
            }
            className="margin-bottom-4 text-primary text-bold"
          >
            {orderedModelPlanStatusGroups.map(statusGroup => {
              return (
                <option key={statusGroup} value={statusGroup}>
                  {customHomeT(
                    `settings.${ViewCustomizationType.MODELS_BY_STATUS_GROUP}.status.${statusGroup}.label`
                  )}
                </option>
              );
            })}
          </Select>
        </div>
      )}

      {data.length > 0 ? (
        <ModelDetailsTable
          models={data}
          hiddenColumns={HIDDEN_COLUMNS_BY_STATUS[currentStatus]}
          canSearch={data.length > 4}
        />
      ) : (
        <Alert
          type="info"
          heading={customHomeT(
            `settings.${ViewCustomizationType.MODELS_BY_STATUS_GROUP}.status.${currentStatus}.noResultsHeading`
          )}
        />
      )}
    </div>
  );
};

export default ModelsByStatusGroup;
