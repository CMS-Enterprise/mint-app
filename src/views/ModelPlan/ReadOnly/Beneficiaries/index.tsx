import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllBeneficiaries from 'queries/ReadOnly/GetAllBeneficiaries';
import { GetAllBeneficiaries as AllBeneficiariesTypes } from 'queries/ReadOnly/types/GetAllBeneficiaries';
import { FrequencyType, TriStateAnswer } from 'types/graphql-global-types';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyBeneficiaries = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: beneficiariesT } = useTranslation('beneficiaries');

  const { t: beneficiariesMiscT } = useTranslation('beneficiariesMisc');

  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<AllBeneficiariesTypes>(
    GetAllBeneficiaries,
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
    beneficiaries,
    beneficiariesOther,
    beneficiariesNote,
    treatDualElligibleDifferent,
    treatDualElligibleDifferentHow,
    treatDualElligibleDifferentNote,
    excludeCertainCharacteristics,
    excludeCertainCharacteristicsCriteria,
    excludeCertainCharacteristicsNote,
    numberPeopleImpacted,
    estimateConfidence,
    confidenceNote,
    beneficiarySelectionMethod,
    beneficiarySelectionOther,
    beneficiarySelectionNote,
    beneficiarySelectionFrequency,
    beneficiarySelectionFrequencyOther,
    beneficiarySelectionFrequencyNote,
    beneficiaryOverlap,
    beneficiaryOverlapNote,
    precedenceRules,
    status
  } = data?.modelPlan.beneficiaries || {};

  return (
    <div
      className="read-only-model-plan--beneficiaries"
      data-testid="read-only-model-plan--beneficiaries"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={beneficiariesMiscT('clearanceHeading')}
        heading={beneficiariesMiscT('heading')}
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
          'beneficiaries',
          <ReadOnlySection
            heading={beneficiariesT('beneficiaries.readonlyQuestion')}
            list
            listItems={beneficiaries?.map((type): string =>
              beneficiariesT(`beneficiaries.options.${type}`)
            )}
            listOtherItem={beneficiariesOther}
            notes={beneficiariesNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'treatDualElligibleDifferent',
          <SideBySideReadOnlySection
            firstSection={{
              heading: beneficiariesT('treatDualElligibleDifferent.question'),
              copy:
                treatDualElligibleDifferent &&
                beneficiariesT(
                  `treatDualElligibleDifferent.options.${treatDualElligibleDifferent}`,
                  ''
                )
            }}
            secondSection={
              treatDualElligibleDifferent === TriStateAnswer.YES && {
                heading: beneficiariesT(
                  'treatDualElligibleDifferentHow.question'
                ),
                copy: treatDualElligibleDifferentHow
              }
            }
          />
        )}
        {treatDualElligibleDifferentNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'treatDualElligibleDifferent',
            <ReadOnlySection
              heading={beneficiariesT(
                'treatDualElligibleDifferentNote.question'
              )}
              copy={treatDualElligibleDifferentNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'excludeCertainCharacteristics',
          <SideBySideReadOnlySection
            firstSection={{
              heading: beneficiariesT('excludeCertainCharacteristics.question'),
              copy:
                excludeCertainCharacteristics &&
                beneficiariesT(
                  `excludeCertainCharacteristics.options.${excludeCertainCharacteristics}`,
                  ''
                )
            }}
            secondSection={
              excludeCertainCharacteristics === TriStateAnswer.YES && {
                heading: beneficiariesT(
                  'excludeCertainCharacteristicsCriteria.question'
                ),
                copy: excludeCertainCharacteristicsCriteria
              }
            }
          />
        )}

        {excludeCertainCharacteristicsNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'excludeCertainCharacteristics',
            <ReadOnlySection
              heading={beneficiariesT(
                'excludeCertainCharacteristicsNote.question'
              )}
              copy={excludeCertainCharacteristicsNote}
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
        {isViewingFilteredView &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'numberPeopleImpacted',
            <SideBySideReadOnlySection
              firstSection={{
                heading: beneficiariesT('numberPeopleImpacted.question'),
                copy: numberPeopleImpacted?.toString(),
                notes: confidenceNote
              }}
              secondSection={{
                heading: beneficiariesT('estimateConfidence.question'),
                copy:
                  estimateConfidence &&
                  beneficiariesT(
                    `estimateConfidence.options.${estimateConfidence}`,
                    ''
                  )
              }}
            />
          )}

        {!isViewingFilteredView && (
          <>
            <ReadOnlySection
              heading={beneficiariesT('numberPeopleImpacted.question')}
              copy={numberPeopleImpacted?.toString()}
            />

            <ReadOnlySection
              heading={beneficiariesT('estimateConfidence.question')}
              copy={
                estimateConfidence &&
                beneficiariesT(
                  `estimateConfidence.options.${estimateConfidence}`,
                  ''
                )
              }
              notes={confidenceNote}
            />
          </>
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'beneficiarySelectionMethod',
          <ReadOnlySection
            heading={beneficiariesT(
              'beneficiarySelectionMethod.readonlyQuestion'
            )}
            list
            listItems={beneficiarySelectionMethod?.map((type): string =>
              beneficiariesT(`beneficiarySelectionMethod.options.${type}`)
            )}
            listOtherItem={beneficiarySelectionOther}
            notes={beneficiarySelectionNote}
          />
        )}
      </div>

      <div>
        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'beneficiarySelectionFrequency',
          <ReadOnlySection
            heading={beneficiariesT('beneficiarySelectionFrequency.question')}
            copy={
              beneficiarySelectionFrequency &&
              (beneficiarySelectionFrequency === FrequencyType.OTHER
                ? `${beneficiariesT(
                    `beneficiarySelectionFrequency.options.${beneficiarySelectionFrequency}`,
                    ''
                  )} \u2014  ${beneficiarySelectionFrequencyOther}`
                : beneficiariesT(
                    `beneficiarySelectionFrequency.options.${beneficiarySelectionFrequency}`,
                    ''
                  ))
            }
            notes={beneficiarySelectionFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'beneficiaryOverlap',
          <ReadOnlySection
            heading={beneficiariesT('beneficiaryOverlap.question')}
            copy={
              beneficiaryOverlap &&
              beneficiariesT(
                `beneficiaryOverlap.options.${beneficiaryOverlap}`,
                ''
              )
            }
            notes={beneficiaryOverlapNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'precedenceRules',
          <ReadOnlySection
            heading={beneficiariesT('precedenceRules.question')}
            copy={precedenceRules}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyBeneficiaries;
