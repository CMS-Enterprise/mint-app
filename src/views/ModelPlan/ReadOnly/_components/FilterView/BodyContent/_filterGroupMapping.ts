const FilterGroupMap = {
  cmmi: {
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    'ops-eval-and-learning': [''],
    payments: ['']
  },
  oact: {
    basics: [''],
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    payments: ['']
  },
  dfsdm: {
    basics: [''],
    'participants-and-providers': [''],
    payments: ['']
  },
  ccw: {
    basics: [''],
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
    basics: [''],
    'general-characteristics': [''],
    'participants-and-providers': [''],
    beneficiaries: [''],
    'ops-eval-and-learning': [''],
    payments: ['']
  },
  pbg: {
    basics: [''],
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
    basics: [''],
    'participants-and-providers': [''],
    'ops-eval-and-learning': ['']
  }
};

export default FilterGroupMap;
