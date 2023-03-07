import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetExistingModelPlans from 'queries/GetExistingModelPlans';
import GetDraftModelPlans from 'queries/GetModelPlans';
import GetAllGeneralCharacteristics from 'queries/ReadOnly/GetAllGeneralCharacteristics';
import { GetAllGeneralCharacteristics as GetAllGeneralCharacteristicsTypes } from 'queries/ReadOnly/types/GetAllGeneralCharacteristics';
import { GetExistingModelPlans as ExistingModelPlanType } from 'queries/types/GetExistingModelPlans';
import {
  GetModelPlans as GetDraftModelPlansType,
  GetModelPlansVariables
} from 'queries/types/GetModelPlans';
import { KeyCharacteristic, ModelPlanFilter } from 'types/graphql-global-types';
import {
  translateAgreementTypes,
  translateAlternativePaymentTypes,
  translateAuthorityAllowance,
  translateBooleanOrNull,
  translateGeographyApplication,
  translateGeographyTypes,
  translateKeyCharacteristics,
  translateNewModel,
  translateWaiverTypes
} from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

type ModelMapType = {
  [key: string]: string;
};

const ReadOnlyGeneralCharacteristics = ({
  modelID,
  clearance
}: ReadOnlyProps) => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const { data: modelData } = useQuery<
    GetDraftModelPlansType,
    GetModelPlansVariables
  >(GetDraftModelPlans, {
    variables: {
      filter: ModelPlanFilter.INCLUDE_ALL,
      isMAC: false
    }
  });

  const { data: existingModelData } = useQuery<ExistingModelPlanType>(
    GetExistingModelPlans
  );

  // Combined MINT models with existing models from DB
  const allModelPlans = useMemo(() => {
    const combinedModels = [
      ...(modelData?.modelPlanCollection || []),
      ...(existingModelData?.existingModelCollection || [])
    ].sort((a, b) => ((a.modelName || '') > (b.modelName || '') ? 1 : -1));
    const modelMap: ModelMapType = {};
    combinedModels.forEach(model => {
      modelMap[model!.id! as string] = model!.modelName!;
    });
    return modelMap;
  }, [modelData, existingModelData]);

  const { data, loading, error } = useQuery<GetAllGeneralCharacteristicsTypes>(
    GetAllGeneralCharacteristics,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const {
    isNewModel,
    existingModel,
    resemblesExistingModel,
    resemblesExistingModelWhich,
    resemblesExistingModelHow,
    resemblesExistingModelNote,
    hasComponentsOrTracks,
    hasComponentsOrTracksDiffer,
    hasComponentsOrTracksNote,
    alternativePaymentModelTypes,
    alternativePaymentModelNote,
    keyCharacteristics,
    keyCharacteristicsOther,
    keyCharacteristicsNote,
    collectPlanBids,
    collectPlanBidsNote,
    managePartCDEnrollment,
    managePartCDEnrollmentNote,
    planContractUpdated,
    planContractUpdatedNote,
    careCoordinationInvolved,
    careCoordinationInvolvedDescription,
    careCoordinationInvolvedNote,
    additionalServicesInvolved,
    additionalServicesInvolvedDescription,
    additionalServicesInvolvedNote,
    communityPartnersInvolved,
    communityPartnersInvolvedDescription,
    communityPartnersInvolvedNote,
    geographiesTargeted,
    geographiesTargetedTypes,
    geographiesTargetedTypesOther,
    geographiesTargetedAppliedTo,
    geographiesTargetedAppliedToOther,
    geographiesTargetedNote,
    participationOptions,
    participationOptionsNote,
    agreementTypes,
    agreementTypesOther,
    multiplePatricipationAgreementsNeeded,
    multiplePatricipationAgreementsNeededNote,
    rulemakingRequired,
    rulemakingRequiredDescription,
    rulemakingRequiredNote,
    authorityAllowances,
    authorityAllowancesOther,
    authorityAllowancesNote,
    waiversRequired,
    waiversRequiredTypes,
    waiversRequiredNote,
    status
  } = data?.modelPlan?.generalCharacteristics || {};

  // Convert 'resemblesExistingModelWhich' from and array of string 'id's to an array of model names
  const mappedExistingModels =
    allModelPlans &&
    resemblesExistingModelWhich?.map(model => {
      return allModelPlans[model as any] || model;
    });

  return (
    <div
      className="read-only-model-plan--general-characteristics"
      data-testid="read-only-model-plan--general-characteristics"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance ? t('clearanceHeading') : t('heading')}
        </h2>
        {status && <TaskListStatusTag status={status} />}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('isNewModel')}
          copy={translateNewModel(isNewModel)}
        />

        {!isNewModel && (
          <ReadOnlySection
            heading={t('whichExistingModel')}
            copy={existingModel}
          />
        )}

        <ReadOnlySection
          heading={t('resembleModel')}
          copy={translateBooleanOrNull(resemblesExistingModel)}
        />

        <ReadOnlySection
          heading={t('modelResemblance')}
          list
          listItems={mappedExistingModels}
        />

        <ReadOnlySection
          heading={t('waysResembleModel')}
          copy={resemblesExistingModelHow}
          notes={resemblesExistingModelNote}
        />

        <ReadOnlySection
          heading={t('differentComponents')}
          copy={translateBooleanOrNull(hasComponentsOrTracks)}
        />

        {hasComponentsOrTracksNote && (
          <ReadOnlySection
            heading={t('tracksDiffer')}
            copy={hasComponentsOrTracksDiffer}
            notes={hasComponentsOrTracksNote}
          />
        )}
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('modelAPM')}
          list
          listItems={alternativePaymentModelTypes?.map(
            translateAlternativePaymentTypes
          )}
          notes={alternativePaymentModelNote}
        />

        <ReadOnlySection
          heading={t('keyCharacteristicsQuestion')}
          list
          listItems={keyCharacteristics?.map(translateKeyCharacteristics)}
          listOtherItem={keyCharacteristicsOther}
          notes={keyCharacteristicsNote}
        />

        {(keyCharacteristics?.includes(KeyCharacteristic.PART_C) ||
          keyCharacteristics?.includes(KeyCharacteristic.PART_D)) && (
          <>
            <ReadOnlySection
              heading={t('reviewPlanBids')}
              copy={translateBooleanOrNull(collectPlanBids)}
              notes={collectPlanBidsNote}
            />

            <ReadOnlySection
              heading={t('manageEnrollment')}
              copy={translateBooleanOrNull(managePartCDEnrollment)}
              notes={managePartCDEnrollmentNote}
            />

            <ReadOnlySection
              heading={t('updatedContract')}
              copy={translateBooleanOrNull(planContractUpdated)}
              notes={planContractUpdatedNote}
            />
          </>
        )}
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('careCoordination')}
              copy={translateBooleanOrNull(careCoordinationInvolved)}
            />
          </div>
          {careCoordinationInvolved && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('howSo')}
                copy={careCoordinationInvolvedDescription}
              />
            </div>
          )}
        </div>
        {careCoordinationInvolvedNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={careCoordinationInvolvedNote}
          />
        )}

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('additionalServices')}
              copy={translateBooleanOrNull(additionalServicesInvolved)}
            />
          </div>
          {additionalServicesInvolved && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('howSo')}
                copy={additionalServicesInvolvedDescription}
              />
            </div>
          )}
        </div>
        {additionalServicesInvolvedNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={additionalServicesInvolvedNote}
          />
        )}

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('communityInvolved')}
              copy={translateBooleanOrNull(communityPartnersInvolved)}
            />
          </div>
          {communityPartnersInvolved && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('howSo')}
                copy={communityPartnersInvolvedDescription}
              />
            </div>
          )}
        </div>
        {communityPartnersInvolvedNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={communityPartnersInvolvedNote}
          />
        )}
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('specificGeographies')}
          copy={translateBooleanOrNull(geographiesTargeted)}
        />

        <ReadOnlySection
          heading={t('geographyType')}
          list
          listItems={geographiesTargetedTypes?.map(translateGeographyTypes)}
          listOtherItem={geographiesTargetedTypesOther}
        />

        <ReadOnlySection
          heading={t('geographyApplied')}
          list
          listItems={geographiesTargetedAppliedTo?.map(
            translateGeographyApplication
          )}
          listOtherItem={geographiesTargetedAppliedToOther}
          notes={geographiesTargetedNote}
        />

        <ReadOnlySection
          heading={t('participationOptions')}
          copy={translateBooleanOrNull(participationOptions)}
          notes={participationOptionsNote}
        />

        <ReadOnlySection
          heading={t('agreementType')}
          list
          listItems={agreementTypes?.map(translateAgreementTypes)}
          listOtherItem={agreementTypesOther}
        />

        <ReadOnlySection
          heading={t('moreParticipation')}
          copy={translateBooleanOrNull(multiplePatricipationAgreementsNeeded)}
          notes={multiplePatricipationAgreementsNeededNote}
        />
      </div>
      <div className="margin-bottom-4 padding-bottom-2">
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('rulemakingRequired')}
              copy={translateBooleanOrNull(rulemakingRequired)}
            />
          </div>

          {rulemakingRequired && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={t('ruleMakingInfo')}
                copy={rulemakingRequiredDescription}
              />
            </div>
          )}
        </div>
        {rulemakingRequiredNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={rulemakingRequiredNote}
          />
        )}

        <ReadOnlySection
          heading={t('authorityAllowed')}
          list
          listItems={authorityAllowances?.map(translateAuthorityAllowance)}
          listOtherItem={authorityAllowancesOther}
          notes={authorityAllowancesNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('waiversRequired')}
              copy={translateBooleanOrNull(waiversRequired)}
            />
          </div>

          {waiversRequired && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={t('waiverTypesQuestion')}
                list
                listItems={waiversRequiredTypes?.map(translateWaiverTypes)}
              />
            </div>
          )}
        </div>
        {waiversRequiredNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={waiversRequiredNote}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyGeneralCharacteristics;
