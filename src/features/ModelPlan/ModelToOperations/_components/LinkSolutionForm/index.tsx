import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { GetMtoMilestoneQuery } from 'gql/generated/graphql';

import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';

import '../../index.scss';

type LinkSolutionFormProps = {
  milestone: GetMtoMilestoneQuery['mtoMilestone'];
  closeModal: Dispatch<SetStateAction<boolean>>;
};

const LinkSolutionForm = ({ milestone, closeModal }: LinkSolutionFormProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  console.log('hit');

  const { errorMessageInModal, clearMessage } = useMessage();

  const history = useHistory();

  // Map the common solutions to the FE help solutions
  const mappedSolutions = milestone.solutions
    .filter(solution => !!solution.commonSolution)
    .map(solution => {
      return helpSolutions.find(s => s.enum === solution.commonSolution?.key);
    });

  return (
    <GridContainer className="padding-8">
      <Grid row>
        <Grid col={12}>
          {mappedSolutions.map(solution =>
            solution ? (
              <SolutionCard key={solution.key} solution={solution} />
            ) : null
          )}
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export const SolutionCard = ({
  solution,
  className
}: {
  solution: HelpSolutionBaseType;
  className?: string;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  // Set the solution route params
  params.set('solution', solution.route);
  params.set('section', 'about');

  const { prevPathname, selectedSolution, renderModal } = useModalSolutionState(
    solution.enum
  );

  return (
    <Grid desktop={{ col: 9 }} className="display-flex">
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={() => {
            params.delete('solution');
            params.delete('section');
            return `${history.location.pathname}?${params.toString()}`;
          }}
        />
      )}

      <Card
        className={classNames('width-full', className)}
        containerProps={{
          className: classNames(
            'padding-3 flex-justify radius-md shadow-2 margin-0'
          )
        }}
      >
        <p className="margin-top-0 margin-bottom-05 text-base-dark">
          {solution?.type}
        </p>

        <h3 className="margin-0">{solution?.name}</h3>

        {solution?.acronym && (
          <p className="margin-top-0">{solution?.acronym}</p>
        )}

        <div className="border-top border-base-light padding-top-2">
          <Button
            type="button"
            unstyled
            onClick={() => history.push({ search: params.toString() })}
          >
            {t('milestoneLibrary.aboutSolution')}
          </Button>
        </div>
      </Card>
    </Grid>
  );
};

export default LinkSolutionForm;
