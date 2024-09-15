import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllGeneralCharacteristicsQuery,
  useGetAllGeneralCharacteristicsQuery
} from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'contexts-wrappers/ModelInfoWrapper';
import { NotFoundPartial } from 'features/NotFound';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyGeneralCharacteristics = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const generalCharacteristicsConfig = usePlanTranslation(
    'generalCharacteristics'
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllGeneralCharacteristicsQuery({
    variables: {
      id: modelID
    }
  });

  const allgeneralCharacteristicsData = (data?.modelPlan
    .generalCharacteristics ||
    {}) as GetAllGeneralCharacteristicsQuery['modelPlan']['generalCharacteristics'];

  const {
    resemblesExistingModelWhich,
    resemblesExistingModelOtherSelected,
    participationInModelPreconditionWhich,
    participationInModelPreconditionOtherSelected,
    status
  } = allgeneralCharacteristicsData;

  // Add 'Other' to the resemblesExistingModelWhich list if resemblesExistingModelOtherSelected is true
  const linkedResemblePlans = useMemo(() => {
    const resemblesExistingModelWhichCopy = { ...resemblesExistingModelWhich }
      .names;
    const selectedPlans = [...(resemblesExistingModelWhichCopy || [])];
    if (resemblesExistingModelOtherSelected) {
      selectedPlans?.push('Other');
    }
    return selectedPlans;
  }, [resemblesExistingModelWhich, resemblesExistingModelOtherSelected]);

  // Add 'Other' to the participationInModelPrecondition list if participationInModelPreconditionOtherSelected is true
  const participationPreconditionPlans = useMemo(() => {
    const participationInModelPreconditionWhichCopy = {
      ...participationInModelPreconditionWhich
    }.names;
    const selectedPlans = [
      ...(participationInModelPreconditionWhichCopy || [])
    ];
    if (participationInModelPreconditionOtherSelected) {
      selectedPlans?.push('Other');
    }
    return selectedPlans;
  }, [
    participationInModelPreconditionWhich,
    participationInModelPreconditionOtherSelected
  ]);

  const formattedGeneralCharacteristicsData = {
    ...allgeneralCharacteristicsData,
    resemblesExistingModelWhich: linkedResemblePlans,
    participationInModelPreconditionWhich: participationPreconditionPlans
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="read-only-model-plan--general-characteristics"
      data-testid="read-only-model-plan--general-characteristics"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={generalCharacteristicsMiscT('clearanceHeading')}
        heading={generalCharacteristicsMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={status}
        modelID={modelID}
        modifiedOrCreatedDts={
          allgeneralCharacteristicsData.modifiedDts ||
          allgeneralCharacteristicsData.createdDts
        }
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <ReadOnlyBody
          data={formattedGeneralCharacteristicsData}
          config={generalCharacteristicsConfig}
          filteredView={filteredView}
        />
      )}
    </div>
  );
};

export default ReadOnlyGeneralCharacteristics;
