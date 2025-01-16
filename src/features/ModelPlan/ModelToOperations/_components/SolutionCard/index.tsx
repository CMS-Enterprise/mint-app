import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Card, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { HelpSolutionBaseType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import CheckboxField from 'components/CheckboxField';
import useModalSolutionState from 'hooks/useModalSolutionState';

import '../../index.scss';

export const SolutionCard = ({
  solution,
  setChecked,
  checked,
  className
}: {
  solution: HelpSolutionBaseType;
  setChecked?: (key: MtoCommonSolutionKey) => void;
  checked?: boolean;
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
          className: classNames('padding-3 flex-justify radius-md margin-0', {
            'model-to-operations__selected-shadow': !!checked,
            'shadow-2': !checked
          })
        }}
      >
        {setChecked ? (
          <CheckboxField
            id={solution.key}
            name={solution.key}
            label={t('modal.editMilestone.selectThisSolution')}
            value={solution.key}
            checked={checked}
            onBlur={() => null}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setChecked(solution.enum as MtoCommonSolutionKey);
            }}
          />
        ) : (
          <p className="margin-top-0 margin-bottom-05 text-base-dark">
            {solution?.type}
          </p>
        )}

        <h3 className="margin-0">{solution?.name}</h3>

        {solution?.acronym && (
          <p
            className={classNames('margin-top-0', {
              'margin-bottom-0': setChecked
            })}
          >
            {solution?.acronym}
          </p>
        )}

        {!setChecked && (
          <div className="border-top border-base-light padding-top-2">
            <Button
              type="button"
              unstyled
              onClick={() => history.push({ search: params.toString() })}
            >
              {t('milestoneLibrary.aboutSolution')}
            </Button>
          </div>
        )}
      </Card>
    </Grid>
  );
};

export default SolutionCard;
