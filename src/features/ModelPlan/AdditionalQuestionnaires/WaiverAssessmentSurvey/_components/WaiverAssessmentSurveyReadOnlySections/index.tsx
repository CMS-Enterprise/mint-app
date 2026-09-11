import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { convertToLowercaseAndDashes } from 'features/HelpAndKnowledge/Articles/TwoPagerMeeting';
import SimpleReadOnlySection from 'features/ModelPlan/ReadOnly/_components/SimpleReadOnlySection';
import { GetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import usePlanTranslation from 'hooks/usePlanTranslation';

import {
  buildWaiverAssessmentSurveyModelQuestionsData,
  buildWaiverAssessmentSurveyQuestionConfigs,
  buildWaiverAssessmentSurveySectionsConfig
} from '../../util';

type WaiverAssessmentSurveyReadOnlySectionsProps = {
  modelPlan: GetAllWaiverAssessmentSurveyQuery['modelPlan'];
};

/** Renders read-only waiver assessment survey question sections. */
const WaiverAssessmentSurveyReadOnlySections = ({
  modelPlan
}: WaiverAssessmentSurveyReadOnlySectionsProps) => {
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

  const surveyQuestionsConfig = buildWaiverAssessmentSurveySectionsConfig(
    buildWaiverAssessmentSurveyQuestionConfigs(
      modelBasicsConfig,
      generalCharacteristicsConfig,
      waiverAssessmentSurveyConfig
    ),
    {
      modelPlanQuestions: waiverAssessmentSurveyMiscT(
        'modelPlanQuestions.heading'
      ),
      medicarePaymentWaivers: waiverAssessmentSurveyMiscT(
        'medicarePaymentWaivers.heading'
      ),
      programWaivers: waiverAssessmentSurveyMiscT(
        'programWaivers.readOnlyHeading'
      ),
      medicaidPaymentWaivers: waiverAssessmentSurveyMiscT(
        'medicaidPaymentWaivers.heading'
      )
    }
  );

  const modelQuestionsData = buildWaiverAssessmentSurveyModelQuestionsData(
    modelPlan.basics,
    modelPlan.generalCharacteristics
  );

  const waiverAssessmentSurveyData =
    modelPlan.questionnaires.waiverAssessmentSurvey;

  return (
    <>
      {Object.keys(surveyQuestionsConfig).map((waiverSurvey, index) => {
        const waiverConfig =
          surveyQuestionsConfig[
            waiverSurvey as keyof typeof surveyQuestionsConfig
          ];

        return (
          <div
            key={waiverSurvey}
            id={`${convertToLowercaseAndDashes(waiverSurvey)}-read-view`}
            className={classNames(
              index !== Object.keys(surveyQuestionsConfig).length - 1
                ? 'margin-bottom-5'
                : 'margin-bottom-6'
            )}
          >
            <h3 className="margin-top-0 margin-bottom-1">
              {waiverConfig.heading}
            </h3>

            <UswdsReactLink
              to={waiverConfig.href}
              data-testid={`edit-${convertToLowercaseAndDashes(waiverConfig.heading)}-section`}
              className="deep-underline display-block margin-bottom-3 mint-body-normal"
            >
              {waiverAssessmentSurveyMiscT('confirmAndSubmit.editSection')}
            </UswdsReactLink>

            {Object.keys(waiverConfig.config).map(questionConfig => (
              <SimpleReadOnlySection
                key={questionConfig}
                field={questionConfig}
                translations={waiverConfig.config}
                values={
                  waiverSurvey === 'modePlanQuestions'
                    ? modelQuestionsData
                    : waiverAssessmentSurveyData
                }
              />
            ))}
          </div>
        );
      })}
    </>
  );
};

export default WaiverAssessmentSurveyReadOnlySections;
