import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { colors, colorsToEmoji } from '../constants';
import { styles } from './styles';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const EndScreen = ({ won = false, rows, getCellBGColor }) => {
  const [secTillTomorrow, setSecTillTomorrow] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

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

  useEffect(() => {
    readState();
  }, []);

  //TODO: Find a library to handle the day format
  const formatSeconds = () => {
    const hours = Math.floor(secTillTomorrow / (60 * 60));
    const minutes = Math.floor((secTillTomorrow % (60 * 60)) / 60);
    const seconds = Math.floor(secTillTomorrow % 60);
    return `${hours}:${minutes}:${seconds}`;
  };

  const share = () => {
    const textMap = rows
      .map((row, rowsIdx) =>
        row
          .map(
            (cell, cellIdx) => colorsToEmoji[getCellBGColor(rowsIdx, cellIdx)]
          )
          .join('')
      )
      .filter((row) => row)
      .join('\n');
    const shareText = `Wordle \n${textMap} \n#wordle #palabreo`;
    Clipboard.setStringAsync(shareText);
    Alert.alert('Score copied', 'Share it on social media');
  };

  const readState = async () => {
    const dataString = await AsyncStorage.getItem('@game');
    let data;
    try {
      data = JSON.parse(dataString);
      console.log(data);
    } catch (e) {
      console.log("Couldn't parse the state data from async storage", e);
    }
    const keys = Object.keys(data); // an array with keys from days objects
    const values = Object.values(data); // an array of game objects

    setPlayed(keys.length); // number of games played
    const numbersOfWins = values.filter(
      (game) => game.gameState === 'won'
    ).length;

    setWinRate(Math.floor((100 * numbersOfWins) / keys.length)); // calculate winning rate
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>
        {won ? 'Congrats! 🎉' : 'Oh No! 😢 \nbetter luck tomorrow...'}
      </Text>

      <Text style={styles.subTitle}>STATISTICS</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Number number={played} label={'Played'} />
        <Number number={winRate} label={'Win %'} />
        <Number number={curStreak} label={'Current \nStreak'} />
        <Number number={maxStreak} label={'Max Streak'} />
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
