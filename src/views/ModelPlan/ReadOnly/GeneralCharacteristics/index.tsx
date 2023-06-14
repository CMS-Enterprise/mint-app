import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllGeneralCharacteristics from 'queries/ReadOnly/GetAllGeneralCharacteristics';
import { GetAllGeneralCharacteristics as GetAllGeneralCharacteristicsTypes } from 'queries/ReadOnly/types/GetAllGeneralCharacteristics';
import { KeyCharacteristic } from 'types/graphql-global-types';
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

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyGeneralCharacteristics = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<GetAllGeneralCharacteristicsTypes>(
    GetAllGeneralCharacteristics,
    {
      variables: {
        id: modelID
      }
    }
  );

  const mappedExistingModels: (string | number)[] = useMemo(() => {
    return (
      data?.modelPlan?.existingModelLinks?.map(
        link =>
          (link.currentModelPlan?.modelName || link.existingModel?.modelName)!
      ) || []
    );
  }, [data?.modelPlan?.existingModelLinks]);

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const {
    isNewModel,
    existingModel,
    resemblesExistingModel,
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

  return (
    <div
      className="read-only-model-plan--general-characteristics"
      data-testid="read-only-model-plan--general-characteristics"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance ? t('clearanceHeading') : t('heading')}
        </h2>
        {!isViewingFilteredView && status && (
          <TaskListStatusTag status={status} />
        )}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 border-bottom-1px border-base-light padding-bottom-2'
        }`}
      >
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

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 border-bottom-1px border-base-light padding-bottom-2'
        }`}
      >
        <ReadOnlySection
          heading={t('modelAPM')}
          list
          listItems={alternativePaymentModelTypes?.map(
            translateAlternativePaymentTypes
          )}
          notes={alternativePaymentModelNote}
        />

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'keyCharacteristics',
          <ReadOnlySection
            heading={t('keyCharacteristicsQuestion')}
            list
            listItems={keyCharacteristics?.map(translateKeyCharacteristics)}
            listOtherItem={keyCharacteristicsOther}
            notes={keyCharacteristicsNote}
          />
        )}

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

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 border-bottom-1px border-base-light padding-bottom-2'
        }`}
      >
        <SideBySideReadOnlySection
          firstSection={{
            heading: t('careCoordination'),
            copy: translateBooleanOrNull(careCoordinationInvolved)
          }}
          secondSection={
            careCoordinationInvolved === true && {
              heading: h('howSo'),
              copy: careCoordinationInvolvedDescription
            }
          }
        />
        {careCoordinationInvolvedNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={careCoordinationInvolvedNote}
          />
        )}

        <SideBySideReadOnlySection
          firstSection={{
            heading: t('additionalServices'),
            copy: translateBooleanOrNull(additionalServicesInvolved)
          }}
          secondSection={
            additionalServicesInvolved === true && {
              heading: h('howSo'),
              copy: additionalServicesInvolvedDescription
            }
          }
        />
        {additionalServicesInvolvedNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={additionalServicesInvolvedNote}
          />
        )}

        <SideBySideReadOnlySection
          firstSection={{
            heading: t('communityInvolved'),
            copy: translateBooleanOrNull(communityPartnersInvolved)
          }}
          secondSection={
            communityPartnersInvolved === true && {
              heading: h('howSo'),
              copy: communityPartnersInvolvedDescription
            }
          }
        />
        {communityPartnersInvolvedNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={communityPartnersInvolvedNote}
          />
        )}
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 border-bottom-1px border-base-light padding-bottom-2'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'specificGeographies',
          <ReadOnlySection
            heading={t('specificGeographies')}
            copy={translateBooleanOrNull(geographiesTargeted)}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographyType',
          <ReadOnlySection
            heading={t('geographyType')}
            list
            listItems={geographiesTargetedTypes?.map(translateGeographyTypes)}
            listOtherItem={geographiesTargetedTypesOther}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographyApplied',
          <ReadOnlySection
            heading={t('geographyApplied')}
            list
            listItems={geographiesTargetedAppliedTo?.map(
              translateGeographyApplication
            )}
            listOtherItem={geographiesTargetedAppliedToOther}
            notes={geographiesTargetedNote}
          />
        )}

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
      <div>
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'rulemakingRequired',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('rulemakingRequired'),
              copy: translateBooleanOrNull(rulemakingRequired)
            }}
            secondSection={
              rulemakingRequired === true && {
                heading: t('ruleMakingInfo'),
                copy: rulemakingRequiredDescription
              }
            }
          />
        )}
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

        <SideBySideReadOnlySection
          firstSection={{
            heading: t('waiversRequired'),
            copy: translateBooleanOrNull(waiversRequired)
          }}
          secondSection={
            waiversRequired === true && {
              heading: t('waiverTypesQuestion'),
              list: true,
              listItems: waiversRequiredTypes?.map(translateWaiverTypes)
            }
          }
        />
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
