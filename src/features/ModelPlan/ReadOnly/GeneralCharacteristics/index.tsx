import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetAllGeneralCharacteristicsQuery,
  useGetAllGeneralCharacteristicsQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

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
  const generalCharacteristicsConfig = usePlanTranslation(
    'generalCharacteristics'
  );

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetAllGeneralCharacteristicsQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
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
