import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
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
        <GuessDistributionLine position={0} amount={4} percentage={70} />
      </View>
    </>
  );
};

const EndScreen = ({ won = false }) => {
  const share = () => {};

  const [secTillTomorrow, setSecTillTomorrow] = useState(0);
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      setSecTillTomorrow((tomorrow - now) / 1000);
    };

    //* Interval
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  //TODO: Find a library to handle the day format
  const formatSeconds = () => {
    const hours = Math.floor(secTillTomorrow / (60 * 60));
    const minutes = Math.floor((secTillTomorrow % (60 * 60)) / 60);
    const seconds = Math.floor(secTillTomorrow % 60);
    return `${hours}:${minutes}:${seconds}`;
  };

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

      <View style={{ flexDirection: 'row', padding: 10 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: colors.lightgrey, fontSize: 16 }}>
            Next Palabreo
          </Text>
          <Text
            style={{
              color: colors.lightgrey,
              fontSize: 24,
              fontWeight: 'bold'
            }}
          >
            {formatSeconds()}
          </Text>
        </View>

        <Pressable
          onPress={share}
          style={{
            flex: 1,
            backgroundColor: colors.darkgrey,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: colors.lightgrey, fontWeight: 'bold' }}>
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EndScreen;
