import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetMtoTemplatesQuery } from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import AddSolutionToMilestoneForm from '../AddCommonMilestoneForm';

import '../../index.scss';

export type TemplateCardType = GetMtoTemplatesQuery['mtoTemplates'][0];

const TemplateCard = ({
  className,
  template,
  setIsSidepanelOpen
}: {
  className?: string;
  template: TemplateCardType;
  setIsSidepanelOpen: (isOpen: boolean) => void;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const templateParam = params.get('add-template');

  const [isModalOpen, setIsModalOpen] = useState(templateParam === template.id);

  useEffect(() => {
    if (templateParam === template.id) {
      setIsModalOpen(true);
    }
  }, [templateParam, template.id, setIsModalOpen]);

  return (
    <>
      {/* <Modal
        isOpen={isModalOpen}
        closeModal={() => {
          params.delete('add-template', template.id);
          navigate({ search: params.toString() }, { replace: true });
          setIsModalOpen(false);
        }}
        fixed
        className="tablet:width-mobile-lg mint-body-normal"
      >
        <div className="margin-bottom-2">
          <PageHeading headingLevel="h3" className="margin-y-0">
            {t('modal.solutionToMilestone.title')}
          </PageHeading>
        </div>

        <AddSolutionToMilestoneForm
          closeModal={() => {
            params.delete('add-template', template.id);
            navigate({ search: params.toString() }, { replace: true });
            setIsModalOpen(false);
          }}
          template={template}
        />
      </Modal> */}

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
            disabled
            className="margin-right-2 model-to-operations__milestone-added text-normal"
          >
            <Icon.Check aria-label="check" />
            {t('templateLibrary.added')}
          </Button>

          <Button
            unstyled
            type="button"
            className="margin-top-2"
            onClick={() => {
              setIsSidepanelOpen(true);
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
