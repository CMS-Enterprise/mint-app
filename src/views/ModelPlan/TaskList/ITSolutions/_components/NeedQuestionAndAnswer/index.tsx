import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
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

import OperationalNeedRemovalModal from '../OperationalNeedRemovalModal';
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
  isRenderingOnSolutionsDetails?: boolean;
  renderSolutionCardLinks?: boolean;
};

const NeedQuestionAndAnswer = ({
  className,
  operationalNeedID,
  modelID,
  expanded,
  solution,
  isRenderingOnSolutionsDetails = false,
  renderSolutionCardLinks = true
}: NeedQuestionAndAnswerProps) => {
  const { t } = useTranslation('opSolutionsMisc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch operational need answer to question
  const { data: need, loading } = useQuery<
    GetOperationalNeedType,
    GetOperationalNeedVariables
  >(GetOperationalNeed, {
    variables: {
      id: operationalNeedID,
      includeNotNeeded: false
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
    // skip if operational need requires no question/answer
    skip: !needConfig
  };

  // Because of the dynamic nature of the input and return schema, having a standard TS type isn't applicable
  // Maybe reasearch into this further for better type safety
  const { data, loading: answerLoading } = useQuery(
    GetOperationalNeedAnswer,
    queryVariables
  );

  const answers = useMemo(() => {
    return formatOperationalNeedAnswers(needConfig, data);
  }, [needConfig, data]);

  if ((!need && loading) || (!data && answerLoading)) {
    return <Spinner size="large" center testId="needs-spinner" />;
  }

  const renderLinks = () => {
    if (isRenderingOnSolutionsDetails) {
      return (
        <>
          <OperationalNeedRemovalModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            modelID={modelID}
            id={operationalNeed.id}
            nameOther={operationalNeed.nameOther ?? ''}
          />
          <UswdsReactLink
            to={`/models/${modelID}/task-list/it-solutions/update-need/${operationalNeed.id}`}
          >
            {t('updateThisOpertationalNeed')}
          </UswdsReactLink>
          <div className="margin-top-1">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="usa-button usa-button--unstyled line-height-body-5 text-red"
            >
              {t('removeNeed')}
            </Button>
          </div>
        </>
      );
    }
    return (
      <UswdsReactLink
        to={`/models/${modelID}/task-list/it-solutions/update-need/${operationalNeed.id}`}
      >
        {t('editNeed')}
      </UswdsReactLink>
    );
  };

  return (
    <GridContainer
      className={classNames('padding-3 bg-base-lightest maxw-none', className)}
    >
      <Grid row>
        <Grid desktop={{ col: expanded ? 6 : 12 }}>
          <p className="text-bold margin-y-1">{t('operationalNeed')}</p>

          <p
            className={classNames('margin-top-0 font-body-sm', {
              'margin-bottom-1': expanded
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
            renderLinks()
          )}

          {/* Renders a solution card if solution data present */}
          {solution && (
            <div>
              <p className="text-bold margin-top-4">{t('solution')}</p>
              <SolutionCard
                solution={solution}
                renderSolutionCardLinks={renderSolutionCardLinks}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default NeedQuestionAndAnswer;
