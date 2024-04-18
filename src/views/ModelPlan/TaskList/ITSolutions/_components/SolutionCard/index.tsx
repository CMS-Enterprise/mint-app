/*
SolutionCard component for rendering custom solution details
Contains links to edit solution details or remove details
*/

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardGroup, Grid, Icon, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetOperationalSolutionQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import Spinner from 'components/Spinner';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { OperationalSolutionKey } from 'types/graphql-global-types';
import SolutionDetailsModal from 'views/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';

import { findSolutionByKey } from '../CheckboxCard';

import './index.scss';

type OperationalNeedSolutionsType = GetOperationalSolutionQuery['operationalSolution'];

export type SolutionCardType = Omit<
  OperationalNeedSolutionsType,
  | 'mustStartDts'
  | 'mustFinishDts'
  | 'status'
  | 'operationalSolutionSubtasks'
  | 'documents'
>;

type SolutionCardProps = {
  className?: string;
  shadow?: boolean;
  solution: SolutionCardType;
  addingCustom?: boolean; // Used to render additional card actions/links when adding a custom solution
  renderSolutionCardLinks?: boolean;
};

const SolutionCard = ({
  className,
  shadow,
  solution,
  addingCustom,
  renderSolutionCardLinks = true
}: SolutionCardProps) => {
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const location = useLocation();

  const [initLocation] = useState<string>(location.pathname);

  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('generalReadOnly');

  const { key: keyConfig } = usePlanTranslation('solutions');

  const {
    prevPathname,
    selectedSolution,
    renderModal,
    loading: modalLoading
  } = useModalSolutionState(solution.key!);

  const { helpSolutions, loading } = useHelpSolution();

  const solutionMap = findSolutionByKey(solution.key!, helpSolutions);

  const detailRoute = solutionMap?.route
    ? `${initLocation}${location.search}${
        location.search ? '&' : '?'
      }solution=${solutionMap?.route || ''}&section=about`
    : `${initLocation}${location.search}`;

  const treatAsOtherSolutions = [
    OperationalSolutionKey.CONTRACTOR,
    OperationalSolutionKey.CROSS_MODEL_CONTRACT,
    OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS,
    OperationalSolutionKey.INTERNAL_STAFF
  ];

  if (loading || modalLoading) {
    return <Spinner size="large" center />;
  }

  return (
    <>
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={initLocation}
        />
      )}

      <CardGroup className="flex-column flex-no-wrap">
        <Card className={classNames('solution-card', { shadow }, className)}>
          <div className="padding-3">
            {solution.key && treatAsOtherSolutions.includes(solution.key) && (
              <>
                {solution.otherHeader ? (
                  <>
                    <h3 className="margin-y-0 solutions-checkbox__header">
                      {solution.otherHeader}
                    </h3>
                    <h5 className="text-normal margin-top-0 margin-bottom-2">
                      {keyConfig.options[solution.key]}
                    </h5>
                  </>
                ) : (
                  <h3
                    className={classNames(
                      'margin-top-0 solutions-checkbox__header',
                      {
                        'margin-bottom-1': solutionMap?.acronym,
                        'margin-bottom-2': !solutionMap?.acronym
                      }
                    )}
                  >
                    {solution.nameOther ||
                      (solutionMap ? solutionMap.name : solution.name)}
                  </h3>
                )}
              </>
            )}

            {(!solution.key ||
              !treatAsOtherSolutions.includes(solution.key)) && (
              <>
                <h3
                  className={classNames(
                    'margin-top-0 solutions-checkbox__header',
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

            {solutionMap?.pointsOfContact?.[0].name ? (
              <Grid
                tablet={{ col: 6 }}
                className={classNames({ 'margin-bottom-2': solution.name })}
              >
                <p className="text-bold margin-bottom-0">{t('contact')}</p>

                <p className="margin-y-0">
                  {solutionMap?.pointsOfContact[0].name}
                </p>

                <Link
                  aria-label={h('contactInfo.sendAnEmail')}
                  className="line-height-body-5 display-flex flex-align-center"
                  href={`mailto:${solutionMap?.pointsOfContact[0].email}`}
                  target="_blank"
                >
                  <div>{solutionMap?.pointsOfContact[0].email}</div>
                  <Icon.MailOutline className="margin-left-05 text-tbottom" />
                </Link>
              </Grid>
            ) : (
              <Grid
                tablet={{ col: 6 }}
                className={classNames({ 'margin-bottom-2': solution.name })}
              >
                {(solution.pocName || solution.pocEmail) && (
                  <p className="text-bold margin-bottom-0">{t('contact')}</p>
                )}

                <p className="margin-y-0">{solution.pocName}</p>

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

            {/* Show 'About Details' link if not updating solution details and not a custom solution */}
            {renderSolutionCardLinks &&
              solution.name &&
              !solution.otherHeader &&
              !solution.isOther && (
                <>
                  <Divider />

                  <UswdsReactLink
                    className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2"
                    to={detailRoute}
                  >
                    {t('aboutSolution')}
                    <Icon.ArrowForward className="margin-left-1" />
                  </UswdsReactLink>
                </>
              )}

            {/* Renders links to either update solution details or remove solution details */}
            {(addingCustom ||
              !solution.name ||
              solution.otherHeader ||
              solution.isOther) && (
              <>
                {!addingCustom && <Divider className="margin-top-2" />}
                <div
                  className="display-flex margin-top-2"
                  data-testid="custom-solution-card"
                >
                  <UswdsReactLink
                    className="margin-right-2 display-flex flex-align-center"
                    to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${
                      solution.id
                    }?selectedSolution=${
                      solution.key || OperationalSolutionKey.OTHER_NEW_PROCESS
                    }`}
                  >
                    {t('updateTheseDetails')}
                    {!addingCustom && (
                      <Icon.ArrowForward className="margin-left-1" />
                    )}
                  </UswdsReactLink>

                  {addingCustom && (solution.pocName || solution.pocEmail) && (
                    <UswdsReactLink
                      className="text-red"
                      to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${
                        solution.id
                      }?selectedSolution=${
                        solution.key || OperationalSolutionKey.OTHER_NEW_PROCESS
                      }`}
                    >
                      {t('removeTheseDetails')}
                    </UswdsReactLink>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </CardGroup>
    </>
  );
};

export default SolutionCard;
