const waiverLibraryMisc = {
  hkcHeading: 'Waiver library',
  hkcDescription:
    'CMMI Leadership assumes that new models will use program and payment waivers unless justified otherwise. You may use this waiver library to browse and learn more about the waivers available for model teams. MINT also includes a mandatory survey helps determine which models will use which waivers, which specific waivers are most appropriate for each model, ensures proper justification for waiver selections, and identifies instances where standard CMS authorities may be insufficient without additional waiver flexibility.',
  hkcJumpToLabel: 'Waiver library',
  hkcViewCta: 'View waiver library',
  description:
    'The waivers included in this library are waivers actively used in CMMI models. CMMI Leadership assumes that new models will use program and payment waivers unless justified otherwise. You may use this waiver library to browse and learn more about the waivers available for model teams, and each model team must also complete a survey to help determine which waivers their model will use.',
  returnToHkc: 'Return to Help and Knowledge Center',
  learnAbout: 'Learn about this waiver',
  waivers: 'waivers',
  filterOptions: {
    type: {
      label: 'By waiver type',
      description: '',
      tagLabel: 'Type'
    },
    focus: {
      label: 'By waiver focus',
      description: 'This filters by the “Waiver focus” field.',
      tagLabel: 'Focus'
    },
    other: {
      label: 'Other',
      description: '',
      tagLabel: 'Other',
      options: {
        WAIVERS_WITH_STANDARDIZATION_EFFORT_ONLY:
          'Only waivers with a waiver standardization effort',
        WAIVERS_WITH_CLAIMS_DATA_OR_RREG_ONLY:
          'Only waivers with available claims data or RREG analysis information'
      }
    }
  }
};

export default waiverLibraryMisc;
