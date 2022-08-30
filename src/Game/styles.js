import { StyleSheet } from 'react-native';
import { colors } from '../constants';
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
    aspectRatio: 1,
    margin: 3,
    maxWith: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellText: {
    color: colors.grey,
    fontWeight: 'bold',
    fontSize: 28
  }
});
