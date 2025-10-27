import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetModelPlansQuery,
  ModelPlanFilter,
  useGetModelPlansQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { ModelByStatusEnum } from 'i18n/en-US/home/customHome';

import ModelDetailsTable from '../ModelDetailsTable';

export type ModelPlansType = GetModelPlansQuery['modelPlanCollection'][number];

const HIDDEN_COLUMNS_BY_STATUS = {
  [ModelByStatusEnum.PRE_CLEARANCE]: ['paymentDate', 'endDate'],
  [ModelByStatusEnum.IN_CLEARANCE]: ['clearanceDate', 'endDate'],
  [ModelByStatusEnum.CLEARED]: ['status', 'paymentDate', 'endDate'],
  [ModelByStatusEnum.ANNOUNCED]: ['status', 'clearanceDate', 'endDate'],
  [ModelByStatusEnum.ACTIVE]: ['status', 'clearanceDate', 'paymentDate'],
  [ModelByStatusEnum.ENDED]: ['status', 'clearanceDate', 'paymentDate'],
  [ModelByStatusEnum.CANCELED]: ['status', 'paymentDate', 'endDate'],
  [ModelByStatusEnum.PAUSED]: ['status', 'paymentDate', 'endDate']
};

const ModelsByStatus = () => {
  const { t: customHomeT } = useTranslation('customHome');

  const isMobile = useCheckResponsiveScreen('mobile');

  const orderedModelPlanStatusKeys = useMemo(
    () => Object.values(ModelByStatusEnum),
    []
  );

  const [currentStatus, setCurrentStatus] = useState(
    orderedModelPlanStatusKeys[0]
  );

  const {
    data: modelPlans,
    loading,
    error
  } = useGetModelPlansQuery({
    variables: {
      filter: ModelPlanFilter.INCLUDE_ALL,
      isMAC: false
    }
  });

  const data = useMemo(() => {
    return (modelPlans?.modelPlanCollection ?? []) as ModelPlansType[];
  }, [modelPlans?.modelPlanCollection]);

  const statusNavs = orderedModelPlanStatusKeys.map(statusKey => (
    <button
      type="button"
      key={statusKey}
      onClick={() => setCurrentStatus(statusKey)}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': currentStatus === statusKey
      })}
    >
      <span>{statusKey}</span>
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
      {!isMobile && (
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

      {isMobile && (
        <div className="maxw-mobile-lg">
          <Select
            id="solutionKey"
            name="solutionKey"
            value={currentStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCurrentStatus(e.currentTarget.value as ModelByStatusEnum)
            }
            className="margin-bottom-4 text-primary text-bold"
          >
            {orderedModelPlanStatusKeys.map(statusKey => {
              return (
                <option key={statusKey} value={statusKey}>
                  {statusKey}
                </option>
              );
            })}
          </Select>
        </div>
      )}

      {data.length === 0 && (
        <Alert
          type="info"
          heading={customHomeT(
            `settings.${ViewCustomizationType.MODELS_BY_STATUS}.noResultsHeading.${currentStatus}`
          )}
        />
      )}

      {data.length > 0 && (
        <ModelDetailsTable
          models={data}
          hiddenColumns={HIDDEN_COLUMNS_BY_STATUS[currentStatus]}
        />
      )}
    </div>
  );
};

export default ModelsByStatus;
