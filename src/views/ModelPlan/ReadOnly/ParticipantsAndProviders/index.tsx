import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllParticipants from 'queries/ReadOnly/GetAllParticipants';
import { GetAllParticipants as GetAllParticipantsTypes } from 'queries/ReadOnly/types/GetAllParticipants';
import {
  FrequencyType,
  OverlapType,
  RecruitmentType
} from 'types/graphql-global-types';
import {
  translateBooleanOrNull,
  translateCommunicationType,
  translateConfidenceType,
  translateOverlapType,
  translateParticipantIDType,
  translateParticipantSelectiontType,
  translateParticipantsType,
  translateProviderAddType,
  translateProviderLeaveType,
  translateRecruitmentType,
  translateRiskType
} from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyParticipantsAndProviders = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('participantsAndProviders');

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
          copy={translateBooleanOrNull(participantsCurrentlyInModels)}
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

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('participantCommunication')}
          list
          listItems={communicationMethod?.map(translateCommunicationType)}
          listOtherItem={communicationMethodOther}
          notes={communicationNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('assumeRisk')}
              copy={translateBooleanOrNull(participantAssumeRisk)}
            />
          </div>
          {participantAssumeRisk && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={t('riskType')}
                copy={riskType && translateRiskType(riskType)}
                listOtherItem={riskOther}
              />
            </div>
          )}
        </div>
        {riskNote && (
          <ReadOnlySection heading={t('basics:notes')} copy={riskNote} />
        )}

        <ReadOnlySection
          heading={t('changeRisk')}
          copy={translateBooleanOrNull(willRiskChange)}
          notes={willRiskChangeNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('workCoordination')}
          copy={translateBooleanOrNull(coordinateWork)}
          notes={coordinateWorkNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('gainsharing')}
              copy={translateBooleanOrNull(gainsharePayments)}
            />
          </div>
          {gainsharePayments && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={t('trackPayments')}
                copy={translateBooleanOrNull(gainsharePaymentsTrack)}
              />
            </div>
          )}
        </div>
        {gainsharePaymentsNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={gainsharePaymentsNote}
          />
        )}

        <ReadOnlySection
          heading={t('collectTINs')}
          list
          listItems={participantsIds?.map(translateParticipantIDType)}
          listOtherItem={participantsIdsOther}
          notes={participantsIDSNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        <ReadOnlySection
          heading={t('frequency')}
          copy={
            providerAdditionFrequency &&
            (providerAdditionFrequency === FrequencyType.OTHER
              ? `${translateRecruitmentType(
                  providerAdditionFrequency
                )} \u2014  ${providerAdditionFrequencyOther}`
              : translateRecruitmentType(providerAdditionFrequency))
          }
          notes={providerAdditionFrequencyNote}
        />

        <ReadOnlySection
          heading={t('decideProvidersQuestion')}
          list
          listItems={providerAddMethod?.map(translateProviderAddType)}
          listOtherItem={providerAddMethodOther}
          notes={providerAddMethodNote}
        />

        <ReadOnlySection
          heading={t('canProvidersLeaveQuestion')}
          list
          listItems={providerLeaveMethod?.map(translateProviderLeaveType)}
          listOtherItem={providerLeaveMethodOther}
          notes={providerLeaveMethodNote}
        />

        <ReadOnlySection
          heading={t('overlap')}
          copy={providerOverlap && translateOverlapType(providerOverlap)}
        />

        {providerOverlap !== OverlapType.NO && (
          <ReadOnlySection
            heading={t('overlapInfo')}
            copy={providerOverlapHierarchy}
          />
        )}

        {providerOverlapNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={providerOverlapNote}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
