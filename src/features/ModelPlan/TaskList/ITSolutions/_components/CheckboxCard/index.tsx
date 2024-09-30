/*
CheckboxCard component for selecting needed Operational Solutions
Integrated with Formik
*/

import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  Grid,
  Icon,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { Field } from 'formik';
import {
  GetOperationalNeedQuery,
  OperationalSolutionKey
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePlanTranslation from 'hooks/usePlanTranslation';

import './index.scss';

type GetOperationalNeedSolutionsType = GetOperationalNeedQuery['operationalNeed']['solutions'][0];

type CheckboxCardProps = {
  className?: string;
  disabled?: boolean;
  solution: GetOperationalNeedSolutionsType;
  index: number;
};

export const treatAsOtherSolutions = [
  OperationalSolutionKey.CONTRACTOR,
  OperationalSolutionKey.CROSS_MODEL_CONTRACT,
  OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS,
  OperationalSolutionKey.INTERNAL_STAFF,
  OperationalSolutionKey.OTHER_NEW_PROCESS
];

const CheckboxCard = ({
  className,
  disabled,
  solution,
  index
}: CheckboxCardProps) => {
  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('generalReadOnly');

  const { key: keyConfig } = usePlanTranslation('solutions');

  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const history = useHistory();

  const location = useLocation();

  const [initLocation] = useState<string>(location.pathname);

  const {
    prevPathname,
    selectedSolution,
    renderModal,
    loading: modalLoading
  } = useModalSolutionState(solution.key!);

  const { helpSolutions, loading } = useHelpSolution();

  // If custom solution, nameOther becoming the identifier
  const id = solution?.nameOther
    ? `it-solutions-${solution?.nameOther?.toLowerCase().replaceAll(' ', '-')}`
    : `it-solutions-${solution?.key?.toLowerCase().replace('_', '-')}`;

  const solutionMap = findSolutionByKey(solution.key!, helpSolutions);

  const primaryContact = solutionMap?.pointsOfContact?.find(
    contact => contact.isPrimary
  );

  const detailRoute = solutionMap?.route
    ? `${initLocation}${location.search}${
        location.search ? '&' : '?'
      }solution=${solutionMap?.route || ''}&section=about`
    : `${initLocation}${location.search}`;

  const isDefaultSolutionOptions =
    (solution.name !== null && solution.pocEmail === null) ||
    (solution.name !== null && solution.isOther);

  const solutionParam = solution.key ? `?selectedSolution=${solution.key}` : '';

  if (loading || modalLoading) {
    return <Spinner />;
  }

  const renderCTALink = () => {
    if (isDefaultSolutionOptions && solution.isOther) {
      return (
        <Button
          type="button"
          className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2 margin-bottom-0"
          onClick={() =>
            history.push(
              `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${
                solution.id !== '00000000-0000-0000-0000-000000000000'
                  ? solution.id
                  : ''
              }${solutionParam}`
            )
          }
        >
          {!solution.pocName &&
          !solution.pocEmail &&
          !solution.otherHeader &&
          solution.isOther
            ? t('addDetails')
            : t('updateTheseDetails')}
          <Icon.ArrowForward className="margin-left-1" />
        </Button>
      );
    }

    if (solution.nameOther || solution.otherHeader) {
      return (
        <Button
          type="button"
          className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2 margin-bottom-0"
          onClick={() =>
            history.push(
              `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}${solutionParam}`
            )
          }
        >
          {t('updateTheseDetails')}
          <Icon.ArrowForward className="margin-left-1" />
        </Button>
      );
    }

    return (
      <UswdsReactLink
        className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2"
        to={detailRoute}
      >
        {t('aboutSolution')}
        <Icon.ArrowForward className="margin-left-1" />
      </UswdsReactLink>
    );
  };

  return (
    <Grid tablet={{ col: 6 }} desktop={{ col: 4 }} className="display-flex">
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={`/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions`}
        />
      )}

      <Card
        className={classNames('width-full', className)}
        containerProps={{
          className: classNames('padding-3 flex-justify', {
            'solutions-checkbox__checked': !!solution.needed
          })
        }}
      >
        <div className="solutions-checkbox__above-the-border">
          <div className="solutions-checkbox__header">
            <Field
              as={Checkbox}
              disabled={disabled}
              id={`${id}-${solution.id}`}
              name={`solutions[${index}].needed`}
              label={t('selectSolution')}
              value={!!solution.needed}
              checked={!!solution.needed}
              className="margin-y-0"
            />

            {/* If solution is one of the treatAsOther, then render the following  */}
            {solution.key && treatAsOtherSolutions.includes(solution.key) && (
              <>
                {solution.otherHeader ? (
                  <>
                    <h3 className="margin-top-2 margin-bottom-0 solutions-checkbox__header">
                      {solution.otherHeader}
                    </h3>
                    <h5 className="text-normal margin-top-0 margin-bottom-2">
                      {solution.key === OperationalSolutionKey.OTHER_NEW_PROCESS
                        ? t('otherNewProcess')
                        : keyConfig.options[solution.key]}
                    </h5>
                  </>
                ) : (
                  <h3 className="margin-y-2 solutions-checkbox__header">
                    {solution.nameOther || solution.name}
                  </h3>
                )}
              </>
            )}

            {/* If solution key is not one of the treatAsOther, then render its name/nameOther */}
            {/* If solution is custom (aka solution key is null), then render its name/nameOther */}
            {(!solution.key ||
              !treatAsOtherSolutions.includes(solution.key)) && (
              <>
                <h3
                  className={classNames(
                    'margin-top-2 solutions-checkbox__header',
                    {
                      'margin-bottom-1': solutionMap?.acronym,
                      'margin-bottom-2': !solutionMap?.acronym
                    }
                  )}
                >
                  {solution.nameOther ||
                    (solutionMap ? solutionMap.name : solution.name)}
                </h3>
                {solutionMap?.acronym && (
                  <h5 className="margin-top-0 margin-bottom-2 text-normal">
                    ({solutionMap.acronym})
                  </h5>
                )}
              </>
            )}
          </div>

          {(!solution.isOther || isDefaultSolutionOptions) && (
            <div className="margin-bottom-2 solutions-checkbox__body-text">
              {solutionMap && (
                <Trans
                  i18nKey={`helpAndKnowledge:solutions.${solutionMap.key}.about.description`}
                  components={{
                    link1: <span />
                  }}
                />
              )}
            </div>
          )}

          {primaryContact ? (
            <Grid
              tablet={{ col: 12 }}
              className={classNames({ 'margin-bottom-2': solution.name })}
            >
              <p className="text-bold margin-bottom-0">{t('contact')}</p>

              <p className="margin-y-0">{primaryContact.name}</p>

              <Link
                aria-label={h('contactInfo.sendAnEmail')}
                className="line-height-body-5 display-flex flex-align-center"
                href={`mailto:${primaryContact.email}`}
                target="_blank"
              >
                <div>{primaryContact.email}</div>
              </Link>
            </Grid>
          ) : (
            <Grid
              tablet={{ col: 12 }}
              className={classNames('margin-bottom-2')}
            >
              {(solution.pocName || solution.pocEmail) && (
                <p className="text-bold margin-bottom-0">{t('contact')}</p>
              )}

              {solution.pocName && (
                <p className="margin-y-0">{solution.pocName}</p>
              )}

              {solution.pocEmail && (
                <Link
                  aria-label={h('contactInfo.sendAnEmail')}
                  className="line-height-body-5 display-flex flex-align-center"
                  href={`mailto:${solution.pocEmail}`}
                  target="_blank"
                >
                  <div>{solution.pocEmail}</div>
                  <Icon.MailOutline className="margin-left-05 text-tbottom" />
                </Link>
              )}
            </Grid>
          )}
        </div>

        <div className="border-top border-base-light">{renderCTALink()}</div>
      </Card>
    </Grid>
  );
};

export const findSolutionByKey = (
  key: OperationalSolutionKey | null,
  solutions: HelpSolutionType[]
): HelpSolutionType | undefined => {
  if (!key) return undefined;
  return [...solutions].find(solution => solution.enum === key);
};

export default CheckboxCard;
