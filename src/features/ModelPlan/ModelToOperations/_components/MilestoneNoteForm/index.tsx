import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import TextAreaField from 'components/TextAreaField';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

const MilestoneNoteForm = ({
  milestoneNote,
  setMilestoneNote,
  closeModal
}: {
  milestoneNote: string;
  setMilestoneNote: (note: string) => void;
  closeModal: () => void;
}) => {
  const { t: mtoMilestoneNoteMiscT } = useTranslation('mtoMilestoneNoteMisc');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  return (
    <GridContainer
      className={classNames(
        {
          'padding-x-8': !isTablet,
          'padding-x-4': isTablet
        },
        'padding-top-2'
      )}
    >
      <Grid row>
        <Grid col={10}>
          <h3 className="margin-bottom-2">
            {mtoMilestoneNoteMiscT('addAMilestoneNote')}
          </h3>

          <Form onSubmit={() => {}} className="maxw-none">
            <FormGroup>
              <Label htmlFor="note" className="text-normal">
                {mtoMilestoneNoteMiscT('note')}
              </Label>

              <TextAreaField
                id="note"
                name="note"
                className="height-card"
                onBlur={() => {}}
                onChange={e => {
                  setMilestoneNote(e.target.value);
                }}
                value={milestoneNote}
              />
            </FormGroup>

            <div className="display-flex">
              <Button
                type="submit"
                onClick={() => {
                  closeModal();
                }}
                className="margin-right-3"
              >
                {mtoMilestoneNoteMiscT('addNote')}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setMilestoneNote('');
                  closeModal();
                }}
                className="usa-button usa-button--unstyled"
              >
                {mtoMilestoneNoteMiscT('cancel')}
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default MilestoneNoteForm;
