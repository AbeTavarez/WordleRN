import { View, Text } from 'react-native';
import { colors } from '../constants';
import { styles } from './styles';

const Number = ({ number, label }) => {
  return (
    <View style={styles.statContainer}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const GuessDistributionLine = ({ position, amount, percentage }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
      <Text style={{ color: colors.lightgrey }}>{position}</Text>
      <View
        style={{
          backgroundColor: colors.grey,
          margin: 5,
          padding: 5,
          alignSelf: 'stretch',
          width: `${percentage}%`
        }}
      >
        <Text style={{ color: colors.lightgrey }}>{amount}</Text>
      </View>
    </View>
  );
};

const GuessDistribution = () => {
  return (
    <>
      <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
      <View style={{ padding: 20, width: '100%' }}>
        <GuessDistributionLine position={0} amount={2} percentage={50} />
      </View>
    </>
  );
};

const EndScreen = ({ won = false }) => {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
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

      <GuessDistribution />
    </View>
  );
};

export default EndScreen;
