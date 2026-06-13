import NetInfo from '@react-native-community/netinfo';

export const isNetworkAvailable = async () => {
  try {
    const state = await NetInfo.fetch();
    console.log('state--' + JSON.stringify(state));
    // return state.isConnected ?? false;
    if (state?.type == 'unknown') {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newState = await NetInfo.fetch();
      return newState.isConnected ?? false;
    } else {
      return state.isConnected ?? false;
    }
  } catch {
    return false;
  }
};