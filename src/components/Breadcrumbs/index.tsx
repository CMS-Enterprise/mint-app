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
  HOME = 'HOME',
  HOME_SETTINGS = 'HOME_SETTINGS',
  TASK_LIST = 'TASK_LIST',
  COLLABORATION_AREA = 'COLLABORATION_AREA',
  NOTIFICATIONS = 'NOTIFICATIONS',
  HELP_CENTER = 'HELP_CENTER',
  HELP_SOLUTIONS = 'HELP_SOLUTIONS',
  BASICS = 'BASICS',
  GENERAL_CHARACTERISTICS = 'GENERAL_CHARACTERISTICS',
  PARTICIPANTS_AND_PROVIDERS = 'PARTICIPANTS_AND_PROVIDERS',
  BENEFICIARIES = 'BENEFICIARIES',
  OPS_EVAL_AND_LEARNING = 'OPS_EVAL_AND_LEARNING',
  PAYMENTS = 'PAYMENTS',
  IT_TRACKER = 'IT_TRACKER',
  ADD_SOLUTION = 'ADD_SOLUTION',
  SOLUTION_DETAILS = 'SOLUTION_DETAILS',
  PREPARE_FOR_CLEARANCE = 'PREPARE_FOR_CLEARANCE',
  COLLABORATORS = 'COLLABORATORS',
  DOCUMENTS = 'DOCUMENTS',
  CR_TDLS = 'CR_TDLS',
  STATUS = 'STATUS'
}

export interface BreadcrumbsProps {
  className?: string;
  items: BreadcrumbItemOptions[];
  customItem?: string;
}

export const commonBreadCrumbs = (
  modelID: string,
  operationalNeedID?: string,
  operationalSolutionID?: string
): Record<BreadcrumbItemOptions, BreadcrumbItems> => ({
  HOME: {
    text: 'plan:home',
    url: '/'
  },
  HOME_SETTINGS: {
    text: 'homepageSettings:heading',
    url: '/homepage-settings'
  },
  TASK_LIST: {
    text: 'modelPlanTaskList:heading',
    url: `/models/${modelID}/collaboration-area/task-list`
  },
  COLLABORATION_AREA: {
    text: 'collaborationArea:heading',
    url: `/models/${modelID}/collaboration-area`
  },
  NOTIFICATIONS: {
    text: 'notifications:breadcrumb',
    url: '/notifications'
  },
  HELP_CENTER: {
    text: 'helpAndKnowledge:heading',
    url: '/help-and-knowledge'
  },
  HELP_SOLUTIONS: {
    text: 'helpAndKnowledge:operationalSolutions',
    url: '/help-and-knowledge/operational-solutions?page=1'
  },
  BASICS: {
    text: 'basicsMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/basics`
  },
  GENERAL_CHARACTERISTICS: {
    text: 'generalCharacteristicsMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/characteristics`
  },
  PARTICIPANTS_AND_PROVIDERS: {
    text: 'participantsAndProvidersMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/participants-and-providers`
  },
  BENEFICIARIES: {
    text: 'beneficiariesMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/beneficiaries`
  },
  OPS_EVAL_AND_LEARNING: {
    text: 'opsEvalAndLearningMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning`
  },
  PAYMENTS: {
    text: 'paymentsMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/payments`
  },
  IT_TRACKER: {
    text: 'opSolutionsMisc:heading',
    url: `/models/${modelID}/collaboration-area/task-list/it-solutions`
  },
  ADD_SOLUTION: {
    text: 'opSolutionsMisc:addSolution',
    url: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-solution`
  },
  SOLUTION_DETAILS: {
    text: 'opSolutionsMisc:solutionDetails',
    url: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
  },
  PREPARE_FOR_CLEARANCE: {
    text: 'prepareForClearance:heading',
    url: `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance`
  },
  COLLABORATORS: {
    text: 'collaboratorsMisc:manageModelTeam',
    url: `/models/${modelID}}/collaboration-area/collaborators`
  },
  DOCUMENTS: {
    text: 'documentsMisc:heading',
    url: `/models/${modelID}/collaboration-area/documents`
  },
  CR_TDLS: {
    text: 'crtdlsMisc:heading',
    url: `/models/${modelID}}/collaboration-area/cr-tdls`
  },
  STATUS: {
    text: 'modelPlanMisc:headingStatus',
    url: `/models/${modelID}}/collaboration-area/status`
  }
});

// Last item in the array can be a custom text string, so we need to check if it's a common item or not
const Breadcrumbs = ({ items, customItem, className }: BreadcrumbsProps) => {
  const { t } = useTranslation();

  const { modelID } = useParams<{
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
