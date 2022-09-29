import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllBeneficiaries from 'queries/ReadOnly/GetAllBeneficiaries';
import { GetAllBeneficiaries as AllBeneficiariesTypes } from 'queries/ReadOnly/types/GetAllBeneficiaries';
import { FrequencyType, TriStateAnswer } from 'types/graphql-global-types';
import {
  translateBeneficiariesType,
  translateConfidenceType,
  translateFrequencyType,
  translateOverlapType,
  translateSelectionMethodType,
  translateTriStateAnswer
} from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyBeneficiaries = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');

  const { data, loading, error } = useQuery<AllBeneficiariesTypes>(
    GetAllBeneficiaries,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data) || data === undefined) {
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
  } = data.modelPlan.beneficiaries;

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        <TaskListStatusTag status={status} />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('beneficiariesQuestion')}
          list
          listItems={beneficiaries.map(translateBeneficiariesType)}
          listOtherItem={beneficiariesOther}
          notes={beneficiariesNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div
            className={
              treatDualElligibleDifferent === TriStateAnswer.YES
                ? 'desktop:width-card-lg'
                : ''
            }
          >
            <ReadOnlySection
              heading={t('dualEligibility')}
              copy={
                treatDualElligibleDifferent &&
                translateTriStateAnswer(treatDualElligibleDifferent)
              }
            />
          </div>
          {treatDualElligibleDifferent === TriStateAnswer.YES && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('howSo')}
                copy={treatDualElligibleDifferentHow}
              />
            </div>
          )}
        </div>
        {treatDualElligibleDifferentNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={treatDualElligibleDifferentNote}
          />
        )}

        <div className="desktop:display-flex flex-justify">
          <div
            className={
              excludeCertainCharacteristics === TriStateAnswer.YES
                ? 'desktop:width-card-lg'
                : ''
            }
          >
            <ReadOnlySection
              heading={t('excluded')}
              copy={
                excludeCertainCharacteristics &&
                translateTriStateAnswer(excludeCertainCharacteristics)
              }
            />
          </div>
          {excludeCertainCharacteristics === TriStateAnswer.YES && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={t('excludedNestedQuestion')}
                copy={excludeCertainCharacteristicsCriteria}
              />
            </div>
          )}
        </div>
        {excludeCertainCharacteristicsNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={excludeCertainCharacteristicsNote}
          />
        )}
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('howManyImpacted')}
          copy={numberPeopleImpacted?.toString()}
        />

        <ReadOnlySection
          heading={t('levelOfConfidence')}
          copy={
            estimateConfidence && translateConfidenceType(estimateConfidence)
          }
          notes={confidenceNote}
        />

        <ReadOnlySection
          heading={t('chooseBeneficiariesQuestion')}
          list
          listItems={beneficiarySelectionMethod.map(
            translateSelectionMethodType
          )}
          listOtherItem={beneficiarySelectionOther}
          notes={beneficiarySelectionNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2">
        {/* If "Other", then display "Other — Lorem ipsum." */}
        {/* Else just display content, i.e. "LOI (Letter of interest)" */}
        <ReadOnlySection
          heading={t('beneficiaryFrequency')}
          copy={
            beneficiarySelectionFrequency &&
            (beneficiarySelectionFrequency === FrequencyType.OTHER
              ? `${translateFrequencyType(
                  beneficiarySelectionFrequency
                )} \u2014  ${beneficiarySelectionFrequencyOther}`
              : translateFrequencyType(beneficiarySelectionFrequency))
          }
          notes={beneficiarySelectionFrequencyNote}
        />

        <ReadOnlySection
          heading={t('beneficiaryOverlap')}
          copy={beneficiaryOverlap && translateOverlapType(beneficiaryOverlap)}
          notes={beneficiaryOverlapNote}
        />

        <ReadOnlySection
          heading={t('benficiaryPrecedence')}
          copy={precedenceRules}
        />
      </div>
    </div>
  );
};

export default ReadOnlyBeneficiaries;
