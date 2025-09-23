import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const mtoMilestoneNote = {
  content: {
    gqlField: 'content',
    goField: 'Content',
    dbField: 'content',
    label: 'Content',
    exportLabel: 'Note',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.0
  }
};

export const mtoMilestoneNoteMisc = {
  heading: 'Milestone notes',
  addANote: 'Add a note',
  addAMilestoneNote: 'Add a milestone note',
  editMilestoneNote: 'Edit milestone note',
  notesAdded: '{{count}} note added to this milestone',
  notesAdded_other: '{{count}} notes added to this milestone',
  note: 'Note',
  addNote: 'Add note',
  cancel: 'Cancel',
  saveChanges: 'Save changes',
  editThisNote: 'Edit this note',
  removeThisNote: 'Remove this note',
  backToMilestone: 'Back to milestone details',
  showNotes: 'Show notes',
  hideNotes: 'Hide notes',
  createdBy: 'by {{name}} | {{date}} at {{time}}',
  removeMilestoneNote: 'Are you sure you want to remove this note?',
  actionWarning: 'This action cannot be undone.',
  removeNote: 'Remove note',
  noteInfo:
    'All added notes will be visible to anyone with access to MINT. Please be sure the content of your note should be visible to others before adding it.',
  noteAdded: 'Note added successfully.',
  noteUpdated: 'Note updated successfully.',
  noteDeleted: 'Note deleted successfully.'
};

export default mtoMilestoneNote;
