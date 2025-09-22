import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Button,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  useCreateMtoMilestoneNoteMutation,
  useUpdateMtoMilestoneNoteMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import TextAreaField from 'components/TextAreaField';
import toastSuccess from 'components/ToastSuccess';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { MilestoneNoteType } from '../EditMilestoneForm';

const MilestoneNoteForm = ({
  mtoMilestoneID,
  milestoneNotes,
  setMilestoneNotes,
  closeModal,
  selectedMilestoneNote,
  readView = false
}: {
  mtoMilestoneID: string;
  milestoneNotes: MilestoneNoteType[];
  setMilestoneNotes: (notes: MilestoneNoteType[]) => void;
  selectedMilestoneNote: MilestoneNoteType | null;
  closeModal: () => void;
  readView?: boolean;
}) => {
  const { t: mtoMilestoneNoteMiscT } = useTranslation('mtoMilestoneNoteMisc');

  const { euaId } = useSelector((state: AppState) => state.auth);

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [milestoneNote, setMilestoneNote] = useState<string>(
    selectedMilestoneNote?.content || ''
  );

  const isEditing = useMemo(() => {
    return !!selectedMilestoneNote;
  }, [selectedMilestoneNote]);

  const [addMilestoneNote] = useCreateMtoMilestoneNoteMutation();

  const [updateMilestoneNote] = useUpdateMtoMilestoneNoteMutation();

  // Submit handler when adding a new note in the read view/not MTO matrix
  const handleAddMilestoneNote = useCallback(() => {
    if (!isEditing) {
      addMilestoneNote({
        variables: {
          input: {
            mtoMilestoneID,
            content: milestoneNote
          }
        }
      }).then(() => {
        toastSuccess(mtoMilestoneNoteMiscT('noteAdded'));
      });
    } else {
      updateMilestoneNote({
        variables: {
          input: {
            id: selectedMilestoneNote?.id || '',
            content: milestoneNote
          }
        }
      }).then(() => {
        toastSuccess(mtoMilestoneNoteMiscT('noteUpdated'));
      });
    }
  }, [
    isEditing,
    mtoMilestoneID,
    addMilestoneNote,
    updateMilestoneNote,
    mtoMilestoneNoteMiscT,
    milestoneNote,
    selectedMilestoneNote
  ]);

  // Submit handler when editing from the milestone form in the MTO matrix/not read view
  const editMilestoneSubmit = () => {
    if (isEditing) {
      setMilestoneNotes(
        milestoneNotes.map(note =>
          note.content === selectedMilestoneNote?.content &&
          note.id === selectedMilestoneNote?.id
            ? {
                ...note,
                content: milestoneNote
              }
            : note
        )
      );
    } else {
      setMilestoneNotes([
        ...milestoneNotes,
        // Dummy data to add a new note in app memory
        {
          __typename: 'MTOMilestoneNote',
          id: '',
          content: milestoneNote,
          createdDts: new Date().toISOString(),
          createdByUserAccount: {
            __typename: 'UserAccount',
            id: euaId,
            commonName: euaId,
            isEUAID: true
          }
        }
      ]);
    }
  };

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
            {isEditing
              ? mtoMilestoneNoteMiscT('editMilestoneNote')
              : mtoMilestoneNoteMiscT('addAMilestoneNote')}
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
                disabled={!milestoneNote}
                onClick={() => {
                  if (readView) {
                    handleAddMilestoneNote();
                  } else {
                    editMilestoneSubmit();
                  }
                  closeModal();
                }}
                className="margin-right-3"
              >
                {isEditing
                  ? mtoMilestoneNoteMiscT('saveChanges')
                  : mtoMilestoneNoteMiscT('addNote')}
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
