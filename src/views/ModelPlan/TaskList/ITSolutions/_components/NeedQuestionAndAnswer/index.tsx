import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Grid, GridContainer } from '@trussworks/react-uswds';
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
import { GetOperationalSolution_operationalSolution as GetOperationalSolutionType } from 'queries/ITSolutions/types/GetOperationalSolution';

import SolutionCard from '../SolutionCard';

import InfoToggle from './_component/InfoToggle';

import './index.scss';

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

type NeedQuestionAndAnswerProps = {
  className?: string;
  operationalNeedID: string;
  modelID: string;
  expanded?: boolean;
  solution?: GetOperationalSolutionType; // Solution passed as prop if want to render a SolutionCard beneath the need question
};

const NeedQuestionAndAnswer = ({
  className,
  operationalNeedID,
  modelID,
  expanded,
  solution
}: NeedQuestionAndAnswerProps) => {
  const { t } = useTranslation('itSolutions');

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
      beneficiaries: parentField === 'beneficiaries',
      opsEvalAndLearning: parentField === 'opsEvalAndLearning',
      payments: parentField === 'payments',
      managePartCDEnrollment: fieldName === 'managePartCDEnrollment',
      collectPlanBids: fieldName === 'collectPlanBids',
      planContractUpdated: fieldName === 'planContractUpdated',
      recruitmentMethod: fieldName === 'recruitmentMethod',
      selectionMethod: fieldName === 'selectionMethod',
      communicationMethod: fieldName === 'communicationMethod',
      providerOverlap: fieldName === 'providerOverlap',
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
    <GridContainer
      className={classNames('padding-3 bg-base-lightest maxw-none', className)}
    >
      <Grid row>
        <Grid desktop={{ col: expanded ? 6 : 12 }}>
          <p className="text-bold margin-y-1">{t('operationalNeed')}</p>

          <p
            className={classNames('margin-top-0 font-body-sm', {
              'margin-bottom-0': expanded
            })}
          >
            {operationalNeed?.nameOther || operationalNeed?.name}
          </p>
        </Grid>

        <Grid desktop={{ col: expanded ? 6 : 12 }}>
          {needConfig ? (
            <InfoToggle
              needConfig={needConfig}
              data={data}
              answers={answers}
              modelID={modelID}
            />
          ) : (
            <UswdsReactLink to={`/models/${modelID}/task-list/it-solutions`}>
              {t('editNeed')}
            </UswdsReactLink>
          )}

          {/* Renders a solution card if solution data present */}
          {solution && (
            <div>
              <p className="text-bold margin-top-4">{t('solution')}</p>
              <SolutionCard solution={solution} />
            </div>
          )}
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default NeedQuestionAndAnswer;
