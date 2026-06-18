import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type BreadcrumbItems = {
  text: string;
  url: string;
};

export enum BreadcrumbItemOptions {
  ADDITIONAL_QUESTIONNAIRES = 'ADDITIONAL_QUESTIONNAIRES',
  ANALYTICS = 'ANALYTICS',
  BASICS = 'BASICS',
  BENEFICIARIES = 'BENEFICIARIES',
  COLLABORATION_AREA = 'COLLABORATION_AREA',
  COLLABORATORS = 'COLLABORATORS',
  CONTRACT_ASSISTANCE = 'CONTRACT_ASSISTANCE',
  CR_TDLS = 'CR_TDLS',
  DATA_EXCHANGE_APPROACH = 'DATA_EXCHANGE_APPROACH',
  DOCUMENTS = 'DOCUMENTS',
  GENERAL_CHARACTERISTICS = 'GENERAL_CHARACTERISTICS',
  HELP_CENTER = 'HELP_CENTER',
  HELP_SOLUTIONS = 'HELP_SOLUTIONS',
  HOME = 'HOME',
  HOME_SETTINGS = 'HOME_SETTINGS',
  IDDOC_QUESTIONNAIRE = 'IDDOC_QUESTIONNAIRE',
  MODEL_TO_OPERATIONS = 'MODEL_TO_OPERATIONS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  OPS_EVAL_AND_LEARNING = 'OPS_EVAL_AND_LEARNING',
  PARTICIPANTS_AND_PROVIDERS = 'PARTICIPANTS_AND_PROVIDERS',
  PAYMENTS = 'PAYMENTS',
  PREPARE_FOR_CLEARANCE = 'PREPARE_FOR_CLEARANCE',
  STATUS = 'STATUS',
  TASK_LIST = 'TASK_LIST',
  TASKS = 'TASKS',
  TIMELINE = 'TIMELINE'
}

export interface BreadcrumbsProps {
  className?: string;
  items: BreadcrumbItemOptions[];
  customItem?: string;
}

export const commonBreadCrumbs = (
  modelID: string
): Record<BreadcrumbItemOptions, BreadcrumbItems> => ({
  ADDITIONAL_QUESTIONNAIRES: {
    text: 'additionalQuestionnaires:heading',
    url: `/models/${modelID}/collaboration-area/additional-questionnaires`
  },
  ANALYTICS: {
    text: 'analytics:heading',
    url: `/analytics`
  },
  BASICS: {
    text: 'basicsMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/basics`
  },
  BENEFICIARIES: {
    text: 'beneficiariesMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/beneficiaries`
  },
  COLLABORATION_AREA: {
    text: 'collaborationArea:heading',
    url: `/models/${modelID}/collaboration-area`
  },
  COLLABORATORS: {
    text: 'collaboratorsMisc:manageModelTeam',
    url: `/models/${modelID}/collaboration-area/collaborators`
  },
  CONTRACT_ASSISTANCE: {
    text: 'contractAssistance:hkcHeading',
    url: '/help-and-knowledge/contract-assistance'
  },
  CR_TDLS: {
    text: 'crtdlsMisc:heading',
    url: `/models/${modelID}/collaboration-area/cr-tdls`
  },
  DATA_EXCHANGE_APPROACH: {
    text: 'dataExchangeApproachMisc:heading',
    url: `/models/${modelID}/collaboration-area/additional-questionnaires/data-exchange-approach/about-data-exchange-approach`
  },
  DOCUMENTS: {
    text: 'documentsMisc:heading',
    url: `/models/${modelID}/collaboration-area/documents`
  },
  GENERAL_CHARACTERISTICS: {
    text: 'generalCharacteristicsMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/characteristics`
  },
  HELP_CENTER: {
    text: 'helpAndKnowledge:heading',
    url: '/help-and-knowledge'
  },
  HELP_SOLUTIONS: {
    text: 'helpAndKnowledge:operationalSolutions',
    url: '/help-and-knowledge/operational-solutions?page=1'
  },
  HOME: {
    text: 'miscellaneous:home',
    url: '/'
  },
  HOME_SETTINGS: {
    text: 'homepageSettings:heading',
    url: '/homepage-settings/form'
  },
  IDDOC_QUESTIONNAIRE: {
    text: 'iddocQuestionnaireMisc:heading',
    url: `/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations`
  },
  MODEL_TO_OPERATIONS: {
    text: 'modelToOperationsMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-to-operations`
  },
  NOTIFICATIONS: {
    text: 'notifications:breadcrumb',
    url: '/notifications'
  },
  OPS_EVAL_AND_LEARNING: {
    text: 'opsEvalAndLearningMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/ops-eval-and-learning`
  },
  PARTICIPANTS_AND_PROVIDERS: {
    text: 'participantsAndProvidersMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/participants-and-providers`
  },
  PAYMENTS: {
    text: 'paymentsMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/payment`
  },
  PREPARE_FOR_CLEARANCE: {
    text: 'prepareForClearance:heading',
    url: `/models/${modelID}/collaboration-area/model-plan/prepare-for-clearance`
  },
  STATUS: {
    text: 'modelPlanMisc:headingStatus',
    url: `/models/${modelID}}/collaboration-area/status`
  },
  TASK_LIST: {
    text: 'modelPlanTaskList:heading',
    url: `/models/${modelID}/collaboration-area/model-plan`
  },
  TASKS: {
    text: 'tasks:breadcrumb',
    url: `/models/${modelID}/collaboration-area/tasks`
  },
  TIMELINE: {
    text: 'timelineMisc:heading',
    url: `/models/${modelID}/collaboration-area/model-timeline`
  }
});

// Last item in the array can be a custom text string, so we need to check if it's a common item or not
const Breadcrumbs = ({ items, customItem, className }: BreadcrumbsProps) => {
  const { t } = useTranslation();

  const { modelID = '' } = useParams<{
    modelID: string;
    operationalNeedID?: string;
  }>();

  return (
    <BreadcrumbBar variant="wrap" className={classNames(className)}>
      <>
        {items.map((item, idx) => {
          if (idx === items.length - 1 && !customItem) {
            return (
              <Breadcrumb
                key={t(commonBreadCrumbs(modelID)[item].text)}
                current
              >
                <span>{t(commonBreadCrumbs(modelID)[item].text)}</span>
              </Breadcrumb>
            );
          }
          return (
            <Breadcrumb key={t(commonBreadCrumbs(modelID)[item].text)}>
              <BreadcrumbLink
                asCustom={UswdsReactLink}
                to={t(commonBreadCrumbs(modelID)[item].url)}
              >
                <span>{t(commonBreadCrumbs(modelID)[item].text)}</span>
              </BreadcrumbLink>
            </Breadcrumb>
          );
        })}
        {customItem && (
          <Breadcrumb key={customItem} current>
            <span>{customItem}</span>
          </Breadcrumb>
        )}
      </>
    </BreadcrumbBar>
  );
};

export default Breadcrumbs;
