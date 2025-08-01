import {
  filterUnneededField,
  mapOtherParentFieldToDBField,
  translationSections,
  unneededFields
} from './util';

describe('exportTranslation Util', () => {
  it('filters unneeded fields from an object based on a string array', () => {
    const translationPlanSections = { ...translationSections };
    expect(
      filterUnneededField(
        translationPlanSections.plan_basics.modelCategory,
        unneededFields
      )
    ).toEqual({
      gqlField: 'modelCategory',
      goField: 'ModelCategory',
      dbField: 'model_category',
      label: 'Primary model category',
      dataType: 'ENUM',
      formType: 'RADIO',
      order: 1.01,
      options: {
        ACCOUNTABLE_CARE: 'Accountable Care',
        DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episode-Based',
        HEALTH_PLAN: 'Health Plan',
        PRESCRIPTION_DRUG: 'Prescription Drug',
        STATE_BASED: 'State & Community-Based',
        STATUTORY: 'Statutory',
        TO_BE_DETERMINED: 'To be determined'
      }
    });
  });

  it('calls closures and replaces otherParentField gql field with db fields', () => {
    const translationPlanSections = { ...translationSections };
    expect(
      mapOtherParentFieldToDBField(translationPlanSections.plan_basics)
    ).toEqual({
      modelCategory: {
        gqlField: 'modelCategory',
        goField: 'ModelCategory',
        dbField: 'model_category',
        label: 'Primary model category',
        dataType: 'ENUM',
        formType: 'RADIO',
        order: 1.01,
        options: {
          ACCOUNTABLE_CARE: 'Accountable Care',
          DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episode-Based',
          HEALTH_PLAN: 'Health Plan',
          PRESCRIPTION_DRUG: 'Prescription Drug',
          STATE_BASED: 'State & Community-Based',
          STATUTORY: 'Statutory',
          TO_BE_DETERMINED: 'To be determined'
        }
      },
      additionalModelCategories: {
        gqlField: 'additionalModelCategories',
        goField: 'AdditionalModelCategories',
        dbField: 'additional_model_categories',
        label: 'Additional model categories',
        sublabel:
          'If your model doesn’t fall into any additional categories, you can skip this.',
        dataType: 'STRING',
        formType: 'CHECKBOX',
        order: 1.02,
        options: {
          ACCOUNTABLE_CARE: 'Accountable Care',
          DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episode-Based',
          HEALTH_PLAN: 'Health Plan',
          PRESCRIPTION_DRUG: 'Prescription Drug',
          STATE_BASED: 'State & Community-Based',
          STATUTORY: 'Statutory',
          TO_BE_DETERMINED: 'To be determined'
        }
      },
      amsModelID: {
        gqlField: 'amsModelID',
        goField: 'AmsModelID',
        dbField: 'ams_model_id',
        label: 'Model ID',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 1.03
      },
      demoCode: {
        gqlField: 'demoCode',
        goField: 'DemoCode',
        dbField: 'demo_code',
        label: 'Demo code(s)',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 1.04
      },
      cmsCenters: {
        gqlField: 'cmsCenters',
        goField: 'CMSCenters',
        dbField: 'cms_centers',
        label: 'CMS component',
        dataType: 'ENUM',
        formType: 'CHECKBOX',
        order: 1.05,
        options: {
          CMMI: 'Center for Medicare and Medicaid Innovation (CMMI)',
          CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY:
            'Center for Clinical Standards and Quality (CCSQ)',
          CENTER_FOR_MEDICAID_AND_CHIP_SERVICES:
            'Center for Medicaid and CHIP Services (CMCS)',
          CENTER_FOR_MEDICARE: 'Center for Medicare (CM)',
          FEDERAL_COORDINATED_HEALTH_CARE_OFFICE:
            'Federal Coordinated Health Care Office (FCHCO)',
          CENTER_FOR_PROGRAM_INTEGRITY: 'Center for Program Integrity (CPI)'
        }
      },
      cmmiGroups: {
        gqlField: 'cmmiGroups',
        goField: 'CMMIGroups',
        dbField: 'cmmi_groups',
        label: 'CMMI Group',
        sublabel:
          'You only need to select the CMMI group if CMMI is selected as the main CMS component.',
        dataType: 'ENUM',
        formType: 'CHECKBOX',
        order: 1.06,
        options: {
          PATIENT_CARE_MODELS_GROUP: 'Patient Care Models Group (PCMG)',
          POLICY_AND_PROGRAMS_GROUP: 'Policy and Programs Group (PPG)',
          SEAMLESS_CARE_MODELS_GROUP: 'Seamless Care Models Group (SCMG)',
          STATE_AND_POPULATION_HEALTH_GROUP:
            'State and Population Health Group (SPHG)',
          TBD: 'To be determined'
        }
      },
      modelType: {
        gqlField: 'modelType',
        goField: 'ModelType',
        dbField: 'model_type',
        label: 'Model Type',
        dataType: 'ENUM',
        formType: 'CHECKBOX',
        order: 2.01,
        options: {
          VOLUNTARY: 'Voluntary',
          MANDATORY_NATIONAL: 'Mandatory national',
          MANDATORY_REGIONAL_OR_STATE: 'Mandatory regional or state',
          OTHER: 'Other'
        }
      },
      modelTypeOther: {
        gqlField: 'modelTypeOther',
        goField: 'ModelTypeOther',
        dbField: 'model_type_other',
        label: 'Please specify',
        exportLabel: 'Please specify other',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 2.02,
        isOtherType: true,
        otherParentField: 'model_type'
      },
      problem: {
        gqlField: 'problem',
        goField: 'Problem',
        dbField: 'problem',
        label: 'Problem statement',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 2.03
      },
      goal: {
        gqlField: 'goal',
        goField: 'Goal',
        dbField: 'goal',
        label: 'Goal',
        questionTooltip:
          'The high level goal of the program and a description of the project.',
        sublabel:
          'Please include the high level goal of the program and a description of the project.',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 2.04
      },
      testInterventions: {
        gqlField: 'testInterventions',
        goField: 'TestInterventions',
        dbField: 'test_interventions',
        label: 'Test Interventions',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 2.05
      },
      note: {
        gqlField: 'note',
        goField: 'Note',
        dbField: 'note',
        label: 'Notes',
        isNote: true,
        parentReferencesLabel: 'Model basics',
        dataType: 'STRING',
        formType: 'TEXTAREA',
        order: 2.06
      },
      readyForReviewBy: {
        gqlField: 'readyForReviewBy',
        goField: 'ReadyForReviewBy',
        dbField: 'ready_for_review_by',
        label:
          'This section of the Model Plan (Model basics) is ready for review.',
        dataType: 'UUID',
        formType: 'TEXT',
        order: 3.13,
        tableReference: 'user_account',
        hideFromReadonly: true
      },
      readyForReviewDts: {
        gqlField: 'readyForReviewDts',
        goField: 'ReadyForReviewDts',
        dbField: 'ready_for_review_dts',
        label: 'Ready for review date',
        dataType: 'DATE',
        formType: 'DATEPICKER',
        order: 3.14,
        hideFromReadonly: true
      },
      readyForClearanceBy: {
        gqlField: 'readyForClearanceBy',
        goField: 'ReadyForClearanceBy',
        dbField: 'ready_for_clearance_by',
        label:
          'This section of the Model Plan (Model basics) is ready for clearance.',
        dataType: 'UUID',
        formType: 'TEXT',
        order: 3.15,
        tableReference: 'user_account',
        hideFromReadonly: true
      },
      readyForClearanceDts: {
        gqlField: 'readyForClearanceDts',
        goField: 'ReadyForClearanceDts',
        dbField: 'ready_for_clearance_dts',
        label: 'Ready for clearance date',
        dataType: 'DATE',
        formType: 'DATEPICKER',
        order: 3.16,
        hideFromReadonly: true
      },
      status: {
        gqlField: 'status',
        goField: 'Status',
        dbField: 'status',
        label: 'Model Plan status',
        dataType: 'ENUM',
        formType: 'CHECKBOX',
        order: 3.17,
        options: {
          READY: 'Ready',
          IN_PROGRESS: 'In progress',
          READY_FOR_REVIEW: 'Ready for review',
          READY_FOR_CLEARANCE: 'Ready for clearance'
        },
        hideFromReadonly: true
      }
    });
  });
});
