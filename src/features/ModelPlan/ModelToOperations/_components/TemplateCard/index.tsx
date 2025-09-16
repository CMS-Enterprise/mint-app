import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetMtoTemplatesQuery } from 'gql/generated/graphql';

import { MTOModalContext } from 'contexts/MTOModalContext';

import '../../index.scss';

export type TemplateCardType = GetMtoTemplatesQuery['mtoTemplates'][0];

const TemplateCard = ({
  className,
  template
}: {
  className?: string;
  template: TemplateCardType;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const navigate = useNavigate();

  const { setMTOModalState, setMTOModalOpen } = useContext(MTOModalContext);

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
              {t('templateLibrary.template')}
            </span>
          </div>

          <h3 className="line-height-normal margin-top-1">{template.name}</h3>
        </CardHeader>

        <CardBody className="padding-x-3 ">
          <div className="text-base-dark">
            {t('templateLibrary.templateCount', {
              categoryCount: template.categoryCount,
              milestoneCount: template.milestoneCount,
              solutionCount: template.solutionCount
            })}
          </div>

          <p>{template.description}</p>
        </CardBody>

        <CardFooter className="padding-3">
          <Button
            type="button"
            outline
            className="margin-right-2"
            onClick={() => {
              setMTOModalState({
                modalType: 'addTemplate',
                mtoTemplate: template
              });
              setMTOModalOpen(true);
            }}
          >
            {t('templateLibrary.addToMatrix')}
          </Button>

          <Button
            unstyled
            type="button"
            className="margin-top-2"
            onClick={() => {
              params.set('template', template.key);
              navigate({ search: params.toString() });
            }}
          >
            {t('templateLibrary.aboutThisTemplate')}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default TemplateCard;
