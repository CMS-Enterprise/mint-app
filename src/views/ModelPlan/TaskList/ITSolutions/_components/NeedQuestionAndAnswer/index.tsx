import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { IconExpandLess, IconExpandMore } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import operationalNeedMap, { NeedMap } from 'data/operationalNeedMap';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import GetOperationalNeedAnswer from 'queries/ITSolutions/GetOperationalNeedAnswer';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeed_operationalNeed as GetOperationalNeedOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import { GetOperationalNeedAnswer_modelPlan as GetOperationalNeedAnswerModelPlanType } from 'queries/ITSolutions/types/GetOperationalNeedAnswer';
import {
  translateAppealsQuestionType,
  translateBenchmarkForPerformanceType,
  translateBoolean,
  translateCommunicationType,
  translateDataForMonitoringType,
  translateDataToSendParticipantsType,
  translateEvaluationApproachType,
  translateModelLearningSystemType,
  translateNonClaimsBasedPayType,
  translateParticipantSelectiontType,
  translatePayType,
  translateRecruitmentType
} from 'utils/modelPlan';

import './index.scss';

type NeedQuestionAndAnswerProps = {
  className?: string;
  operationalNeedID: string;
  modelID: string;
};

// Type definition for operational needs dependent on multiple questions/translations
type MultiPartType = {
  question: string;
  answer: boolean | string;
};

type NeedMapType = {
  [key: string]: (type: any) => string;
};

// Collection of translations needed for operational needs questions/answers
const needsTranslations: NeedMapType = {
  translateBoolean,
  translateRecruitmentType,
  translateParticipantSelectiontType,
  translateCommunicationType,
  translateBenchmarkForPerformanceType,
  translateEvaluationApproachType,
  translateDataForMonitoringType,
  translateDataToSendParticipantsType,
  translateModelLearningSystemType,
  translatePayType,
  translateNonClaimsBasedPayType,
  translateAppealsQuestionType
};

// Function to format operational need answers for both single and multipart answers
const formatOperationalNeedAnswers = (needConfig: NeedMap, data: any) => {
  let answers: any;

  // If multipart, push an object to the answer array, rather than a string
  // Object contains an question field and an answer field
  if (needConfig?.multiPart) {
    answers = [];

    // Extracts the answer from the parent field of the GQL query return data
    (needConfig?.fieldName as string[]).forEach((field: any) => {
      const multiAnswer =
        data?.modelPlan[
          needConfig?.parentField as keyof GetOperationalNeedAnswerModelPlanType
        ][field as string];

      if (multiAnswer !== null && multiAnswer !== undefined) {
        answers.push({
          question: field,
          answer: multiAnswer
        });
      }
    });
  } else {
    answers =
      data?.modelPlan[
        needConfig?.parentField as keyof GetOperationalNeedAnswerModelPlanType
      ][needConfig?.fieldName as string];
  }

  // Return all answers as an array used for standard rendering
  if (answers?.constructor !== Array) {
    answers = [answers];
  }

  return answers;
};

// Default values for fetching an operational need
export const initialValues: GetOperationalNeedOperationalNeedType = {
  __typename: 'OperationalNeed',
  id: '',
  modelPlanID: '',
  name: '',
  key: null,
  nameOther: '',
  needed: false,
  solutions: []
};

const NeedQuestionAndAnswer = ({
  className,
  operationalNeedID,
  modelID
}: NeedQuestionAndAnswerProps) => {
  const { t } = useTranslation('itSolutions');

  // Toggle the collapsed state of operational need question/answer
  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  // Fetch operational need answer to question
  const { data: need } = useQuery<
    GetOperationalNeedType,
    GetOperationalNeedVariables
  >(GetOperationalNeed, {
    variables: {
      id: operationalNeedID
    }
  });

  const operationalNeed = need?.operationalNeed || initialValues;

  // Config map of operational need key to route, translations, gql schema, etc
  const needConfig = operationalNeedMap[operationalNeed.key || ''];
  const parentField = needConfig?.parentField;
  const fieldName = needConfig?.fieldName;

  // Conditionally pass variables if config map references field
  const queryVariables = {
    variables: {
      id: modelID,
      generalCharacteristics: parentField === 'generalCharacteristics',
      participantsAndProviders: parentField === 'participantsAndProviders',
      opsEvalAndLearning: parentField === 'opsEvalAndLearning',
      payments: parentField === 'payments',
      managePartCDEnrollment: fieldName === 'managePartCDEnrollment',
      collectPlanBids: fieldName === 'collectPlanBids',
      planContactUpdated: fieldName === 'planContactUpdated',
      recruitmentMethod: fieldName === 'recruitmentMethod',
      selectionMethod: fieldName === 'selectionMethod',
      communicationMethod: fieldName === 'communicationMethod',
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
      payType: fieldName === 'payType',
      shouldAnyProvidersExcludedFFSSystems:
        fieldName === 'shouldAnyProvidersExcludedFFSSystems',
      nonClaimsPayments: fieldName === 'nonClaimsPayments',
      willRecoverPayments: fieldName === 'willRecoverPayments'
    },
    // skip if operational need requires no question/answer
    skip: !needConfig
  };

  // Because of the dynamic nature of the input and return schema, having a standard TS type isn't applicable
  // Maybe reasearch into this further for better type safety
  const { data } = useQuery(GetOperationalNeedAnswer, queryVariables);

  const answers = useMemo(() => {
    return formatOperationalNeedAnswers(needConfig, data);
  }, [needConfig, data]);

  return (
    <div className={classNames('padding-3 bg-base-lightest', className)}>
      <p className="text-bold margin-y-1">{t('operationalNeed')}</p>

      <p className="margin-top-0 font-body-sm">
        {operationalNeed?.nameOther || operationalNeed?.name}
      </p>

      <button
        type="button"
        data-testid="toggle-need-answer"
        onClick={() => setInfoToggle(!infoToggle)}
        className={classNames(
          'usa-button usa-button--unstyled display-flex flex-align-center text-ls-1 deep-underline margin-bottom-1 margin-top-3',
          {
            'text-bold': infoToggle
          }
        )}
      >
        {infoToggle ? (
          <IconExpandMore className="margin-right-05" />
        ) : (
          <IconExpandLess className="margin-right-05 needs-question__rotate" />
        )}
        {t('whyNeed')}
      </button>

      {infoToggle && (
        <div className="margin-left-neg-2px padding-1">
          <div className="border-left-05 border-base-dark padding-left-2 padding-y-1">
            <p className="text-bold margin-top-0">{t('youAnswered')}</p>

            <p data-testid="need-question">{t(needConfig?.question)}</p>

            {data && needConfig && (
              <ul className="padding-left-4">
                {!needConfig.multiPart &&
                  answers.map((answer: string | boolean) => (
                    <li
                      className="margin-y-1"
                      key={answer.toString()}
                      data-testid={answer.toString()}
                    >
                      {needsTranslations[needConfig.answer](answer)}
                    </li>
                  ))}

                {needConfig.multiPart &&
                  needConfig.multiPartQuestion &&
                  answers.map((answer: MultiPartType) => (
                    <li className="margin-y-1" key={answer.question}>
                      {needsTranslations[needConfig.multiPartQuestion!](
                        answer.question
                      )}{' '}
                      - {needsTranslations[needConfig.answer](answer.answer)}
                    </li>
                  ))}
              </ul>
            )}

            <p className="margin-bottom-0">
              {t('changeAnswer')}
              <UswdsReactLink
                to={`/models/${modelID}/task-list/${needConfig?.route}`}
              >
                {t('goToQuestion')}
              </UswdsReactLink>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedQuestionAndAnswer;
