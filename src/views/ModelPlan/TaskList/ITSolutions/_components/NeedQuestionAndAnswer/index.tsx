import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { IconExpandLess, IconExpandMore } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import operationalNeedMap from 'data/operationalNeedMap';
import GetOperationalNeedAnswer from 'queries/ITSolutions/GetOperationalNeedAnswer';
import { GetOperationalNeedAnswer_modelPlan as GetOperationalNeedAnswerModelPlanType } from 'queries/ITSolutions/types/GetOperationalNeedAnswer';
import {
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
  operationalNeed: any; // TODO: import op need type
  modelID: string;
};

type NeedMapType = {
  [key: string]: (type: any) => string;
};

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
  translateNonClaimsBasedPayType
};

const NeedQuestionAndAnswer = ({
  className,
  operationalNeed,
  modelID
}: NeedQuestionAndAnswerProps) => {
  const { t } = useTranslation('itSolutions');

  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  const needConfig = operationalNeedMap[operationalNeed.key];
  const fieldName = needConfig?.fieldName;

  const queryVariables = {
    variables: {
      id: modelID,
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
    }
  };

  const { data } = useQuery(GetOperationalNeedAnswer, queryVariables);

  let answers: any;

  if (operationalNeed.key === 'PROCESS_PART_APPEALS') {
    [fieldName as string[]].forEach((field: any) => {
      if (
        data?.modelPlan[
          needConfig?.parentField as keyof GetOperationalNeedAnswerModelPlanType
        ][field]
      ) {
        answers = true;
      }
    });
  } else {
    answers =
      data?.modelPlan[
        needConfig?.parentField as keyof GetOperationalNeedAnswerModelPlanType
      ][fieldName as string];
  }

  if (answers?.constructor !== Array) {
    answers = [answers];
  }

  return (
    <div className={classNames('padding-3 bg-base-lightest', className)}>
      <p className="text-bold margin-y-1">{t('operationalNeed')}</p>

      <p className="margin-top-0 margin-bottom-3 font-body-sm">
        {operationalNeed?.nameOther || operationalNeed?.name}
      </p>

      <button
        type="button"
        onClick={() => setInfoToggle(!infoToggle)}
        className={classNames(
          'usa-button usa-button--unstyled display-flex flex-align-center text-ls-1 deep-underline margin-bottom-1',
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
        <div className="padding-left-1px padding-1">
          <div className="border-left-05 border-base-dark padding-left-2 padding-y-1">
            <p className="text-bold margin-top-0">{t('youAnswered')}</p>

            <p>{t(needConfig?.question)}</p>

            {data && (
              <ul className="padding-left-4">
                {answers.map((answer: string | boolean) => (
                  <li key={answer.toString()}>
                    {needsTranslations[needConfig.answer](answer)}
                  </li>
                ))}
              </ul>
            )}

            <p className="margin-bottom-0">
              {t('changeAnswer')}
              <UswdsReactLink
                to={`/models/${modelID}/task-list/${needConfig.route}`}
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
