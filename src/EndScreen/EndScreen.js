import { View, Text } from 'react-native';
import { styles } from './styles';

const Number = ({ number, label }) => {
  return (
    <View style={styles.statContainer}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const EndScreen = ({ won = false }) => {
  return (
    <View>
      <Text style={styles.title}>
        {won ? 'Congrats!' : 'Oh No!, better luck tomorrow...'}
      </Text>

      <Text style={styles.subTitle}>STATISTICS</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Number number={3} label={'Played'} />
        <Number number={3} label={'Win %'} />
        <Number number={3} label={'Current \nStreak'} />
        <Number number={3} label={'Max Streak'} />
      </View>

      <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
    </View>
  );
};

export default EndScreen;
