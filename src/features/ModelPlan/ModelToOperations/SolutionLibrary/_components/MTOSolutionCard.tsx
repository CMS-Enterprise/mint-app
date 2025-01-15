import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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

// import useMessage from 'hooks/useMessage';
import { SolutionCardType } from '..';

const MTOSolutionCard = ({
  className,
  solution
}: {
  className?: string;
  solution: SolutionCardType;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');
  // const { errorMessageInModal, clearMessage } = useMessage();
  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  // const milestoneParam = params.get('add-milestone');

  const mappedSolution = helpSolutions.find(s => s.enum === solution.key);

  // const splitOnParatheses = (input: string) => {
  //   if (input.includes('(')) {
  //     const [beforeParen, insideParen] = input.split('(');
  //     return {
  //       main: beforeParen.trim(), // Everything before the '('
  //       additional: insideParen.replace(')', '').trim() // Everything inside the '()', without the ')'
  //     };
  //   }

  //   // If no parentheses, return the whole string as `main`
  //   return {
  //     main: input.trim(),
  //     additional: null
  //   };
  // };
  // const solutionName = splitOnParatheses(solution.name).main;
  // const solutionAcronym = splitOnParatheses(solution.name).additional;

  return (
    <>
      <Card
        containerProps={{
          className: 'radius-md minh-mobile padding-0 margin-0'
        }}
        className={classNames(className, 'margin-bottom-2')}
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

        <CardFooter className="padding-3">
          {!solution.isAdded ? (
            <Button
              type="button"
              outline
              className="margin-right-2"
              onClick={() => {
                params.delete('milestone');
                params.set('add-solution', solution.key);
                history.replace({ search: params.toString() });
                // TODO: to open "Add to existing milestone" modal
                // setIsModalOpen(true);
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

          {/* //TODO: to add to solution info sidepanel */}
          <Button
            unstyled
            type="button"
            className="margin-top-2"
            onClick={() => {
              // setIsSidepanelOpen(true);
              params.set('solution', solution.key);
              history.push({ search: params.toString() });
            }}
          >
            {t('solutionLibrary.aboutThisSolution')}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default MTOSolutionCard;
