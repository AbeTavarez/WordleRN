import { StyleSheet } from 'react-native';
import { colors } from '../constants';

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20
  },
  subTitle: {
    fontSize: 24,
    color: colors.lightgrey,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: 'bold'
  },
  statContainer: {
    marginVertical: 10,
    alignItems: 'center',
    margin: 10
  },
  statNumber: {
    color: colors.lightgrey,
    fontSize: 28,
    fontWeight: 'bold'
  },
  statLabel: {
    color: colors.lightgrey,
    fontSize: 14
  }
});
