import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants';
import { keyHeight } from '../Keyboard/styles';
console.log('keyheight', Math.floor(keyHeight * 5));
console.log('keyheight', keyHeight);
export const styles = StyleSheet.create({
  map: {
    alignSelf: 'stretch',
    marginTop: 20
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cell: {
    borderColor: colors.grey,
    borderWidth: 3,
    flex: 1,
    // aspectRatio: 1,
    minHeight:
      Dimensions.get('window').height > 1000
        ? (Dimensions.get('window').height - Math.floor(keyHeight * 5)) / 6
        : (Dimensions.get('window').height - Math.floor(keyHeight * 8)) / 6,
    margin: 3,
    maxWith: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28
  }
});
