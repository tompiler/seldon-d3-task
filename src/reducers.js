export const reducer = (state, action) => {
  switch (action.type) {
    case "dateRange":
      return { ...state, dateRange: action.payload };
    case "liveData":
      return { ...state, liveData: action.payload };
    case "randomLiveData":
      return { ...state, randomLiveData: action.payload };
    case "randomLiveDataRefresh":
      return {
        ...state,
        randomLiveDataRefresh: state.randomLiveDataRefresh + 1,
      };
    case "referenceData":
      return { ...state, referenceData: action.payload };
    case "randomReferenceData":
      return { ...state, randomReferenceData: action.payload };
    case "randomReferenceDataRefresh":
      return {
        ...state,
        randomReferenceDataRefresh: state.randomReferenceDataRefresh + 1,
      };
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
    case "zoomReset":
      return { ...state, zoomReset: state.zoomReset + 1 };
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
  randomLiveDataRefresh: 0,
  randomReferenceDataRefresh: 0,
  liveData: [],
  referenceData: [],
  randomLiveData: [],
  randomReferenceData: [],
  selectedCluster: undefined,
  zoomReset: 0,
};
