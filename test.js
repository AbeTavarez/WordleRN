// * how are the rows created?
// * for instance if we have the word 'hello'; letters = 'hello'.split(''); this will be the output:
const rows = new Array(NUMBER_OF_TRIES).fill(
  new Array(letters.length).fill('a')
); //[['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]

//* ===== Game State Functions and Alerts
const checkGameState = () => {
  if (checkIfWon() && gameState !== 'won') {
    Alert.alert('Winner Winner', 'Chicken Dinner!', [
      { text: 'Share', onPress: shareScore }
    ]);
    setGameState('won');
  } else if (checkIfLoss() && gameState !== 'loss') {
    Alert.alert('Oh no, better luck tomorrow!');
    setGameState('loss');
  }
};
