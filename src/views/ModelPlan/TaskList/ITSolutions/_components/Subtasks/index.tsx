import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

// TODO: Once subtasks are added to BE, replace this any enum with gql generated enum
enum SubtaskStatus {
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

const filterSubtasks = (subtasks: SubtaskType[], status: any) =>
  subtasks
    .filter((subtask: any) => subtask.status === status)
    .map((subtask: any) => subtask.name);

const Subtasks = ({ subtasks, className }: SubtasksProps) => {
  const { t } = useTranslation('itSolutions');

  const todoSubtasks = filterSubtasks(subtasks, 'TO_DO');
  //   const inProgressSubtasks = filterSubtasks(subtasks, 'IN_PROGRESS');
  //   const doneSubtasks = filterSubtasks(subtasks, 'DONE');

  return (
    <div className={classNames(className)}>
      <h3 className="margin-top-0">{t('subtasks.header')}</h3>

      <GridContainer className="padding-0">
        {/* Header columns */}
        <Grid row className="border ">
          <Grid desktop={{ col: 4 }} className="padding-x-1 border-right">
            <p className="text-bold">{t('subtasks.todo')}</p>
          </Grid>
          <Grid desktop={{ col: 4 }} className="padding-x-1 border-right">
            <p className="text-bold">{t('subtasks.inProgress')}</p>
          </Grid>
          <Grid desktop={{ col: 4 }} className="padding-x-1">
            <p className="text-bold">{t('subtasks.done')}</p>
          </Grid>
        </Grid>

        {/* Subtask columns */}
        <Grid row className="border ">
          <Grid desktop={{ col: 4 }} className="padding-x-1 border-right">
            <ul>
              {todoSubtasks.map(subtask => (
                <li>{subtask.name}</li>
              ))}
            </ul>
          </Grid>
          <Grid desktop={{ col: 4 }} className="padding-x-1 border-right">
            <ul>
              {todoSubtasks.map(subtask => (
                <li>{subtask.name}</li>
              ))}
            </ul>
          </Grid>
          <Grid desktop={{ col: 4 }} className="padding-x-1">
            <ul>
              {todoSubtasks.map(subtask => (
                <li>{subtask.name}</li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default Subtasks;
