import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionsTag from 'features/HelpAndKnowledge/SolutionsHelp/_components/SolutionsTag';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

// import useMessage from 'hooks/useMessage';
import { SolutionCardType } from '..';

import AddToExistingMilestoneForm from './AddToExistingMilestoneForm';

const MTOSolutionCard = ({
  className,
  solution
}: {
  className?: string;
  solution: SolutionCardType;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { errorMessageInModal, clearMessage } = useMessage();
  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  const solutionParam = params.get('add-solution');

  const [isModalOpen, setIsModalOpen] = useState(
    solutionParam === solution.key
  );

  const mappedSolution = helpSolutions.find(s => s.enum === solution.key);
  const location = useLocation();

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick
        closeModal={() => {
          params.delete('add-solution', solution.key);
          history.replace({ search: params.toString() });
          clearMessage();
          setIsModalOpen(false);
        }}
        className="tablet:width-mobile-lg mint-body-normal"
      >
        <div className="margin-bottom-2">
          <PageHeading headingLevel="h3" className="margin-y-0">
            {t('modal.addToExistingMilestone.title')}
          </PageHeading>
        </div>

        {errorMessageInModal}

        <AddToExistingMilestoneForm />

        {/* <AddSolutionToMilestoneForm
          closeModal={() => {
            params.delete('add-solution', solution.key);
            params.delete('solution', solution.key);
            history.replace({ search: params.toString() });
            clearMessage();
            setIsModalOpen(false);
          }}
          milestone={milestone}
        /> */}
      </Modal>
      <Card
        containerProps={{
          className: 'radius-md minh-mobile padding-0 margin-0'
        }}
        className={classNames(className, 'margin-bottom-2 padding-x-1')}
        gridLayout={{ desktop: { col: 4 }, tablet: { col: 6 }, gap: 6 }}
      >
        <CardHeader className="padding-3 padding-bottom-0">
          <div className="display-flex flex-justify">
            <span className="text-base-dark">
              {t(`solutionLibrary.${solution.type}`)}
            </span>
          </div>
          <h3 className="line-height-normal margin-y-1">
            {mappedSolution?.name}
          </h3>
          {mappedSolution?.acronym && (
            <p className="margin-y-0">{mappedSolution?.acronym}</p>
          )}
        </CardHeader>

        <CardBody className="padding-x-3 ">
          {mappedSolution?.categories.map(categoryTag => (
            <SolutionsTag
              isBold={false}
              key={categoryTag}
              category={categoryTag}
              route={categoryTag}
            />
          ))}
        </CardBody>

        <CardFooter className="padding-3 display-flex flex-wrap">
          {!solution.isAdded ? (
            <Button
              type="button"
              outline
              className="margin-right-2"
              onClick={() => {
                params.set('add-solution', solution.key);
                history.replace({ search: params.toString() });
                // TODO: to open "Add to existing milestone" modal
                setIsModalOpen(true);
              }}
            >
              {t('milestoneLibrary.addToMatrix')}
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="margin-right-2 model-to-operations__milestone-added text-normal"
            >
              <Icon.Check />
              {t('milestoneLibrary.added')}
            </Button>
          )}

          <UswdsReactLink
            className="display-block width-fit-content usa-button usa-button--unstyled margin-top-2"
            aria-label={`${t('helpAndKnowledge:aboutSolutionAriaLabel')} ${mappedSolution?.name}`}
            to={`${location.pathname}${location.search}${
              location.search ? '&' : '?'
            }solution=${mappedSolution?.route}&section=about`}
          >
            {t('solutionLibrary.aboutThisSolution')}
          </UswdsReactLink>
        </CardFooter>
      </Card>
    </>
  );
};

export default MTOSolutionCard;
