import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import TaskListItem, { TaskListDescription } from './components/TaskListItem';
import TaskListSideNav from './components/TaskListSideNav';

const TaskList = () => {
  const { t } = useTranslation();
  return (
    <MainContent
      className="model-plan-task-list grid-container margin-bottom-7"
      data-testid="model-plan-task-list"
    >
      <div className="grid-row">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('taskList:navigation.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>
            {t('taskList:navigation.governanceTaskList')}
          </Breadcrumb>
        </BreadcrumbBar>
      </div>
      <div className="grid-row grid-gap-lg">
        <div className="tablet:grid-col-9">
          <PageHeading className="margin-bottom-0">
            Model plan task list
          </PageHeading>
          <p className="margin-top-0 margin-bottom-2 font-body-lg">
            for Model ABC123
          </p>
          <SummaryBox
            heading=""
            className="bg-base-lightest border-0 radius-0 padding-2"
          >
            <p className="margin-0 margin-bottom-1">
              There are no documents uploaded for Model ABC123.
            </p>
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to="/"
            >
              Upload a document
            </UswdsReactLink>
          </SummaryBox>
          <ol
            data-testid="task-list"
            className="governance-task-list__task-list governance-task-list__task-list--primary"
          >
            <TaskListItem
              testId="task-list-intake-form"
              heading="Model basics"
              status=""
            >
              <TaskListDescription>
                <p className="margin-top-0">
                  Tell the Governance Admin Team about your idea. This step lets
                  CMS build context about your request and start preparing for
                  discussions with your team.
                </p>
              </TaskListDescription>
              {/* <IntakeDraftCta intake={systemIntake} /> */}
            </TaskListItem>
          </ol>
        </div>
        <div className="tablet:grid-col-3">
          {/* <SideNavActions intake={systemIntake} archiveIntake={archiveIntake} /> */}
          <TaskListSideNav />
        </div>
      </div>
    </MainContent>
  );
};

export default TaskList;
