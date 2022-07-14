export const reducer = (state, action) => {
  switch (action.type) {
    case "dateRange":
      return { ...state, dateRange: action.payload };
    case "liveData":
      return { ...state, liveData: action.payload };
    case "randomLiveData":
      return { ...state, randomLiveData: action.payload };
    case "referenceData":
      return { ...state, referenceData: action.payload };
    case "randomReferenceData":
      return { ...state, randomReferenceData: action.payload };
    case "loading":
      return { ...state, loading: action.payload };
    case "source":
      return { ...state, source: action.payload };
    case "liveSampleSize":
      return { ...state, liveSampleSize: action.payload };
    case "referenceSampleSize":
      return { ...state, referenceSampleSize: action.payload };
    case "selectedCluster":
      return {
        ...state,
        selectedCluster: action.payload,
      };
    case "selectedClusterCentroid":
      return { ...state, selectedClusterCentroid: action.payload };
    case "multiple":
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

export const initialState = {
  loading: true,
  source: "live",
  liveSampleSize: 0.1,
  referenceSampleSize: 0.01,
  liveData: [],
  referenceData: [],
  randomLiveData: [],
  randomReferenceData: [],
  selectedCluster: undefined,
  previousSelectedCluster: undefined,
};
