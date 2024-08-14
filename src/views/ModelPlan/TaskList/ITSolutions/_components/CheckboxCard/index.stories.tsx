import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { Formik } from 'formik';
import {
  GetOperationalNeedQuery,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/gen/graphql';

import { initialValues } from '../../SelectSolutions';

import CheckboxCard from '.';

type GetOperationalNeedSolutionsType = GetOperationalNeedQuery['operationalNeed']['solutions'][0];
export default {
  title: 'Operational Need Checkbox Card',
  component: CheckboxCard,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          '/models/602287ff-d9d5-4203-86eb-e168fbd47242/collaboration-area/task-list/it-solutions/f92a8a35-86de-4e03-a81a-bd8bec2e30e3/select-solutions'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof CheckboxCard>;

const solution: GetOperationalNeedSolutionsType = {
  __typename: 'OperationalSolution' as const,
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
  key: OperationalSolutionKey.RMADA,
  mustStartDts: null,
  mustFinishDts: null,
  status: OpSolutionStatus.IN_PROGRESS,
  isCommonSolution: true,
  needed: true,
  pocName: 'John Doe',
  pocEmail: '',
  nameOther: null,
  isOther: false,
  otherHeader: null
};

export const Default = () => (
  // @ts-ignore
  <Formik initialValues={initialValues} onSubmit={() => null}>
    <CheckboxCard solution={solution} index={0} />
  </Formik>
);
