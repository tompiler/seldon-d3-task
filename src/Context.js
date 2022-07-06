import { createContext, useReducer } from "react";

import { reducer, initialState } from "./reducers";
import App from "./App";

export const DashboardContext = createContext(initialState);

function WithState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DashboardContext.Provider value={[state, dispatch]}>
      <App />
    </DashboardContext.Provider>
  );
}

export default WithState;
