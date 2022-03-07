import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import systemIntakeReducer from 'reducers/systemIntakeReducer';
import {
  clearSystemIntake,
  fetchSystemIntake,
  saveSystemIntake
} from 'types/routines';

describe('The system intake reducer', () => {
  const mockApiSystemIntake = {
    id: '',
    status: 'INTAKE_DRAFT',
    requester: '',
    component: '',
    businessOwner: '',
    businessOwnerComponent: '',
    productManager: '',
    productManagerComponent: '',
    isso: '',
    trbCollaborator: '',
    oitSecurityCollaborator: '',
    eaCollaborator: '',
    projectName: '',
    existingFunding: null,
    fundingNumber: '',
    businessNeed: '',
    solution: '',
    processStatus: '',
    eaSupportRequest: null,
    existingContract: ''
  };
  it('returns the initial state', () => {
    // @ts-ignore
    expect(systemIntakeReducer(undefined, {})).toEqual({
      systemIntake: initialSystemIntakeForm,
      isLoading: null,
      isSaving: false,
      isNewIntakeCreated: null,
      error: null,
      notes: []
    });
  });

  describe('fetchSystemIntake', () => {
    it('handles fetchSystemIntake.REQUEST', () => {
      const mockRequestAction = {
        type: fetchSystemIntake.REQUEST,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: true,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });

    it('handles fetchSystemIntake.SUCCESS', () => {
      const mockPayload = {
        ...mockApiSystemIntake,
        id: '123',
        requester: 'Tom',
        component: 'My Test Component'
      };
      const mockSuccessAction = {
        type: fetchSystemIntake.SUCCESS,
        payload: mockPayload
      };

      expect(systemIntakeReducer(undefined, mockSuccessAction)).toEqual({
        systemIntake: prepareSystemIntakeForApp(mockPayload),
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });

    it('handles fetchSystemIntake.FULFILL', () => {
      const mockFulfillAction = {
        type: fetchSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });
  });

  describe('saveSystemIntake', () => {
    it('handles saveSystemIntake.REQUEST', () => {
      const mockRequestAction = {
        type: saveSystemIntake.REQUEST,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: true,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });
    it('handles saveSystemIntake.SUCCESS', () => {
      const mockSuccessAction = {
        type: saveSystemIntake.SUCCESS,
        payload: mockApiSystemIntake
      };

      expect(systemIntakeReducer(undefined, mockSuccessAction)).toEqual({
        systemIntake: prepareSystemIntakeForApp(mockSuccessAction.payload),
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });

    it('handles saveSystemIntake.FAILURE', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      };
      const mockFailureAction = {
        type: saveSystemIntake.FAILURE,
        payload: 'Error'
      };

      expect(systemIntakeReducer(initialState, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: 'Error',
        notes: []
      });
    });

    it('handles saveSystemIntake.FULFILL', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      };

      const mockFulfillAction = {
        type: saveSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(initialState, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });
  });

  describe('clearSystemIntake', () => {
    it('handles clearSystemIntake.TRIGGER', () => {
      const mockRequestAction = {
        type: clearSystemIntake.TRIGGER,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });
  });
});
