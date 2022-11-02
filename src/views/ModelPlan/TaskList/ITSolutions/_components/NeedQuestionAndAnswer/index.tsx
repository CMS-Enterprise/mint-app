import React from 'react';
import { useTranslation } from 'react-i18next';
// import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import classNames from 'classnames';

import operationalNeedMap from 'data/operationalNeedMap';
import GetOperationalNeedAnswer from 'queries/ITSolutions/GetOperationalNeedAnswer';
import { GetOperationalNeedAnswer_modelPlan as GetOperationalNeedAnswerModelPlanType } from 'queries/ITSolutions/types/GetOperationalNeedAnswer';
import { translateBoolean } from 'utils/modelPlan';

type NeedQuestionAndAnswerProps = {
  className?: string;
  operationalNeed: any; // TODO: import op need type
  modelID: string;
};

type NeedMapType = {
  [key: string]: (type: any) => string;
};

const needsTranslations: NeedMapType = {
  translateBoolean
};

const NeedQuestionAndAnswer = ({
  className,
  operationalNeed,
  modelID
}: NeedQuestionAndAnswerProps) => {
  const { t } = useTranslation('itSolutions');
  // const history = useHistory();

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
      appealPerformance: fieldName.includes('appealPerformance'),
      appealFeedback: fieldName.includes('appealFeedback'),
      appealPayments: fieldName.includes('appealPayments'),
      appealOther: fieldName.includes('appealOther'),
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

  let answer: any;

  if (operationalNeed.key === 'PROCESS_PART_APPEALS') {
    [fieldName as string[]].forEach((field: any) => {
      if (
        data?.modelPlan[
          needConfig.parentField as keyof GetOperationalNeedAnswerModelPlanType
        ][field]
      ) {
        answer = true;
      }
    });
  } else {
    answer =
      data?.modelPlan[
        needConfig.parentField as keyof GetOperationalNeedAnswerModelPlanType
      ][fieldName as string];
  }

  return (
    <div className={classNames('padding-3 bg-base-lightest', className)}>
      <p className="text-bold margin-y-1">{t('operationalNeed')}</p>
      <p className="margin-y-0 font-body-sm">
        {operationalNeed?.nameOther || operationalNeed?.name}
      </p>
      <p>{t(needConfig.question)}</p>
      {data && <p>{needsTranslations[needConfig.answer](answer)}</p>}
    </div>
  );
};

export default NeedQuestionAndAnswer;
