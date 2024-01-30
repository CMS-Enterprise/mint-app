import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyCharacteristic,
  useGetAllGeneralCharacteristicsQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { YesNoOtherType } from 'types/graphql-global-types';
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

const ReadOnlyGeneralCharacteristics = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );

  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const {
    geographiesTargetedTypes: geographiesTargetedTypesConfig,
    geographiesTargetedAppliedTo: geographiesTargetedAppliedToConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllGeneralCharacteristicsQuery({
    variables: {
      id: modelID
    }
  });

  const {
    isNewModel,
    existingModel,
    resemblesExistingModel,
    resemblesExistingModelWhyHow,
    resemblesExistingModelHow,
    resemblesExistingModelWhich,
    resemblesExistingModelNote,
    resemblesExistingModelOtherSpecify,
    resemblesExistingModelOtherSelected,
    resemblesExistingModelOtherOption,
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
    geographiesStatesAndTerritories,
    geographiesRegionTypes,
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

  // Add 'Other' to the resemblesExistingModelWhich list if resemblesExistingModelOtherSelected is true
  const linkedResemblePlans = useMemo(() => {
    const resemblesExistingModelWhichCopy = { ...resemblesExistingModelWhich }
      .names;
    const selectedPlans = [...(resemblesExistingModelWhichCopy || [])];
    if (resemblesExistingModelOtherSelected) {
      selectedPlans?.push('Other');
    }
    return selectedPlans;
  }, [resemblesExistingModelWhich, resemblesExistingModelOtherSelected]);

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="read-only-model-plan--general-characteristics"
      data-testid="read-only-model-plan--general-characteristics"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={generalCharacteristicsMiscT('clearanceHeading')}
        heading={generalCharacteristicsMiscT('heading')}
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
            : 'margin-bottom-4 border-bottom-1px border-base-light padding-bottom-2'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'isNewModel',
          <ReadOnlySection
            heading={generalCharacteristicsT('isNewModel.label')}
            copy={generalCharacteristicsT(
              `isNewModel.options.${isNewModel}`,
              ''
            )}
          />
        )}

        {!isNewModel &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'existingModel',
            <ReadOnlySection
              heading={generalCharacteristicsT('existingModel.label')}
              copy={existingModel}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'resemblesExistingModel',
          <ReadOnlySection
            heading={generalCharacteristicsT('resemblesExistingModel.label')}
            copy={generalCharacteristicsT(
              `resemblesExistingModel.options.${resemblesExistingModel}`,
              ''
            )}
            otherItem={generalCharacteristicsT(
              `resemblesExistingModel.options.OTHER`,
              ''
            )}
            listOtherItem={resemblesExistingModelOtherSpecify}
          />
        )}

        {(resemblesExistingModel === YesNoOtherType.YES ||
          resemblesExistingModel === YesNoOtherType.NO) &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'resemblesExistingModelWhyHow',
            <ReadOnlySection
              heading={generalCharacteristicsT(
                'resemblesExistingModelWhyHow.label'
              )}
              copy={resemblesExistingModelWhyHow}
            />
          )}

        {resemblesExistingModel === YesNoOtherType.YES &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'resemblesExistingModelWhich',
            <ReadOnlySection
              heading={generalCharacteristicsT(
                'resemblesExistingModelWhich.label'
              )}
              list
              listItems={linkedResemblePlans}
              listOtherItem={resemblesExistingModelOtherOption}
            />
          )}

        {resemblesExistingModel === YesNoOtherType.YES &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'resemblesExistingModelHow',
            <ReadOnlySection
              heading={generalCharacteristicsT(
                'resemblesExistingModelHow.label'
              )}
              copy={resemblesExistingModelHow}
              notes={resemblesExistingModelNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'hasComponentsOrTracks',
          <ReadOnlySection
            heading={generalCharacteristicsT('hasComponentsOrTracks.label')}
            copy={generalCharacteristicsT(
              `hasComponentsOrTracks.options.${hasComponentsOrTracks}`,
              ''
            )}
          />
        )}

        {hasComponentsOrTracksNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'hasComponentsOrTracksDiffer',
            <ReadOnlySection
              heading={generalCharacteristicsT(
                'hasComponentsOrTracksDiffer.label'
              )}
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
            heading={generalCharacteristicsT(
              'alternativePaymentModelTypes.label'
            )}
            list
            listItems={alternativePaymentModelTypes?.map((type): string =>
              generalCharacteristicsT(
                `alternativePaymentModelTypes.options.${type}`
              )
            )}
            notes={alternativePaymentModelNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'keyCharacteristics',
          <ReadOnlySection
            heading={generalCharacteristicsT(
              'keyCharacteristics.readonlyLabel'
            )}
            list
            listItems={keyCharacteristics?.map((type): string =>
              generalCharacteristicsT(`keyCharacteristics.options.${type}`)
            )}
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
                heading={generalCharacteristicsT('collectPlanBids.label')}
                copy={generalCharacteristicsT(
                  `collectPlanBids.options.${collectPlanBids}`,
                  ''
                )}
                notes={collectPlanBidsNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'managePartCDEnrollment',
              <ReadOnlySection
                heading={generalCharacteristicsT(
                  'managePartCDEnrollment.label'
                )}
                copy={generalCharacteristicsT(
                  `managePartCDEnrollment.options.${managePartCDEnrollment}`,
                  ''
                )}
                notes={managePartCDEnrollmentNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'planContractUpdated',
              <ReadOnlySection
                heading={generalCharacteristicsT('planContractUpdated.label')}
                copy={generalCharacteristicsT(
                  `planContractUpdated.options.${planContractUpdated}`,
                  ''
                )}
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
              heading: generalCharacteristicsT(
                'careCoordinationInvolved.label'
              ),
              copy: generalCharacteristicsT(
                `careCoordinationInvolved.options.${careCoordinationInvolved}`,
                ''
              )
            }}
            secondSection={
              careCoordinationInvolved === true && {
                heading: generalCharacteristicsT(
                  'careCoordinationInvolvedDescription.label'
                ),
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
              heading={generalCharacteristicsT(
                'careCoordinationInvolvedNote.label'
              )}
              copy={careCoordinationInvolvedNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'additionalServicesInvolved',
          <SideBySideReadOnlySection
            firstSection={{
              heading: generalCharacteristicsT(
                'additionalServicesInvolved.label'
              ),
              copy: generalCharacteristicsT(
                `additionalServicesInvolved.options.${additionalServicesInvolved}`,
                ''
              )
            }}
            secondSection={
              additionalServicesInvolved === true && {
                heading: generalCharacteristicsT(
                  'additionalServicesInvolvedDescription.label'
                ),
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
              heading={generalCharacteristicsT(
                'additionalServicesInvolved.label'
              )}
              copy={additionalServicesInvolvedNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'communityPartnersInvolved',
          <SideBySideReadOnlySection
            firstSection={{
              heading: generalCharacteristicsT(
                'communityPartnersInvolved.label'
              ),
              copy: generalCharacteristicsT(
                `communityPartnersInvolved.options.${communityPartnersInvolved}`,
                ''
              )
            }}
            secondSection={
              communityPartnersInvolved === true && {
                heading: generalCharacteristicsT(
                  'communityPartnersInvolvedDescription.label'
                ),
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
              heading={generalCharacteristicsT(
                'communityPartnersInvolvedNote.label'
              )}
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
            heading={generalCharacteristicsT('geographiesTargeted.label')}
            copy={generalCharacteristicsT(
              `geographiesTargeted.options.${geographiesTargeted}`,
              ''
            )}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographiesTargetedTypes',
          <ReadOnlySection
            heading={generalCharacteristicsT('geographiesTargetedTypes.label')}
            list
            listItems={formatListItems(
              geographiesTargetedTypesConfig,
              geographiesTargetedTypes
            )}
            listOtherItems={formatListOtherItems(
              geographiesTargetedTypesConfig,
              geographiesTargetedTypes,
              {
                geographiesStatesAndTerritories: geographiesStatesAndTerritories
                  ?.map(
                    state =>
                      generalCharacteristicsT(
                        `geographiesStatesAndTerritories.options.${state}`
                      ).split(' - ')[1]
                  )
                  .join(', '),
                geographiesRegionTypes:
                  geographiesRegionTypes?.length !== 0 &&
                  geographiesRegionTypes?.map(region => {
                    return (
                      <li key={region}>
                        {generalCharacteristicsT(
                          `geographiesRegionTypes.options.${region}`
                        )}
                      </li>
                    );
                  }),
                geographiesTargetedTypesOther
              }
            )}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographiesTargetedTypes',
          <ReadOnlySection
            heading={generalCharacteristicsT(
              'geographiesTargetedAppliedTo.label'
            )}
            list
            listItems={formatListItems(
              geographiesTargetedAppliedToConfig,
              geographiesTargetedAppliedTo
            )}
            listOtherItem={geographiesTargetedAppliedToOther}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'geographiesTargetedTypes',
          <ReadOnlySection
            heading={generalCharacteristicsT('geographiesTargetedNote.label')}
            copy={geographiesTargetedNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participationOptions',
          <ReadOnlySection
            heading={generalCharacteristicsT('participationOptions.label')}
            copy={generalCharacteristicsT(
              `participationOptions.options.${participationOptions}`,
              ''
            )}
            notes={participationOptionsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'agreementTypes',
          <ReadOnlySection
            heading={generalCharacteristicsT('agreementTypes.label')}
            list
            listItems={agreementTypes?.map((type): string =>
              generalCharacteristicsT(`agreementTypes.options.${type}`)
            )}
            listOtherItem={agreementTypesOther}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'multiplePatricipationAgreementsNeeded',
          <ReadOnlySection
            heading={generalCharacteristicsT(
              'multiplePatricipationAgreementsNeeded.label'
            )}
            copy={generalCharacteristicsT(
              `multiplePatricipationAgreementsNeeded.options.${multiplePatricipationAgreementsNeeded}`,
              ''
            )}
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
              heading: generalCharacteristicsT('rulemakingRequired.label'),
              copy: generalCharacteristicsT(
                `rulemakingRequired.options.${rulemakingRequired}`,
                ''
              )
            }}
            secondSection={
              !!(rulemakingRequired === true || isViewingFilteredView) && {
                heading: generalCharacteristicsT(
                  'rulemakingRequiredDescription.label'
                ),
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
              heading={generalCharacteristicsT('rulemakingRequiredNote.label')}
              copy={rulemakingRequiredNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'authorityAllowances',
          <ReadOnlySection
            heading={generalCharacteristicsT('authorityAllowances.label')}
            list
            listItems={authorityAllowances?.map((type): string =>
              generalCharacteristicsT(`authorityAllowances.options.${type}`)
            )}
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
              heading: generalCharacteristicsT('waiversRequired.label'),
              copy: generalCharacteristicsT(
                `waiversRequired.options.${waiversRequired}`,
                ''
              )
            }}
            secondSection={
              waiversRequired === true && {
                heading: generalCharacteristicsT(
                  'waiversRequiredTypes.readonlyLabel'
                ),
                list: true,
                listItems: waiversRequiredTypes?.map((type): string =>
                  generalCharacteristicsT(
                    `waiversRequiredTypes.options.${type}`
                  )
                )
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
              heading={generalCharacteristicsT('waiversRequiredNote.label')}
              copy={waiversRequiredNote}
            />
          )}
      </div>
    </div>
  );
};

export default ReadOnlyGeneralCharacteristics;
