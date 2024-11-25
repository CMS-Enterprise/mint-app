import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetMilestoneSuggestedAnswerQuery,
  useGetMilestoneSuggestedAnswerQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';

import { MilestoneCardType } from '../../MilestoneLibrary';

import milestoneMap, { MilestoneFieldType } from './milestoneMap';

type MilestoneSuggestedAnswerQueryType =
  GetMilestoneSuggestedAnswerQuery['modelPlan'];

// Type definition for milestones dependent on multiple questions/translations
type MultiPartType = {
  question: string;
  answer: boolean | string;
};

// Function to formatmilestone answers for both single and multipart answers
const formatMilestoneAnswers = (config: MilestoneFieldType, data: any) => {
  let answers: any;

  const fieldAnswer =
    data[config?.parentField as keyof MilestoneSuggestedAnswerQueryType]?.[
      config?.fieldName as string
    ];

  // If multipart, push an object to the answer array, rather than a string
  // Object contains an question field and an answer field
  if (config?.multiPart) {
    answers = [];

    // Extracts the answer from the parent field of the GQL query return data
    (config?.fieldName as string[]).forEach((field: any) => {
      if (fieldAnswer !== null && fieldAnswer !== undefined) {
        answers.push({
          question: field,
          answer: fieldAnswer
        });
      }
    });
  } else {
    answers = fieldAnswer ? [fieldAnswer] : [];
  }

  // Return all answers as an array used for standard rendering
  if (answers?.constructor !== Array) {
    answers = [answers];
  }

  return answers;
};

type SuggestedMilestoneToggleType = {
  milestone: MilestoneCardType;
  className?: string;
};

const SuggestedMilestoneToggle = ({
  milestone,
  className
}: SuggestedMilestoneToggleType) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  // Toggle the collapsed state of milestone question/answer
  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  // Config map of milestone key to route, translations, gql schema, etc
  const milestoneConfig = milestoneMap[milestone.key || ''];
  const parentField = milestoneConfig?.parentField;
  const fieldName = milestoneConfig?.fieldName;

  // Conditionally pass variables if config map references field
  const queryVariables = {
    variables: {
      id: modelID,
      generalCharacteristics: parentField === 'generalCharacteristics',
      participantsAndProviders: parentField === 'participantsAndProviders',
      beneficiaries: parentField === 'beneficiaries',
      opsEvalAndLearning: parentField === 'opsEvalAndLearning',
      payments: parentField === 'payments',
      managePartCDEnrollment: fieldName === 'managePartCDEnrollment',
      collectPlanBids: fieldName === 'collectPlanBids',
      planContractUpdated: fieldName === 'planContractUpdated',
      agreementTypes: fieldName === 'agreementTypes',
      recruitmentMethod: fieldName === 'recruitmentMethod',
      selectionMethod: fieldName === 'selectionMethod',
      communicationMethod: fieldName === 'communicationMethod',
      providerOverlap: fieldName === 'providerOverlap',
      participantsIds: fieldName === 'participantsIds',
      beneficiaryOverlap: fieldName === 'beneficiaryOverlap',
      helpdeskUse: fieldName === 'helpdeskUse',
      iddocSupport: fieldName === 'iddocSupport',
      benchmarkForPerformance: fieldName === 'benchmarkForPerformance',
      appealPerformance: fieldName?.includes('appealPerformance'),
      appealFeedback: fieldName?.includes('appealFeedback'),
      appealPayments: fieldName?.includes('appealPayments'),
      appealOther: fieldName?.includes('appealOther'),
      evaluationApproaches: fieldName === 'evaluationApproaches',
      dataNeededForMonitoring: fieldName === 'dataNeededForMonitoring',
      dataToSendParticicipants: fieldName === 'dataToSendParticicipants',
      modelLearningSystems: fieldName === 'modelLearningSystems',
      developNewQualityMeasures: fieldName === 'developNewQualityMeasures',
      payType: fieldName === 'payType',
      shouldAnyProvidersExcludedFFSSystems:
        fieldName === 'shouldAnyProvidersExcludedFFSSystems',
      nonClaimsPayments: fieldName === 'nonClaimsPayments',
      willRecoverPayments: fieldName === 'willRecoverPayments'
    },
    // skip if milestone requires no question/answer
    skip: !milestoneConfig
  };

  // Because of the dynamic nature of the input and return schema, having a standard TS type isn't applicable
  // Maybe reasearch into this further for better type safety
  const { data, loading: answerLoading } =
    useGetMilestoneSuggestedAnswerQuery(queryVariables);

  const answers = useMemo(() => {
    return data?.modelPlan
      ? formatMilestoneAnswers(milestoneConfig, data.modelPlan)
      : [];
  }, [milestoneConfig, data]);

  return (
    <div className={classNames(className)}>
      <button
        type="button"
        data-testid="toggle-milestone-answer"
        onClick={() => setInfoToggle(!infoToggle)}
        className={classNames(
          'usa-button usa-button--unstyled display-flex flex-align-center text-ls-1 deep-underline margin-bottom-1 margin-top-1',
          {
            'text-bold': infoToggle
          }
        )}
      >
        {infoToggle ? (
          <Icon.ExpandMore className="margin-right-05" />
        ) : (
          <Icon.ExpandLess className="margin-right-05 needs-question__rotate" />
        )}

        {t('milestoneLibrary.whySuggested')}
      </button>

      {infoToggle && (
        <>
          {!data && answerLoading ? (
            <Spinner size="large" center testId="milestone-spinner" />
          ) : (
            <div className="margin-left-neg-2px padding-1">
              <div className="border-left-05 border-base-dark padding-left-2 padding-y-1">
                <p className="text-bold margin-top-0">
                  {t('milestoneLibrary.youAnswered')}
                </p>

                <p data-testid="milestone-question">
                  {t(milestoneConfig?.question)}
                </p>

                {data && milestoneConfig && (
                  <ul className="padding-left-4">
                    {!milestoneConfig.multiPart &&
                      answers.map((answer: string | boolean) => (
                        <li
                          className="margin-y-1"
                          key={answer.toString()}
                          data-testid={answer.toString()}
                        >
                          {i18next.t(
                            `${milestoneConfig.parentField}:${milestoneConfig.fieldName}.options.${answer}`
                          )}
                        </li>
                      ))}

                    {milestoneConfig.multiPart &&
                      answers.map((answer: MultiPartType) => (
                        <li className="margin-y-1" key={answer.question}>
                          {i18next.t(
                            `${milestoneConfig.parentField}:${answer.question}.label`
                          )}{' '}
                          -{' '}
                          {i18next.t(
                            `${milestoneConfig.parentField}:${answer.question}.options.${answer.answer}`
                          )}
                        </li>
                      ))}
                  </ul>
                )}

                <p className="margin-bottom-0">
                  {t('milestoneLibrary.changeAnswer')}
                  <UswdsReactLink
                    className="display-block"
                    to={{
                      pathname: `/models/${modelID}/collaboration-area/task-list/${milestoneConfig?.route}`,
                      state: {
                        scrollElement: milestoneConfig.fieldName.toString()
                      }
                    }}
                  >
                    {t('milestoneLibrary.goToQuestion')}
                  </UswdsReactLink>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuggestedMilestoneToggle;
