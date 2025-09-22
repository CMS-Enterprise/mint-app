import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Icon,
  ProcessList,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetMtoMilestoneDocument,
  useDeleteMtoMilestoneNoteMutation
} from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';
import toastSuccess from 'components/ToastSuccess';
import { formatDateUtc, formatTime } from 'utils/date';

import { MilestoneNoteType } from '../EditMilestoneForm';
import MilestoneNoteForm from '../MilestoneNoteForm';

/**
 * MilestoneNotes component
 * This component is used to display the milestone notes for a given MTO milestone
 * Opens a sidepanel/form to add a new note or edit an existing note
 * Opens a modal to confirm the deletion of a note
 *
 * @param {string} mtoMilestoneID - The ID of the MTO milestone
 * @param {MilestoneNoteType[]} props.milestoneNotes - The list of milestone notes
 * @param {function} setMilestoneNotes - The function to set the list of milestone notes
 * @param {MilestoneNoteType | null} selectedMilestoneNote - The selected milestone note
 * @param {function} setSelectedMilestoneNote - The function to set the selected milestone note
 * @param {boolean} props.readView - Whether the component is in read view
 */
const MilestoneNotes = ({
  mtoMilestoneID,
  milestoneNotes,
  setMilestoneNotes,
  selectedMilestoneNote,
  setSelectedMilestoneNote,
  readView = false
}: {
  mtoMilestoneID: string;
  milestoneNotes: MilestoneNoteType[];
  setMilestoneNotes: (milestoneNotes: MilestoneNoteType[]) => void;
  selectedMilestoneNote: MilestoneNoteType | null;
  setSelectedMilestoneNote: (
    selectedMilestoneNote: MilestoneNoteType | null
  ) => void;
  readView?: boolean;
}) => {
  const { t: mtoMilestoneNoteMiscT } = useTranslation('mtoMilestoneNoteMisc');

  const [editNotesOpen, setEditNotesOpen] = useState(false);

  const [isRemoveNoteModalOpen, setIsRemoveNoteModalOpen] = useState(false);

  const [noteToRemove, setNoteToRemove] = useState<MilestoneNoteType | null>(
    null
  );

  const [noteToEditReadView, setNoteToEditReadView] =
    useState<MilestoneNoteType | null>(null);

  const [deleteMilestoneNote] = useDeleteMtoMilestoneNoteMutation();

  const handleDeleteMilestoneNote = (note: MilestoneNoteType) => {
    deleteMilestoneNote({
      variables: {
        input: {
          id: note.id
        }
      },
      refetchQueries: [
        {
          query: GetMtoMilestoneDocument,
          variables: { id: mtoMilestoneID }
        }
      ]
    }).then(() => {
      toastSuccess(mtoMilestoneNoteMiscT('noteDeleted'));
    });
  };

  return (
    <div>
      {/* Add note sidepanel/form */}
      <Sidepanel
        isOpen={editNotesOpen}
        ariaLabel={mtoMilestoneNoteMiscT('backToMilestone')}
        testid="edit-notes-sidepanel"
        modalHeading={mtoMilestoneNoteMiscT('backToMilestone')}
        backButton
        showScroll
        noScrollable={false}
        closeModal={() => {
          setEditNotesOpen(false);
          setMilestoneNotes(milestoneNotes);
        }}
        overlayClassName="bg-transparent"
      >
        <MilestoneNoteForm
          milestoneNotes={milestoneNotes}
          setMilestoneNotes={setMilestoneNotes}
          closeModal={() => {
            setEditNotesOpen(false);
          }}
          selectedMilestoneNote={selectedMilestoneNote || noteToEditReadView}
          mtoMilestoneID={mtoMilestoneID}
          readView={readView}
        />
      </Sidepanel>

      {/* Remove Note Modal */}
      <Modal
        isOpen={isRemoveNoteModalOpen}
        closeModal={() => setIsRemoveNoteModalOpen(false)}
        fixed
        className="tablet:width-mobile-lg mint-body-normal"
      >
        <div className="padding-bottom-8">
          <PageHeading headingLevel="h3" className="margin-y-0">
            {mtoMilestoneNoteMiscT('removeMilestoneNote')}
          </PageHeading>

          <p className="margin-bottom-1">
            {mtoMilestoneNoteMiscT('actionWarning')}
          </p>

          <div className="margin-bottom-2 display-flex mint-modal__footer shadow-none">
            <Button
              type="submit"
              className="margin-right-3 margin-top-0 bg-error"
              onClick={() => {
                handleDeleteMilestoneNote(noteToRemove as MilestoneNoteType);
                setNoteToRemove(null);
                setIsRemoveNoteModalOpen(false);
              }}
            >
              {mtoMilestoneNoteMiscT('removeNote')}
            </Button>

            <Button
              type="button"
              className="margin-top-0"
              unstyled
              onClick={() => setIsRemoveNoteModalOpen(false)}
            >
              {mtoMilestoneNoteMiscT('cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      <h3 className="margin-0 margin-bottom-1">
        {mtoMilestoneNoteMiscT('heading')}
      </h3>

      <p className="margin-0 margin-bottom-1">
        {mtoMilestoneNoteMiscT('notesAdded', {
          count: milestoneNotes?.length || 0
        })}
      </p>

      <Button
        type="button"
        unstyled
        className={classNames('margin-0 display-flex', {
          'margin-bottom-3': readView
        })}
        onClick={() => {
          setSelectedMilestoneNote(null);
          setNoteToEditReadView(null);
          setEditNotesOpen(true);
        }}
      >
        {mtoMilestoneNoteMiscT('addANote')}
        <Icon.ArrowForward className="top-2px" aria-label="forward" />
      </Button>

      {milestoneNotes?.length > 0 && (
        <CollapsableLink
          id="milestone-notes"
          label={mtoMilestoneNoteMiscT('showNotes')}
          closeLabel={mtoMilestoneNoteMiscT('hideNotes')}
          styleLeftBar={false}
          startOpen
        >
          <ProcessList className="padding-x-0 margin-left-neg-1">
            {milestoneNotes.map((note, index) => (
              <ProcessListItem
                key={`${note.id}-${note.content}`}
                className="read-only-model-plan__timeline__list-item margin-left-2"
              >
                <p className="margin-top-0 margin-bottom-1">{note.content}</p>

                <p className="text-base-dark margin-top-0 margin-bottom-1">
                  {mtoMilestoneNoteMiscT('createdBy', {
                    name: note.createdByUserAccount.commonName,
                    date: formatDateUtc(note.createdDts, 'MMMM d, yyyy'),
                    time: formatTime(note.createdDts)
                  })}
                </p>

                {note.createdByUserAccount.isEUAID && (
                  <div className="display-flex">
                    <Button
                      type="button"
                      unstyled
                      className="margin-right-2"
                      onClick={() => {
                        if (readView) {
                          setNoteToEditReadView(note);
                        } else {
                          setSelectedMilestoneNote(note);
                        }
                        setEditNotesOpen(true);
                      }}
                    >
                      {mtoMilestoneNoteMiscT('editThisNote')}
                    </Button>

                    <Button
                      type="button"
                      unstyled
                      className="text-error"
                      onClick={() => {
                        if (readView) {
                          setNoteToRemove(note);
                          setIsRemoveNoteModalOpen(true);
                        } else {
                          setMilestoneNotes(
                            milestoneNotes.filter((n, i) => i !== index)
                          );
                        }
                      }}
                    >
                      {mtoMilestoneNoteMiscT('removeThisNote')}
                    </Button>
                  </div>
                )}
              </ProcessListItem>
            ))}
          </ProcessList>
        </CollapsableLink>
      )}
    </div>
  );
};

export default MilestoneNotes;
