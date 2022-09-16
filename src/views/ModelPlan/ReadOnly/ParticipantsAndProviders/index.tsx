import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllParticipants from 'queries/ReadOnly/GetAllParticipants';
import {
  GetAllParticipants as GetAllParticipantsTypes,
  GetAllParticipants_modelPlan_participantsAndProviders as ParticipantsAndProvidersTypes
} from 'queries/ReadOnly/types/GetAllParticipants';
import { RecruitmentType } from 'types/graphql-global-types';
import {
  translateConfidenceType,
  translateParticipantSelectiontType,
  translateParticipantsType,
  translateRecruitmentType
} from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyParticipantsAndProviders = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');

  const { data, loading, error } = useQuery<GetAllParticipantsTypes>(
    GetAllParticipants,
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
    participants,
    medicareProviderType,
    statesEngagement,
    participantsOther,
    participantsNote,
    participantsCurrentlyInModels,
    participantsCurrentlyInModelsNote,
    modelApplicationLevel,
    expectedNumberOfParticipants,
    estimateConfidence,
    confidenceNote,
    recruitmentMethod,
    recruitmentOther,
    recruitmentNote,
    selectionMethod,
    selectionOther,
    selectionNote,
    communicationMethod,
    communicationMethodOther,
    communicationNote,
    participantAssumeRisk,
    riskType,
    riskOther,
    riskNote,
    willRiskChange,
    willRiskChangeNote,
    coordinateWork,
    coordinateWorkNote,
    gainsharePayments,
    gainsharePaymentsTrack,
    gainsharePaymentsNote,
    participantsIds,
    participantsIdsOther,
    participantsIDSNote,
    providerAdditionFrequency,
    providerAdditionFrequencyOther,
    providerAdditionFrequencyNote,
    providerAddMethod,
    providerAddMethodOther,
    providerAddMethodNote,
    providerLeaveMethod,
    providerLeaveMethodOther,
    providerLeaveMethodNote,
    providerOverlap,
    providerOverlapHierarchy,
    providerOverlapNote,
    status
  } = data?.modelPlan.participantsAndProviders || {};

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        {status && <TaskListStatusTag status={status} />}
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('whoAreParticipantsQuestion')}
          list
          listItems={participants?.map(translateParticipantsType)}
          listOtherItem={participantsOther}
          notes={participantsNote}
        />

        <ReadOnlySection
          heading={t('typeMedicateProvider')}
          copy={medicareProviderType}
        />

        <ReadOnlySection
          heading={t('describeStates')}
          copy={statesEngagement}
        />

        <ReadOnlySection
          heading={t('participantsCMMI')}
          copy={participantsCurrentlyInModels ? h('yes') : h('no')}
          notes={participantsCurrentlyInModelsNote}
        />

        <ReadOnlySection
          heading={t('modelLevel')}
          copy={modelApplicationLevel}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('howManyParticipants')}
          copy={expectedNumberOfParticipants?.toString()}
        />

        <ReadOnlySection
          heading={t('estimateConfidence')}
          copy={
            estimateConfidence && translateConfidenceType(estimateConfidence)
          }
          notes={confidenceNote}
        />

        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        <ReadOnlySection
          heading={t('recruitParticipants')}
          copy={
            recruitmentMethod &&
            (recruitmentMethod === RecruitmentType.OTHER
              ? `${translateRecruitmentType(
                  recruitmentMethod
                )} \u2014  ${recruitmentOther}`
              : translateRecruitmentType(recruitmentMethod))
          }
          notes={recruitmentNote}
        />

        <ReadOnlySection
          heading={t('howWillYouSelectQuestion')}
          list
          listItems={selectionMethod?.map(translateParticipantSelectiontType)}
          listOtherItem={selectionOther}
          notes={selectionNote}
        />
      </div>
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
