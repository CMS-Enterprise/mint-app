import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllGeneralCharacteristics from 'queries/ReadOnly/GetAllGeneralCharacteristics';
import { GetAllGeneralCharacteristics as GetAllGeneralCharacteristicsTypes } from 'queries/ReadOnly/types/GetAllGeneralCharacteristics';
import {
  translateAgreementTypes,
  translateAlternativePaymentTypes,
  translateGeographyApplication,
  translateGeographyTypes,
  translateKeyCharacteristics
} from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyGeneralCharacteristics = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');

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
    alternativePaymentModel,
    alternativePaymentModelTypes,
    alternativePaymentModelNote,
    keyCharacteristics,
    keyCharacteristicsOther,
    keyCharacteristicsNote,
    collectPlanBids,
    collectPlanBidsNote,
    managePartCDEnrollment,
    managePartCDEnrollmentNote,
    planContactUpdated,
    planContactUpdatedNote,
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
      className="read-only-model-plan--model-basics"
      data-testid="read-only-model-plan--model-basics"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        {status && <TaskListStatusTag status={status} />}
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('isNewModel')}
          copy={isNewModel ? t('newModel') : t('newTrack')}
        />

        <ReadOnlySection
          heading={t('whichExistingModel')}
          copy={existingModel}
        />

        <ReadOnlySection
          heading={t('resembleModel')}
          copy={resemblesExistingModel ? h('yes') : h('no')}
        />

        <ReadOnlySection
          heading={t('modelResemblance')}
          list
          listItems={resemblesExistingModelWhich}
        />

        <ReadOnlySection
          heading={t('waysResembleModel')}
          copy={resemblesExistingModelHow}
          notes={resemblesExistingModelNote}
        />

        <ReadOnlySection
          heading={t('differentComponents')}
          copy={hasComponentsOrTracks ? h('yes') : h('no')}
        />

        <ReadOnlySection
          heading={t('differentComponents')}
          copy={hasComponentsOrTracks ? h('yes') : h('no')}
        />

        <ReadOnlySection
          heading={t('tracksDiffer')}
          copy={hasComponentsOrTracksDiffer}
          notes={hasComponentsOrTracksNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('modelAPM')}
          copy={alternativePaymentModel ? h('yes') : h('no')}
        />

        <ReadOnlySection
          heading={t('modelAPMType')}
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

        <ReadOnlySection
          heading={t('reviewPlanBids')}
          copy={collectPlanBids ? h('yes') : h('no')}
          notes={collectPlanBidsNote}
        />

        <ReadOnlySection
          heading={t('manageEnrollment')}
          copy={managePartCDEnrollment ? h('yes') : h('no')}
          notes={managePartCDEnrollmentNote}
        />

        <ReadOnlySection
          heading={t('updatedContact')}
          copy={planContactUpdated ? h('yes') : h('no')}
          notes={planContactUpdatedNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('careCoordination')}
              copy={careCoordinationInvolved ? h('yes') : h('no')}
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
              copy={additionalServicesInvolved ? h('yes') : h('no')}
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
              copy={communityPartnersInvolved ? h('yes') : h('no')}
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
          copy={geographiesTargeted ? h('yes') : h('no')}
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
          copy={participationOptions ? h('yes') : h('no')}
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
          copy={multiplePatricipationAgreementsNeeded ? h('yes') : h('no')}
          notes={multiplePatricipationAgreementsNeededNote}
        />
      </div>
    </div>
  );
};

export default ReadOnlyGeneralCharacteristics;
