const FilterGroupMap = {
  cmmi: {
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    'ops-eval-and-learning': [''],
    payments: ['']
  },
  oact: {
    basics: ['nameHistory'],
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    payments: ['']
  },
  dfsdm: {
    basics: ['nameHistory'],
    'participants-and-providers': [''],
    payments: ['']
  },
  ccw: {
    basics: ['nameHistory'],
    'participants-and-providers': [''],
    'ops-eval-and-learning': [''],
    payments: ['']
  },
  ipc: {
    basics: ['nameHistory'],
    'general-characteristics': [''],
    'participants-and-providers': [''],
    payments: ['']
  },
  iddoc: {
    basics: ['nameHistory'],
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    'ops-eval-and-learning': [''],
    payments: ['']
  },
  pbg: {
    basics: ['modelType', 'goal'],
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    'ops-eval-and-learning': [''],
    payments: ['']
  },
  mdm: {
    basics: ['nameHistory'],
    beneficiaries: [
      'beneficiaries',
      'beneficiariesOther',
      'beneficiariesNote',
      'numberPeopleImpacted',
      'estimateConfidence',
      'beneficiaryOverlap',
      'beneficiaryOverlapNote',
      'precedenceRules'
    ]
  },
  cbosc: {
    basics: ['nameHistory'],
    'participants-and-providers': [''],
    'ops-eval-and-learning': ['']
  }
};

export default FilterGroupMap;
