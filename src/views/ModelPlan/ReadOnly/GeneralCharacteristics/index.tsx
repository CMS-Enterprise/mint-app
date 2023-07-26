import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllGeneralCharacteristics from 'queries/ReadOnly/GetAllGeneralCharacteristics';
import { GetAllGeneralCharacteristics as GetAllGeneralCharacteristicsTypes } from 'queries/ReadOnly/types/GetAllGeneralCharacteristics';
import { KeyCharacteristic } from 'types/graphql-global-types';
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
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );

  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

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
            heading={generalCharacteristicsT('isNewModel.question')}
            copy={generalCharacteristicsT(`isNewModel.options.${isNewModel}`)}
          />
        )}

        {!isNewModel &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'existingModel',
            <ReadOnlySection
              heading={generalCharacteristicsT('existingModel.question')}
              copy={existingModel}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'resemblesExistingModel',
          <ReadOnlySection
            heading={generalCharacteristicsT('resemblesExistingModel.question')}
            copy={generalCharacteristicsT(
              `resemblesExistingModel.options.${resemblesExistingModel}`
            )}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'modelResemblance',
          <ReadOnlySection
            heading={generalCharacteristicsT('existingModelLinks.question')}
            list
            listItems={mappedExistingModels}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'resemblesExistingModelHow',
          <ReadOnlySection
            heading={generalCharacteristicsT(
              'resemblesExistingModelHow.question'
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
            heading={generalCharacteristicsT('hasComponentsOrTracks.question')}
            copy={generalCharacteristicsT(
              `hasComponentsOrTracks.options.${hasComponentsOrTracks}`
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
                'hasComponentsOrTracksDiffer.question'
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
              'alternativePaymentModelTypes.question'
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
              'keyCharacteristics.readonlyQuestion'
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
                heading={generalCharacteristicsT('collectPlanBids.question')}
                copy={generalCharacteristicsT(
                  `collectPlanBids.options.${collectPlanBids}`
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
                  'managePartCDEnrollment.question'
                )}
                copy={generalCharacteristicsT(
                  `managePartCDEnrollment.options.${managePartCDEnrollment}`
                )}
                notes={managePartCDEnrollmentNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'planContractUpdated',
              <ReadOnlySection
                heading={generalCharacteristicsT(
                  'planContractUpdated.question'
                )}
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
                'careCoordinationInvolved.question'
              ),
              copy: generalCharacteristicsT(
                `careCoordinationInvolved.options.${careCoordinationInvolved}`,
                ''
              )
            }}
            secondSection={
              careCoordinationInvolved === true && {
                heading: generalCharacteristicsT(
                  'careCoordinationInvolvedDescription.question'
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
                'careCoordinationInvolvedNote.question'
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
                'additionalServicesInvolved.question'
              ),
              copy: generalCharacteristicsT(
                `additionalServicesInvolved.options.${additionalServicesInvolved}`,
                ''
              )
            }}
            secondSection={
              additionalServicesInvolved === true && {
                heading: generalCharacteristicsT(
                  'additionalServicesInvolvedDescription.question'
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
                'additionalServicesInvolved.question'
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
                'communityPartnersInvolved.question'
              ),
              copy: generalCharacteristicsT(
                `communityPartnersInvolved.options.${communityPartnersInvolved}`,
                ''
              )
            }}
            secondSection={
              communityPartnersInvolved === true && {
                heading: generalCharacteristicsT(
                  'communityPartnersInvolvedDescription.question'
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
                'communityPartnersInvolvedNote.question'
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
            heading={generalCharacteristicsT('geographiesTargeted.question')}
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
          <SideBySideReadOnlySection
            firstSection={{
              heading: generalCharacteristicsT(
                'geographiesTargetedTypes.question'
              ),
              list: true,
              listItems: geographiesTargetedTypes?.map((type): string =>
                generalCharacteristicsT(
                  `geographiesTargetedTypes.options.${type}`
                )
              ),
              listOtherItem: geographiesTargetedTypesOther
            }}
            secondSection={{
              heading: generalCharacteristicsT(
                'geographiesTargetedAppliedTo.question'
              ),
              list: true,
              listItems: geographiesTargetedAppliedTo?.map((type): string =>
                generalCharacteristicsT(
                  `geographiesTargetedAppliedTo.options.${type}`
                )
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
            heading={generalCharacteristicsT(
              'geographiesTargetedNote.question'
            )}
            copy={geographiesTargetedNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participationOptions',
          <ReadOnlySection
            heading={generalCharacteristicsT('participationOptions.question')}
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
            heading={generalCharacteristicsT('agreementTypes.question')}
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
              'multiplePatricipationAgreementsNeeded.question'
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
              heading: generalCharacteristicsT('rulemakingRequired.question'),
              copy: generalCharacteristicsT(
                `rulemakingRequired.options.${rulemakingRequired}`,
                ''
              )
            }}
            secondSection={
              !!(rulemakingRequired === true || isViewingFilteredView) && {
                heading: generalCharacteristicsT(
                  'rulemakingRequiredDescription.question'
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
              heading={generalCharacteristicsT(
                'rulemakingRequiredNote.question'
              )}
              copy={rulemakingRequiredNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'authorityAllowances',
          <ReadOnlySection
            heading={generalCharacteristicsT('authorityAllowances.question')}
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
              heading: generalCharacteristicsT('waiversRequired.question'),
              copy: generalCharacteristicsT(
                `waiversRequired.options.${waiversRequired}`,
                ''
              )
            }}
            secondSection={
              waiversRequired === true && {
                heading: generalCharacteristicsT(
                  'waiversRequiredTypes.question'
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
              heading={generalCharacteristicsT('waiversRequiredNote.question')}
              copy={waiversRequiredNote}
            />
          )}
      </div>
    </div>
  );
};

export default ReadOnlyGeneralCharacteristics;
