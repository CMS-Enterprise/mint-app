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
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
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
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={t('clearanceHeading')}
        heading={t('heading')}
        isViewingFilteredView={isViewingFilteredView}
        status={status}
      />

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
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'isNewModel',
          <ReadOnlySection
            heading={t('isNewModel')}
            copy={translateNewModel(isNewModel)}
          />
        )}

        {!isNewModel &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'existingModel',
            <ReadOnlySection
              heading={t('whichExistingModel')}
              copy={existingModel}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'resemblesExistingModel',
          <ReadOnlySection
            heading={t('resembleModel')}
            copy={translateBooleanOrNull(resemblesExistingModel)}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'modelResemblance',
          <ReadOnlySection
            heading={t('modelResemblance')}
            list
            listItems={mappedExistingModels}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'resemblesExistingModelHow',
          <ReadOnlySection
            heading={t('waysResembleModel')}
            copy={resemblesExistingModelHow}
            notes={resemblesExistingModelNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'hasComponentsOrTracks',
          <ReadOnlySection
            heading={t('differentComponents')}
            copy={translateBooleanOrNull(hasComponentsOrTracks)}
          />
        )}

        {hasComponentsOrTracksNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'hasComponentsOrTracksDiffer',
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
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'alternativePaymentModelTypes',
          <ReadOnlySection
            heading={t('modelAPM')}
            list
            listItems={alternativePaymentModelTypes?.map(
              translateAlternativePaymentTypes
            )}
            notes={alternativePaymentModelNote}
          />
        )}

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
            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'collectPlanBids',
              <ReadOnlySection
                heading={t('reviewPlanBids')}
                copy={translateBooleanOrNull(collectPlanBids)}
                notes={collectPlanBidsNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'managePartCDEnrollment',
              <ReadOnlySection
                heading={t('manageEnrollment')}
                copy={translateBooleanOrNull(managePartCDEnrollment)}
                notes={managePartCDEnrollmentNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'planContractUpdated',
              <ReadOnlySection
                heading={t('updatedContract')}
                copy={translateBooleanOrNull(planContractUpdated)}
                notes={planContractUpdatedNote}
              />
            )}
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
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'careCoordinationInvolved',
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
        )}
        {careCoordinationInvolvedNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'careCoordinationInvolved',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={careCoordinationInvolvedNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'additionalServicesInvolved',
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
        )}
        {additionalServicesInvolvedNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'additionalServicesInvolved',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={additionalServicesInvolvedNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'communityPartnersInvolved',
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
        )}
        {communityPartnersInvolvedNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'communityPartnersInvolved',
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
          'geographiesTargeted',
          <ReadOnlySection
            heading={t('specificGeographies')}
            copy={translateBooleanOrNull(geographiesTargeted)}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographiesTargetedTypes',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('geographyType'),
              list: true,
              listItems: geographiesTargetedTypes?.map(translateGeographyTypes),
              listOtherItem: geographiesTargetedTypesOther
            }}
            secondSection={{
              heading: t('geographyApplied'),
              list: true,
              listItems: geographiesTargetedAppliedTo?.map(
                translateGeographyApplication
              ),
              listOtherItem: geographiesTargetedAppliedToOther
            }}
          />
        )}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographiesTargetedTypes',
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={geographiesTargetedNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participationOptions',
          <ReadOnlySection
            heading={t('participationOptions')}
            copy={translateBooleanOrNull(participationOptions)}
            notes={participationOptionsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'agreementTypes',
          <ReadOnlySection
            heading={t('agreementType')}
            list
            listItems={agreementTypes?.map(translateAgreementTypes)}
            listOtherItem={agreementTypesOther}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'multiplePatricipationAgreementsNeeded',
          <ReadOnlySection
            heading={t('moreParticipation')}
            copy={translateBooleanOrNull(multiplePatricipationAgreementsNeeded)}
            notes={multiplePatricipationAgreementsNeededNote}
          />
        )}
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
              !!(rulemakingRequired === true || isViewingFilteredView) && {
                heading: t('ruleMakingInfo'),
                copy: rulemakingRequiredDescription
              }
            }
          />
        )}
        {rulemakingRequiredNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'rulemakingRequired',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={rulemakingRequiredNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'authorityAllowances',
          <ReadOnlySection
            heading={t('authorityAllowed')}
            list
            listItems={authorityAllowances?.map(translateAuthorityAllowance)}
            listOtherItem={authorityAllowancesOther}
            notes={authorityAllowancesNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'waiversRequired',
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
        )}
        {waiversRequiredNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'waiversRequired',
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
