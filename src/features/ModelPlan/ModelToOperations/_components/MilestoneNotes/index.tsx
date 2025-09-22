import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Icon,
  ProcessList,
  ProcessListItem
} from '@trussworks/react-uswds';

import CollapsableLink from 'components/CollapsableLink';
import Sidepanel from 'components/Sidepanel';
import { formatDateUtc, formatTime } from 'utils/date';

import { MilestoneNoteType } from '../EditMilestoneForm';
import MilestoneNoteForm from '../MilestoneNoteForm';

const MilestoneNotes = ({
  milestoneNotes,
  setMilestoneNotes,
  selectedMilestoneNote,
  setSelectedMilestoneNote
}: {
  milestoneNotes: MilestoneNoteType[];
  setMilestoneNotes: (milestoneNotes: MilestoneNoteType[]) => void;
  selectedMilestoneNote: MilestoneNoteType | null;
  setSelectedMilestoneNote: (
    selectedMilestoneNote: MilestoneNoteType | null
  ) => void;
}) => {
  const { t: mtoMilestoneNoteMiscT } = useTranslation('mtoMilestoneNoteMisc');

  const [editNotesOpen, setEditNotesOpen] = useState(false);

  return (
    <div>
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
          selectedMilestoneNote={selectedMilestoneNote}
        />
      </Sidepanel>

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
        className="margin-0 display-flex"
        onClick={() => {
          setSelectedMilestoneNote(null);
          setEditNotesOpen(true);
        }}
      >
        {mtoMilestoneNoteMiscT('addANote')}
        <Icon.ArrowForward className="top-2px" aria-label="forward" />
      </Button>

      {milestoneNotes.length > 0 && (
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
                        setSelectedMilestoneNote(note);
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
                        setMilestoneNotes(
                          milestoneNotes.filter((n, i) => i !== index)
                        );
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
