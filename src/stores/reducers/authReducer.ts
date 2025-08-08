import { Action } from 'redux-actions';

export type AcceptedNDA = {
  agreed: boolean;
  agreedDts: string;
};

export type AuthReducerState = {
  name: string;
  euaId: string;
  groups: Array<string>;
  acceptedNDA: AcceptedNDA;
  isUserSet: boolean;
};

const SET_USER = 'AUTH_REDUCER_SET_USER';
export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user
});

const initialState: AuthReducerState = {
  name: '',
  euaId: '',
  groups: [],
  acceptedNDA: {
    agreed: false,
    agreedDts: ''
  },
  isUserSet: false
};

function authReducer(
  state = initialState,
  action: Action<any>
): AuthReducerState {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
        isUserSet: true
      };
    default:
      return state;
  }
}

export default authReducer;
