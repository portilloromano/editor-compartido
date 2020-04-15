import { createStore } from "redux";

const initialState = {
  connection: {
    socket: null,
    userId: ''
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTION':
      return {
        ...state,
        connection: action.connection
      }
    default:
      return state;
  }
}

const store = createStore(reducer,
  typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
    window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);

export default store;