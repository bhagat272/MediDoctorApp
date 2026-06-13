import { StyleSheet } from 'react-native';
import { hasNotch } from 'react-native-device-info'; 
import { Colors } from '../../../theme';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
    
  },

  header: {
    fontSize: fonts.SIZE_22,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.secondary.MIRAGE,
    textAlign: 'center',
    marginVertical: 16,
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: Colors.primary.WHITE,
    borderWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
    borderRadius: 14,

    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  title: {
    fontSize: fonts.SIZE_16,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.secondary.LABEL,
  },

  userName: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.TEXT_MUTED,
    marginTop: 4,
  },

  date: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
    marginTop: 4,
  },

  amount: {
    fontSize: fonts.SIZE_18,
    fontFamily: fonts.Poppins_SemiBold,
  },
  flatlist:{
    paddingBottom: 12 ,paddingHorizontal:12
  }
});

export default styles;
