import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Form, FormGroup, Label } from '@trussworks/react-uswds';
import {
  GetMtoMilestoneDocument,
  useCreateMtoMilestoneNoteMutation,
  useUpdateMtoMilestoneNoteMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import TextAreaField from 'components/TextAreaField';
import toastSuccess from 'components/ToastSuccess';

import { MilestoneNoteType } from '../EditMilestoneForm';

/**
 * MilestoneNoteForm component
 * This component is used to add a new note or edit an existing note for a given MTO milestone
 * If in read view, will directly call mutation to add/update note
 * If in MTO matrix, will add/update note in app memory
 *
 * @param {string} mtoMilestoneID - The ID of the MTO milestone
 * @param {MilestoneNoteType[]} milestoneNotes - The list of milestone notes
 * @param {function} setMilestoneNotes - The function to set the list of milestone notes
 * @param {function} closeModal - The function to close the modal
 * @param {MilestoneNoteType | null} selectedMilestoneNote - The selected milestone note
 * @param {boolean} readView - Whether the component is in read view
 */
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

  const { euaId, name } = useSelector((state: AppState) => state.auth);

  const [milestoneNote, setMilestoneNote] = useState<string>(
    selectedMilestoneNote?.content || ''
  );

  useEffect(() => {
    if (selectedMilestoneNote) {
      setMilestoneNote(selectedMilestoneNote.content);
    }
  }, [selectedMilestoneNote]);

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
        },
        refetchQueries: [
          {
            query: GetMtoMilestoneDocument,
            variables: { id: mtoMilestoneID }
          }
        ]
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
        },
        refetchQueries: [
          {
            query: GetMtoMilestoneDocument,
            variables: { id: mtoMilestoneID }
          }
        ]
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
            id: '00000001-0001-0001-0001-000000000001',
            commonName: name,
            username: euaId
          }
        }
      ]);
    }
  };

  return (
    <div className="padding-x-8 padding-y-2 maxw-tablet">
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
            aria-label={mtoMilestoneNoteMiscT('note')}
            onChange={e => {
              setMilestoneNote(e.target.value);
            }}
            value={milestoneNote}
          />
        </FormGroup>

        {!isEditing && (
          <Alert type="info" slim className="margin-top-4">
            {mtoMilestoneNoteMiscT('noteInfo')}
          </Alert>
        )}

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
    </div>
  );
};

export default MilestoneNoteForm;
