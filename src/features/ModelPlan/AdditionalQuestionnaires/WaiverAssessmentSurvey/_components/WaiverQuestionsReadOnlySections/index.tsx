import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { convertToLowercaseAndDashes } from 'features/HelpAndKnowledge/Articles/TwoPagerMeeting';
import SimpleReadOnlySection from 'features/ModelPlan/ReadOnly/_components/SimpleReadOnlySection';
import WaiverSurveyReadOnlySection from 'features/ModelPlan/ReadOnly/_components/WaiverSurveyReadOnlySection';
import { GetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import usePlanTranslation from 'hooks/usePlanTranslation';

import {
  buildWaiverModelQuestionsData,
  buildWaiverQuestionConfigs,
  buildWaiverQuestionsSectionsConfig
} from '../../util';

type WaiverQuestionsReadOnlySectionsProps = {
  modelPlan: GetAllWaiverAssessmentSurveyQuery['modelPlan'];
};

/** Renders read-only model question and waiver assessment survey question sections. */
const WaiverQuestionsReadOnlySections = ({
  modelPlan
}: WaiverQuestionsReadOnlySectionsProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const modelBasicsConfig = usePlanTranslation('basics');
  const generalCharacteristicsConfig = usePlanTranslation(
    'generalCharacteristics'
  );
  const waiverAssessmentSurveyConfig = usePlanTranslation(
    'waiverAssessmentSurvey'
  );

  const waiverQuestionsConfig = buildWaiverQuestionsSectionsConfig(
    buildWaiverQuestionConfigs(
      modelBasicsConfig,
      generalCharacteristicsConfig,
      waiverAssessmentSurveyConfig
    ),
    {
      modelPlanQuestions: waiverAssessmentSurveyMiscT(
        'modelPlanQuestions.heading'
      ),
      waiverSurveyQuestions: waiverAssessmentSurveyMiscT(
        'activeModelWaivers.heading'
      )
    }
  );

  const modelQuestionsData = buildWaiverModelQuestionsData(
    modelPlan.basics,
    modelPlan.generalCharacteristics
  );

  const waiverAssessmentSurveyData =
    modelPlan.questionnaires.waiverAssessmentSurvey;

  return (
    <>
      {Object.keys(waiverQuestionsConfig).map((questionType, index) => {
        const waiverConfig =
          waiverQuestionsConfig[
            questionType as keyof typeof waiverQuestionsConfig
          ];

        return (
          <div
            key={questionType}
            id={`${convertToLowercaseAndDashes(questionType)}-read-view`}
            className={classNames(
              index !== Object.keys(waiverQuestionsConfig).length - 1
                ? 'margin-bottom-5'
                : 'margin-bottom-6'
            )}
          >
            <h3 className="margin-top-0 margin-bottom-05">
              {waiverConfig.heading}
            </h3>

            <UswdsReactLink
              to={waiverConfig.href}
              data-testid={`edit-${convertToLowercaseAndDashes(waiverConfig.heading)}-section`}
              className="deep-underline display-block margin-bottom-3 mint-body-normal"
            >
              {waiverAssessmentSurveyMiscT('confirmAndSubmit.editSection')}
            </UswdsReactLink>

            {Object.keys(waiverConfig.config).map(questionConfig =>
              questionType === 'modelPlanQuestions' ? (
                <SimpleReadOnlySection
                  key={questionConfig}
                  field={questionConfig}
                  translations={waiverConfig.config}
                  values={modelQuestionsData}
                />
              ) : (
                <WaiverSurveyReadOnlySection
                  key={questionConfig}
                  field={questionConfig}
                  translations={waiverConfig.config}
                  values={waiverAssessmentSurveyData}
                />
              )
            )}
          </div>
        );
      })}
    </>
  );
};

export default WaiverQuestionsReadOnlySections;
