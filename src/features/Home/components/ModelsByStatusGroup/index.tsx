import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Header, PrimaryNav, Select } from '@trussworks/react-uswds';
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

const HIDDEN_COLUMNS_BY_STATUS_GROUP = {
  [ModelPlanStatusGroup.PRE_CLEARANCE]: ['paymentDate', 'endDate'],
  [ModelPlanStatusGroup.IN_CLEARANCE]: ['clearanceDate', 'endDate'],
  [ModelPlanStatusGroup.CLEARED]: ['status', 'clearanceDate', 'endDate'],
  [ModelPlanStatusGroup.ANNOUNCED]: ['status', 'clearanceDate', 'endDate'],
  [ModelPlanStatusGroup.ACTIVE]: ['status', 'clearanceDate', 'paymentDate'],
  [ModelPlanStatusGroup.ENDED]: ['status', 'clearanceDate', 'paymentDate'],
  [ModelPlanStatusGroup.CANCELED]: ['status', 'paymentDate', 'endDate'],
  [ModelPlanStatusGroup.PAUSED]: ['status', 'paymentDate', 'endDate']
};

const ALL_COLUMNS_BY_STATUS_GROUP = [
  ModelPlanStatusGroup.PRE_CLEARANCE,
  ModelPlanStatusGroup.IN_CLEARANCE,
  ModelPlanStatusGroup.CLEARED,
  ModelPlanStatusGroup.ANNOUNCED,
  ModelPlanStatusGroup.ACTIVE,
  ModelPlanStatusGroup.ENDED,
  ModelPlanStatusGroup.CANCELED,
  ModelPlanStatusGroup.PAUSED
];

const ModelsByStatusGroup = () => {
  const { t: customHomeT } = useTranslation('customHome');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [currentStatus, setCurrentStatus] = useState(
    ALL_COLUMNS_BY_STATUS_GROUP[0]
  );

  const {
    data: modelPlansByStatusGroup,
    loading,
    error
  } = useGetModelPlansByStatusGroupQuery({
    variables: {
      statusGroup: currentStatus
    }
  });

  const data = useMemo(() => {
    return (modelPlansByStatusGroup?.modelPlansByStatusGroup ??
      []) as ModelPlansType[];
  }, [modelPlansByStatusGroup?.modelPlansByStatusGroup]);

  const statusNavs = ALL_COLUMNS_BY_STATUS_GROUP.map(statusGroup => (
    <Button
      type="button"
      key={statusGroup}
      onClick={() => setCurrentStatus(statusGroup)}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': currentStatus === statusGroup
      })}
      unstyled
    >
      <span>
        {customHomeT(
          `settings.${ViewCustomizationType.MODELS_BY_STATUS_GROUP}.status.${statusGroup}.label`
        )}
      </span>
    </Button>
  ));

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
            {ALL_COLUMNS_BY_STATUS_GROUP.map(statusGroup => {
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
      {loading && <PageLoading testId="models-by-status" />}

      {!loading && data.length === 0 && (
        <Alert type="info" slim>
          {customHomeT(
            `settings.${ViewCustomizationType.MODELS_BY_STATUS_GROUP}.status.${currentStatus}.noResultsHeading`
          )}
        </Alert>
      )}

      {!loading && data.length > 0 && (
        <ModelDetailsTable
          models={data}
          hiddenColumns={HIDDEN_COLUMNS_BY_STATUS_GROUP[currentStatus]}
          canSearch={data.length > 4}
        />
      )}
    </div>
  );
};

export default ModelsByStatusGroup;
