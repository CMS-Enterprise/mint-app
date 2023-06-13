import React, { useContext } from 'react';
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
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyBeneficiaries = ({
  modelID,
  clearance,
  isViewingFilteredView
}: ReadOnlyProps) => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');

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

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('beneficiariesQuestion')}
          list
          listItems={beneficiaries?.map(translateBeneficiariesType)}
          listOtherItem={beneficiariesOther}
          notes={beneficiariesNote}
        />

        <SideBySideReadOnlySection
          firstSection={{
            heading: t('dualEligibility'),
            copy:
              treatDualElligibleDifferent &&
              translateTriStateAnswer(treatDualElligibleDifferent)
          }}
          secondSection={
            treatDualElligibleDifferent === TriStateAnswer.YES && {
              heading: h('howSo'),
              copy: treatDualElligibleDifferentHow
            }
          }
        />
        {treatDualElligibleDifferentNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={treatDualElligibleDifferentNote}
          />
        )}

        <SideBySideReadOnlySection
          firstSection={{
            heading: t('excluded'),
            copy:
              excludeCertainCharacteristics &&
              translateTriStateAnswer(excludeCertainCharacteristics)
          }}
          secondSection={
            excludeCertainCharacteristics === TriStateAnswer.YES && {
              heading: t('excludedNestedQuestion'),
              copy: excludeCertainCharacteristicsCriteria
            }
          }
        />

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
          listItems={beneficiarySelectionMethod?.map(
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
