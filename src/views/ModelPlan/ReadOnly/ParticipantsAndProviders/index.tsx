import React, { useContext } from 'react';
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
  translateFrequencyType,
  translateOverlapType,
  translateParticipantIDType,
  translateParticipantSelectiontType,
  translateParticipantsType,
  translateProviderAddType,
  translateProviderLeaveType,
  translateRecruitmentType,
  translateRiskType
} from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyParticipantsAndProviders = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: p } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

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
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participants',
          <ReadOnlySection
            heading={t('whoAreParticipantsQuestion')}
            list
            listItems={participants?.map(translateParticipantsType)}
            listOtherItem={participantsOther}
            notes={participantsNote}
          />
        )}

        {medicareProviderType && (
          <ReadOnlySection
            heading={t('typeMedicateProvider')}
            copy={medicareProviderType}
          />
        )}

        {statesEngagement && (
          <ReadOnlySection
            heading={t('describeStates')}
            copy={statesEngagement}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantsCurrentlyInModels',
          <ReadOnlySection
            heading={t('participantsCMMI')}
            copy={translateBooleanOrNull(participantsCurrentlyInModels)}
            notes={participantsCurrentlyInModelsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'modelLevel',
          <ReadOnlySection
            heading={t('modelLevel')}
            copy={modelApplicationLevel}
          />
        )}
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'howManyParticipants',
          <ReadOnlySection
            heading={t('howManyParticipants')}
            copy={expectedNumberOfParticipants?.toString()}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'estimateConfidence',
          <ReadOnlySection
            heading={t('estimateConfidence')}
            copy={
              estimateConfidence && translateConfidenceType(estimateConfidence)
            }
            notes={confidenceNote}
          />
        )}

        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'recruitParticipants',
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
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'selectionMethod',
          <ReadOnlySection
            heading={t('howWillYouSelectQuestion')}
            list
            listItems={selectionMethod?.map(translateParticipantSelectiontType)}
            listOtherItem={selectionOther}
            notes={selectionNote}
          />
        )}
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'communicationMethod',
          <ReadOnlySection
            heading={t('participantCommunication')}
            list
            listItems={communicationMethod?.map(translateCommunicationType)}
            listOtherItem={communicationMethodOther}
            notes={communicationNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'assumeRisk',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('assumeRisk'),
              copy: translateBooleanOrNull(participantAssumeRisk)
            }}
            secondSection={
              participantAssumeRisk === true && {
                heading: t('riskType'),
                copy: riskType && translateRiskType(riskType),
                listOtherItem: riskOther
              }
            }
          />
        )}
        {riskNote && (
          <ReadOnlySection heading={t('basics:notes')} copy={riskNote} />
        )}

        <ReadOnlySection
          heading={t('changeRisk')}
          copy={translateBooleanOrNull(willRiskChange)}
          notes={willRiskChangeNote}
        />
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'workCoordination',
          <ReadOnlySection
            heading={t('workCoordination')}
            copy={translateBooleanOrNull(coordinateWork)}
            notes={coordinateWorkNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'gainsharing',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('gainsharing'),
              copy: translateBooleanOrNull(gainsharePayments)
            }}
            secondSection={
              gainsharePayments === true && {
                heading: t('trackPayments'),
                copy: translateBooleanOrNull(gainsharePaymentsTrack)
              }
            }
          />
        )}
        {gainsharePaymentsNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={gainsharePaymentsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'collectTINs',
          <ReadOnlySection
            heading={t('collectTINs')}
            list
            listItems={participantsIds?.map(translateParticipantIDType)}
            listOtherItem={participantsIdsOther}
            notes={participantsIDSNote}
          />
        )}
      </div>

      <div>
        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAdditionFrequency',
          <ReadOnlySection
            heading={t('frequency')}
            copy={
              providerAdditionFrequency &&
              (providerAdditionFrequency === FrequencyType.OTHER
                ? `${translateFrequencyType(
                    providerAdditionFrequency
                  )} \u2014  ${providerAdditionFrequencyOther}`
                : translateFrequencyType(providerAdditionFrequency))
            }
            notes={providerAdditionFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAddMethod',
          <ReadOnlySection
            heading={t('decideProvidersQuestion')}
            list
            listItems={providerAddMethod?.map(translateProviderAddType)}
            listOtherItem={providerAddMethodOther}
            notes={providerAddMethodNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerLeaveMethod',
          <ReadOnlySection
            heading={t('canProvidersLeaveQuestion')}
            list
            listItems={providerLeaveMethod?.map(translateProviderLeaveType)}
            listOtherItem={providerLeaveMethodOther}
            notes={providerLeaveMethodNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerOverlap',
          <ReadOnlySection
            heading={t('overlap')}
            copy={providerOverlap && translateOverlapType(providerOverlap)}
          />
        )}

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
