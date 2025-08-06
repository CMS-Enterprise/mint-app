import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetAllBeneficiariesQuery,
  useGetAllBeneficiariesQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyBeneficiaries = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: beneficiariesMiscT } = useTranslation('beneficiariesMisc');
  const beneficiariesConfig = usePlanTranslation('beneficiaries');

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetAllBeneficiariesQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const allbeneficiariesData = (data?.modelPlan.beneficiaries ||
    {}) as GetAllBeneficiariesQuery['modelPlan']['beneficiaries'];

  return (
    <div
      className="read-only-model-plan--beneficiaries"
      data-testid="read-only-model-plan--beneficiaries"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={beneficiariesMiscT('clearanceHeading')}
        heading={beneficiariesMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allbeneficiariesData.status}
        modelID={modelID}
        modifiedOrCreatedDts={
          allbeneficiariesData.modifiedDts || allbeneficiariesData.createdDts
        }
      />

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <ReadOnlyBody
          data={allbeneficiariesData}
          config={beneficiariesConfig}
          filteredView={filteredView}
        />
      )}
    </div>
  );
};

export default ReadOnlyBeneficiaries;
