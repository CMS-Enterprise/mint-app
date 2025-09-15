import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';
import { MTOModalContext, MtoTemplateType } from 'contexts/MTOModalContext';

import '../../index.scss';

const TemplatePanel = ({
  template,
  closeModal
}: {
  template: MtoTemplateType;
  closeModal: () => void;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { setMTOModalState, setMTOModalOpen } = useContext(MTOModalContext);

  return (
    <GridContainer className="padding-4 padding-x-8 mint-body-normal">
      <Grid row>
        <Grid col={12}>
          <h2 className="margin-y-2 line-height-large">{template.name}</h2>

          <div className="text-base-dark">
            {t('templateLibrary.templateCount', {
              categoryCount: template.categoryCount,
              milestoneCount: template.milestoneCount,
              solutionCount: template.solutionCount
            })}
          </div>

          <p className="margin-y-4" style={{ whiteSpace: 'pre-line' }}>
            {template.description}
          </p>

          <div className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
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
          </div>

          <h3 className="margin-y-2">{t('templateLibrary.templateContent')}</h3>

          <p className="margin-y-2" style={{ whiteSpace: 'pre-line' }}>
            {t('templateLibrary.contentDetails')}
          </p>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default TemplatePanel;
