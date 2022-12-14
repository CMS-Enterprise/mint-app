import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

// TODO: Once subtasks are added to BE, replace this any enum with gql generated enum
export enum SubtaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

// TODO: Once subtasks are added to BE, replace this any type with gql generated type
type SubtaskType = {
  name: string;
  status: SubtaskStatus;
};

type SubtasksProps = {
  subtasks: SubtaskType[];
  className?: string;
};

// Returns ul list component with subtask name
const filterSubtasks = (subtasks: SubtaskType[], status: SubtaskStatus) => (
  <ul>
    {subtasks
      .filter((subtask: SubtaskType) => subtask.status === status)
      .map((subtask: SubtaskType) => (
        <li key={subtask.name} className="margin-y-1">
          {subtask.name}
        </li>
      ))}
  </ul>
);

type SubtaskLinksType = {
  [key: string]: string;
  addSubtasks: 'add-subtasks';
  manageSubtasks: 'manage-subtasks';
};

// Addtional links beneath subtask table for adding and managing subtasks
export const SubtaskLinks = ({ className }: { className?: string }) => {
  const { t } = useTranslation('itSolutions');
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const history = useHistory();

  const subtaskLinks: SubtaskLinksType = {
    addSubtasks: 'add-subtasks',
    manageSubtasks: 'manage-subtasks'
  };

  return (
    <div className={classNames(className, 'display-flex')}>
      {Object.keys(subtaskLinks).map(link => (
        <Button
          key={link}
          type="button"
          id={subtaskLinks[link]}
          className="usa-button usa-button--outline"
          onClick={() => {
            history.push(
              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${subtaskLinks[link]}`
            );
          }}
        >
          {t(`subtasks.${link}`)}
        </Button>
      ))}
    </div>
  );
};

const Subtasks = ({ subtasks, className }: SubtasksProps) => {
  const { t } = useTranslation('itSolutions');

  const todoSubtasks = filterSubtasks(subtasks, SubtaskStatus.TO_DO);
  const inProgressSubtasks = filterSubtasks(
    subtasks,
    SubtaskStatus.IN_PROGRESS
  );
  const doneSubtasks = filterSubtasks(subtasks, SubtaskStatus.DONE);

  return (
    <div className={classNames(className)}>
      <h3 className="margin-top-0">{t('subtasks.header')}</h3>

      <GridContainer className="padding-0">
        <Grid row className="border">
          {/* TO_DO Subtasks */}
          <Grid desktop={{ col: 4 }} className="border-right">
            <div>
              <div className="border-bottom">
                <p className="text-bold padding-x-1 margin-y-105">
                  {t('subtasks.todo')}
                </p>
              </div>

              <div className="border-top">
                {subtasks.length === 0 ? (
                  <div className="padding-x-1 margin-y-105">
                    {t('subtasks.noSubtasks')}
                  </div>
                ) : (
                  todoSubtasks
                )}
              </div>
            </div>
          </Grid>

          {/* IN_PROGRESS Subtasks */}
          <Grid desktop={{ col: 4 }} className="border-right">
            <div>
              <div className="border-bottom">
                <p className="text-bold padding-x-1 margin-y-105">
                  {t('subtasks.inProgress')}
                </p>
              </div>
              <div className="border-top">{inProgressSubtasks}</div>
            </div>
          </Grid>

          {/* DONE Subtasks */}
          <Grid desktop={{ col: 4 }}>
            <div>
              <div className="border-bottom">
                <p className="text-bold padding-x-1 margin-y-105">
                  {t('subtasks.done')}
                </p>
              </div>
              <div className="border-top">{doneSubtasks}</div>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default Subtasks;
