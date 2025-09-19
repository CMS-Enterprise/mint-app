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
  createdBy: 'by {{name}} | {{date}} at {{time}}'
};

export default mtoMilestoneNote;
