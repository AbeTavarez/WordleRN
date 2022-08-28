import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from './src/constants';
import Keyboard from './src/Keyboard/Keyboard';

const NUMBER_OF_TRIES = 6;

export default function App() {
  const word = 'hello';
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  );

  //* Rows are the nested arrays and Columns are the values in the nested array.
  //* [
  //*   ['col1', 'col2'], //row1
  //*   ['col1', 'col2'], //row2
  //* ]
  const [currRow, setCurrRow] = useState(0); // start at first row
  const [currCol, setCurrCol] = useState(0); // start at first column
  const [gameState, setGameState] = useState('playing'); // playing, won, loss

  // Game State
  useEffect(() => {
    if (currRow > 0) {
      checkGameState();
    }
  }, [currRow]);

  const copyBidirectionalArr = (arr) => [...arr.map((row) => [...row])];

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') return;
    // console.warn(key);
    const updatedRows = copyBidirectionalArr(rows);

    // handles user pressing on CLEAR
    if (key === CLEAR) {
      const prevCol = currCol - 1;
      if (prevCol >= 0) {
        updatedRows[currRow][prevCol] = '';
        setRows(updatedRows);
        setCurrCol(prevCol);
      }
      return;
    }
    // handles user pressing on ENTER
    if (key === ENTER) {
      if (currCol === rows[0].length) {
        setCurrRow(currRow + 1);
        setCurrCol(0);
      }
      return;
    }

    // handles user pressing on letters
    if (currCol < rows[0].length) {
      updatedRows[currRow][currCol] = key;
      setRows(updatedRows);
      setCurrCol(currCol + 1);
    }
  };

  const isCellActive = (row, col) => row === currRow && col === currCol;

  const getCellBGColor = (rowIdx, colIdx) => {
    const cellLetter = rows[rowIdx][colIdx];
    if (rowIdx >= currRow) {
      return colors.black;
    }
    if (cellLetter === letters[colIdx]) {
      return colors.primary;
    }
    if (letters.includes(cellLetter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  // Cell Colors
  const getAllColorLetters = (color) => {
    return rows.flatMap((row, rowIdx) =>
      row.filter((cell, cellIdx) => getCellBGColor(rowIdx, cellIdx) === color)
    );
  };
  const greenCaps = getAllColorLetters(colors.primary);
  const yellowCaps = getAllColorLetters(colors.secondary);
  const greyCaps = getAllColorLetters(colors.darkgrey);

  //* ===== Game State Functions
  const checkGameState = () => {
    if (checkIfWon()) {
      Alert.alert('Winner Winner Chicken Dinner!');
      setGameState('won');
    } else if (checkIfLoss()) {
      Alert.alert('Oh no, better luck tomorrow!');
      setGameState('loss');
    }
  };

  const checkIfWon = () => {
    // get the previous row to check
    const prevRow = rows[currRow - 1];
    // if every letter in prevRow is in the same index as letters array then is true
    return prevRow.every((letter, i) => letter === letters[i]);
  };

  const checkIfLoss = () => currRow === rows.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Wordle</Text>

      <View style={styles.map}>
        {rows.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.row}>
            {row.map((cellLetter, cellIdx) => (
              <View
                key={`cell-${cellIdx}-${rowIdx}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(rowIdx, cellIdx)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(rowIdx, cellIdx)
                  }
                ]}
              >
                <Text style={styles.cellText}>{cellLetter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center'
    // justifyContent: 'center'
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10
  },
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
