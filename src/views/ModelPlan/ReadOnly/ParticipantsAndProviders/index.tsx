import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllParticipants from 'queries/ReadOnly/GetAllParticipants';
import { GetAllParticipants as GetAllParticipantsTypes } from 'queries/ReadOnly/types/GetAllParticipants';
import {
  FrequencyType,
  OverlapType,
  ParticipantsType,
  RecruitmentType
} from 'types/graphql-global-types';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyParticipantsAndProviders = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );

  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

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
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={participantsAndProvidersMiscT('clearanceHeading')}
        heading={participantsAndProvidersMiscT('heading')}
        isViewingFilteredView={isViewingFilteredView}
        status={status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
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
            heading={participantsAndProvidersT('participants.readonlyQuestion')}
            list
            listItems={participants?.map((type): string =>
              participantsAndProvidersT(`participants.options.${type}`)
            )}
            listOtherItem={participantsOther}
            notes={participantsNote}
          />
        )}

        {participants?.includes(ParticipantsType.MEDICARE_PROVIDERS) &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'medicareProviderType',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'medicareProviderType.question'
              )}
              copy={medicareProviderType}
            />
          )}

        {participants?.includes(ParticipantsType.STATES) &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'statesEngagement',
            <ReadOnlySection
              heading={participantsAndProvidersT('statesEngagement.question')}
              copy={statesEngagement}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantsCurrentlyInModels',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'participantsCurrentlyInModels.question'
            )}
            copy={participantsAndProvidersT(
              `participantsCurrentlyInModels.options.${participantsCurrentlyInModels}`,
              ''
            )}
            notes={participantsCurrentlyInModelsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'modelApplicationLevel',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'modelApplicationLevel.question'
            )}
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
          'expectedNumberOfParticipants',
          <SideBySideReadOnlySection
            firstSection={{
              heading: participantsAndProvidersT(
                'expectedNumberOfParticipants.question'
              ),
              copy: expectedNumberOfParticipants?.toString()
            }}
            secondSection={{
              heading: participantsAndProvidersT('estimateConfidence.question'),
              copy:
                estimateConfidence &&
                participantsAndProvidersT(
                  `estimateConfidence.options.${estimateConfidence}`,
                  ''
                ),
              listOtherItem: riskOther
            }}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'expectedNumberOfParticipants',
          <ReadOnlySection
            heading={participantsAndProvidersT('confidenceNote.question')}
            copy={confidenceNote}
          />
        )}

        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'recruitmentMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT('recruitmentMethod.question')}
            copy={
              recruitmentMethod &&
              (recruitmentMethod === RecruitmentType.OTHER
                ? `${participantsAndProvidersT(
                    `recruitmentMethod.options.${recruitmentMethod}`
                  )} \u2014  ${recruitmentOther}`
                : participantsAndProvidersT(
                    `recruitmentMethod.options.${recruitmentMethod}`,
                    ''
                  ))
            }
            notes={recruitmentNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'selectionMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'selectionMethod.readonlyQuestion'
            )}
            list
            listItems={selectionMethod?.map((type): string =>
              participantsAndProvidersT(`selectionMethod.options.${type}`)
            )}
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
            heading={participantsAndProvidersT('communicationMethod.question')}
            list
            listItems={communicationMethod?.map((type): string =>
              participantsAndProvidersT(`communicationMethod.options.${type}`)
            )}
            listOtherItem={communicationMethodOther}
            notes={communicationNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantAssumeRisk',
          <SideBySideReadOnlySection
            firstSection={{
              heading: participantsAndProvidersT(
                'participantAssumeRisk.question'
              ),
              copy: participantsAndProvidersT(
                `participantAssumeRisk.options.${participantAssumeRisk}`,
                ''
              )
            }}
            secondSection={
              participantAssumeRisk === true && {
                heading: participantsAndProvidersT('riskType.question'),
                copy:
                  riskType &&
                  participantsAndProvidersT(`riskType.options.${riskType}`, ''),
                listOtherItem: riskOther
              }
            }
          />
        )}
        {riskNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'participantAssumeRisk',
            <ReadOnlySection
              heading={participantsAndProvidersT('riskNote.question')}
              copy={riskNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'willRiskChange',
          <ReadOnlySection
            heading={participantsAndProvidersT('willRiskChange.question')}
            copy={participantsAndProvidersT(
              `willRiskChange.options.${willRiskChange}`,
              ''
            )}
            notes={willRiskChangeNote}
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
          'coordinateWork',
          <ReadOnlySection
            heading={participantsAndProvidersT('coordinateWork.question')}
            copy={participantsAndProvidersT(
              `coordinateWork.options.${coordinateWork}`,
              ''
            )}
            notes={coordinateWorkNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'gainsharePayments',
          <SideBySideReadOnlySection
            firstSection={{
              heading: participantsAndProvidersT('gainsharePayments.question'),
              copy: participantsAndProvidersT(
                `gainsharePayments.options.${gainsharePayments}`,
                ''
              )
            }}
            secondSection={
              gainsharePayments === true && {
                heading: participantsAndProvidersT(
                  'gainsharePaymentsTrack.question'
                ),
                copy: participantsAndProvidersT(
                  `gainsharePaymentsTrack.options.${gainsharePaymentsTrack}`,
                  ''
                )
              }
            }
          />
        )}
        {gainsharePaymentsNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'gainsharePayments',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'gainsharePaymentsNote.question'
              )}
              copy={gainsharePaymentsNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantsIds',
          <ReadOnlySection
            heading={participantsAndProvidersT('participantsIds.question')}
            list
            listItems={participantsIds?.map((type): string =>
              participantsAndProvidersT(`participantsIds.options.${type}`)
            )}
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
            heading={participantsAndProvidersT(
              'providerAdditionFrequency.question'
            )}
            copy={
              providerAdditionFrequency &&
              (providerAdditionFrequency === FrequencyType.OTHER
                ? `${participantsAndProvidersT(
                    `providerAdditionFrequency.options.${providerAdditionFrequency}`
                  )} \u2014  ${providerAdditionFrequencyOther}`
                : participantsAndProvidersT(
                    `providerAdditionFrequency.options.${providerAdditionFrequency}`,
                    ''
                  ))
            }
            notes={providerAdditionFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAddMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerAddMethod.readonlyQuestion'
            )}
            list
            listItems={providerAddMethod?.map((type): string =>
              participantsAndProvidersT(`providerAddMethod.options.${type}`)
            )}
            listOtherItem={providerAddMethodOther}
            notes={providerAddMethodNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerLeaveMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerLeaveMethod.readonlyQuestion'
            )}
            list
            listItems={providerLeaveMethod?.map((type): string =>
              participantsAndProvidersT(`providerLeaveMethod.options.${type}`)
            )}
            listOtherItem={providerLeaveMethodOther}
            notes={providerLeaveMethodNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerOverlap',
          <ReadOnlySection
            heading={participantsAndProvidersT('providerOverlap.question')}
            copy={
              providerOverlap &&
              participantsAndProvidersT(
                `providerOverlap.options.${providerOverlap}`,
                ''
              )
            }
          />
        )}

        {providerOverlap !== OverlapType.NO &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'providerOverlapHierarchy',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'providerOverlapHierarchy.question'
              )}
              copy={providerOverlapHierarchy}
            />
          )}

        {providerOverlapNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'providerOverlapHierarchy',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'providerOverlapNote.question'
              )}
              copy={providerOverlapNote}
            />
          )}
      </div>
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
