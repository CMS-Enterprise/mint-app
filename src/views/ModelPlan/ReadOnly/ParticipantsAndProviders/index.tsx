import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllParticipantsAndProvidersQuery,
  OverlapType,
  ParticipantsType,
  RecruitmentType,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection, {
  formatListItems,
  formatListOtherItems
} from '../_components/ReadOnlySection';
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

  const {
    participantAddedFrequency: participantAddedFrequencyConfig,
    participantRemovedFrequency: participantRemovedFrequencyConfig,
    providerAdditionFrequency: providerAdditionFrequencyConfig,
    providerRemovalFrequency: providerRemovalFrequencyConfig,
    riskType: riskTypeConfig
  } = usePlanTranslation('participantsAndProviders');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllParticipantsAndProvidersQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const allparticipantsAndProvidersData = (data?.modelPlan
    .participantsAndProviders ||
    {}) as GetAllParticipantsAndProvidersQuery['modelPlan']['participantsAndProviders'];

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
    participantAddedFrequency,
    participantAddedFrequencyNote,
    participantRemovedFrequency,
    participantRemovedFrequencyNote,
    communicationMethod,
    communicationMethodOther,
    communicationNote,
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
    gainsharePaymentsEligibility,
    gainsharePaymentsEligibilityOther,
    participantsIds,
    participantsIdsOther,
    participantsIDSNote,
    providerAdditionFrequency,
    providerAdditionFrequencyNote,
    providerAddMethod,
    providerAddMethodOther,
    providerAddMethodNote,
    providerLeaveMethod,
    providerLeaveMethodOther,
    providerLeaveMethodNote,
    providerRemovalFrequency,
    providerRemovalFrequencyNote,
    providerOverlap,
    providerOverlapHierarchy,
    providerOverlapNote,
    status
  } = allparticipantsAndProvidersData;

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
            heading={participantsAndProvidersT('participants.readonlyLabel')}
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
              heading={participantsAndProvidersT('medicareProviderType.label')}
              copy={medicareProviderType}
            />
          )}

        {participants?.includes(ParticipantsType.STATES) &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'statesEngagement',
            <ReadOnlySection
              heading={participantsAndProvidersT('statesEngagement.label')}
              copy={statesEngagement}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantsCurrentlyInModels',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'participantsCurrentlyInModels.label'
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
            heading={participantsAndProvidersT('modelApplicationLevel.label')}
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
                'expectedNumberOfParticipants.label'
              ),
              copy: expectedNumberOfParticipants?.toString()
            }}
            secondSection={{
              heading: participantsAndProvidersT('estimateConfidence.label'),
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
            heading={participantsAndProvidersT('confidenceNote.label')}
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
            heading={participantsAndProvidersT('recruitmentMethod.label')}
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
            heading={participantsAndProvidersT('selectionMethod.readonlyLabel')}
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
          'participantAddedFrequency',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'participantAddedFrequency.label'
            )}
            list
            listItems={formatListItems(
              participantAddedFrequencyConfig,
              participantAddedFrequency
            )}
            listOtherItems={formatListOtherItems(
              participantAddedFrequencyConfig,
              participantAddedFrequency,
              allparticipantsAndProvidersData
            )}
            notes={participantAddedFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantRemovedFrequency',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'participantRemovedFrequency.label'
            )}
            list
            listItems={formatListItems(
              participantRemovedFrequencyConfig,
              participantRemovedFrequency
            )}
            listOtherItems={formatListOtherItems(
              participantRemovedFrequencyConfig,
              participantRemovedFrequency,
              allparticipantsAndProvidersData
            )}
            notes={participantRemovedFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'communicationMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT('communicationMethod.label')}
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
          'riskType',
          <ReadOnlySection
            heading={participantsAndProvidersT('riskType.label')}
            list
            listItems={formatListItems(riskTypeConfig, riskType)}
            listOtherItem={riskOther}
            notes={riskNote}
          />
        )}

        {riskNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'participantAssumeRisk',
            <ReadOnlySection
              heading={participantsAndProvidersT('riskNote.label')}
              copy={riskNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'willRiskChange',
          <ReadOnlySection
            heading={participantsAndProvidersT('willRiskChange.label')}
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
            heading={participantsAndProvidersT('coordinateWork.label')}
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
              heading: participantsAndProvidersT('gainsharePayments.label'),
              copy: participantsAndProvidersT(
                `gainsharePayments.options.${gainsharePayments}`,
                ''
              )
            }}
            secondSection={
              gainsharePayments === true && {
                heading: participantsAndProvidersT(
                  'gainsharePaymentsTrack.label'
                ),
                copy: participantsAndProvidersT(
                  `gainsharePaymentsTrack.options.${gainsharePaymentsTrack}`,
                  ''
                )
              }
            }
          />
        )}

        {gainsharePayments &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'gainsharePaymentsEligibility',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'gainsharePaymentsEligibility.label'
              )}
              list
              listItems={gainsharePaymentsEligibility?.map((type): string =>
                participantsAndProvidersT(
                  `gainsharePaymentsEligibility.options.${type}`
                )
              )}
              listOtherItem={gainsharePaymentsEligibilityOther}
            />
          )}

        {gainsharePaymentsNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'gainsharePayments',
            <ReadOnlySection
              heading={participantsAndProvidersT('gainsharePaymentsNote.label')}
              copy={gainsharePaymentsNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantsIds',
          <ReadOnlySection
            heading={participantsAndProvidersT('participantsIds.label')}
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
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAdditionFrequency',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerAdditionFrequency.label'
            )}
            list
            listItems={formatListItems(
              providerAdditionFrequencyConfig,
              providerAdditionFrequency
            )}
            listOtherItems={formatListOtherItems(
              providerAdditionFrequencyConfig,
              providerAdditionFrequency,
              allparticipantsAndProvidersData
            )}
            notes={providerAdditionFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAddMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerAddMethod.readonlyLabel'
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
              'providerLeaveMethod.readonlyLabel'
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
          'providerRemovalFrequency',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerRemovalFrequency.label'
            )}
            list
            listItems={formatListItems(
              providerRemovalFrequencyConfig,
              providerRemovalFrequency
            )}
            listOtherItems={formatListOtherItems(
              providerRemovalFrequencyConfig,
              providerRemovalFrequency,
              allparticipantsAndProvidersData
            )}
            notes={providerRemovalFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerOverlap',
          <ReadOnlySection
            heading={participantsAndProvidersT('providerOverlap.label')}
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
                'providerOverlapHierarchy.label'
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
              heading={participantsAndProvidersT('providerOverlapNote.label')}
              copy={providerOverlapNote}
            />
          )}
      </div>
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
