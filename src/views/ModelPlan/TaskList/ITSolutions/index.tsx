import React, { createContext, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { NotFoundPartial } from 'views/NotFound';

import AddCustomSolution from './AddCustomSolution';
import AddOrUpdateOperationalNeed from './AddOrUpdateOperationalNeed';
import AddSolution from './AddSolution';
import ITSolutionsHome from './Home';
import SelectSolutions from './SelectSolutions';
import SolutionDetails from './SolutionDetails';
import SolutionImplementation from './SolutionImplementation';

export const ITSolutionsModalContext = createContext({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => {}
});

const ITSolutions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MainContent data-testid="it-solutions">
      <ITSolutionsModalContext.Provider
        value={{
          isModalOpen,
          setIsModalOpen
        }}
      >
        <GridContainer>
          <Grid desktop={{ col: 12 }}>
            <Switch>
              <Route path="/models/:modelID/task-list/it-solutions" exact>
                <ITSolutionsHome />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/add-an-operational-need"
                exact
              >
                <AddOrUpdateOperationalNeed />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/update-need/:operationalNeedID?"
                exact
              >
                <AddOrUpdateOperationalNeed />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions"
                exact
              >
                <SelectSolutions />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/update-solutions"
                exact
              >
                <SelectSolutions update />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-solution/:operationalSolutionID?"
                exact
              >
                <AddSolution />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/add-custom-solution/:operationalSolutionID?"
                exact
              >
                <AddCustomSolution />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details"
                exact
              >
                <SolutionImplementation />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/update-status/:solutionId?"
                exact
              >
                <SolutionImplementation isUpdatingStatus />
              </Route>

              <Route
                path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/solution-details"
                exact
              >
                <SolutionDetails />
              </Route>

              <Route path="*" render={() => <NotFoundPartial />} />
            </Switch>
          </Grid>
        </GridContainer>
      </ITSolutionsModalContext.Provider>
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-y-0">
          <h1>hello world</h1>
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">
          <p>Lorem ipsum dolor sit.</p>
        </p>
        <Button
          type="button"
          className="margin-right-4 bg-error"
          // onClick={() => archiveModelPlan()}
        >
          Confirm
        </Button>
        <Button type="button" unstyled onClick={() => setIsModalOpen(false)}>
          cancel
        </Button>
      </Modal>
    </MainContent>
  );
};

export default ITSolutions;
