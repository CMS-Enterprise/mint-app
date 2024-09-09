import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllBeneficiariesQuery,
  useGetAllBeneficiariesQuery
} from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyBeneficiaries = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: beneficiariesMiscT } = useTranslation('beneficiariesMisc');

  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const beneficiariesConfig = usePlanTranslation('beneficiaries');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllBeneficiariesQuery({
    variables: {
      id: modelID
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
          data={allbeneficiariesData}
          config={beneficiariesConfig}
          filteredView={filteredView}
        />
      )}
    </div>
  );
};

export default ReadOnlyBeneficiaries;
