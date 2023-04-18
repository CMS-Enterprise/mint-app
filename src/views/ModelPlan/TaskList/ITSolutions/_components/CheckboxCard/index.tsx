/*
CheckboxCard component for selecting needed IT solutions
Integrated with Formik
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  Grid,
  IconArrowForward,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field } from 'formik';

import Divider from 'components/shared/Divider';
import { GetOperationalNeed_operationalNeed_solutions as GetOperationalNeedSolutionsType } from 'queries/ITSolutions/types/GetOperationalNeed';

import './index.scss';

type CheckboxCardProps = {
  className?: string;
  disabled?: boolean;
  solution: GetOperationalNeedSolutionsType;
  index: number;
};

const CheckboxCard = ({
  className,
  disabled,
  solution,
  index
}: CheckboxCardProps) => {
  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('generalReadOnly');
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const history = useHistory();

  // If custom solution, nameOther becoming the identifier
  const id = solution?.nameOther
    ? `it-solutions-${solution?.nameOther?.toLowerCase().replaceAll(' ', '-')}`
    : `it-solutions-${solution?.key?.toLowerCase().replace(' ', '-')}`;

  // TODO: replace with real solution data once populated
  const tempDescription: string =
    'Short summary. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore aliqa...';

  return (
    <Grid tablet={{ col: 6 }}>
      <Card className={classNames(className)}>
        <div className="solutions-checkbox__header padding-2">
          <Field
            as={Checkbox}
            disabled={disabled}
            id={id}
            testid={id}
            name={`solutions[${index}].needed`}
            label={t('selectSolution')}
            value={!!solution.needed}
            checked={!!solution.needed}
          />

          <h3 className="margin-y-2">{solution.nameOther || solution.name}</h3>

          <div className="margin-bottom-2 solutions-checkbox__body-text">
            {/* TODO: replace tempDescription with real data */}
            {tempDescription}
            {/* {solution?.description} */}
          </div>

          {solution.pocName && (
            <>
              <p className="text-bold margin-bottom-0">{t('contact')}</p>

              <p className="margin-y-0">{solution.pocName}</p>

              <Link
                aria-label={h('contactInfo.sendAnEmail')}
                className="line-height-body-5"
                href={`mailto:${solution.pocEmail}`}
                target="_blank"
              >
                <div className="margin-bottom-2">{solution.pocEmail}</div>
              </Link>
            </>
          )}

          <Divider />

          {solution.nameOther ? (
            <Button
              type="button"
              className="display-flex flex-align-center usa-button usa-button--unstyled margin-y-2"
              onClick={() =>
                history.push(
                  `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}`
                )
              }
            >
              {t('updateTheseDetails')}
              <IconArrowForward className="margin-left-1" />
            </Button>
          ) : (
            <Button
              type="button"
              className="display-flex flex-align-center usa-button usa-button--unstyled margin-y-2"
            >
              {t('aboutSolution')}
              <IconArrowForward className="margin-left-1" />
            </Button>
          )}
        </div>
      </Card>
    </Grid>
  );
};

export default CheckboxCard;
