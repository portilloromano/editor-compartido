import { createStore } from "redux";

const initialState = {
  connection: {},
  resize: {},
  editorConfig: {
    theme: { name: '', value: '' },
    language: { name: '', value: '' }
  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTION':
      return {
        ...state,
        connection: action.connection
      }
    case 'RESIZE':
      return {
        ...state,
        resize: action.resize
      }
    case 'EDITOR':
      return {
        ...state,
        editorConfig: action.editorConfig
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