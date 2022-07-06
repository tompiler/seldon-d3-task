export const reducer = (state, action) => {
  switch (action.type) {
    case "dateRange":
      return { ...state, dateRange: action.payload };
    case "loaded":
      return { ...state, loading: false };
    case "multiple":
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

export const initialState = { loading: true };
