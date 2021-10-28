const returnOrigin = (isBackend) => {
  let url;
  if (window.location.origin === 'https://seven-fives.herokuapp.com' || !isBackend ) 
  { 
    url = window.location.origin;
  } else {
    url = 'http://localhost:3000';
  }
  return url;
}

const prepareMultiGame = async () => {

  let SINGULAR = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
  let gridDiv = document.getElementsByClassName('grid')[0];
  let stakingTable = document.getElementsByClassName('grid-table')[0];
  let url = 
    returnOrigin(true) + 
    '/api/play/multi-player-lobby/' +  
    window.location.href.substring((window.location.origin + '/play/multi-player-lobby/').length, window.location.href.length);

  try {
    const response = await axios.get(url, 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

  let numOfPlayers = response.data.game.numOfPlayers;

  for (let i = 1; i < numOfPlayers; i++) {
    let playerDiv = document.createElement("div");
    playerDiv.classList.add('player');
    playerDiv.classList.add(`player${numOfPlayers - i}-multi`);
    playerDiv.style.gridColumnStart = (((numOfPlayers - i)*12)/(numOfPlayers - 1)) - 12/(numOfPlayers - 1) + 1;
    playerDiv.style.gridColumnEnd = (((numOfPlayers - i)*12)/(numOfPlayers - 1)) + 1;
    playerDiv.innerHTML = `<p class="nickname">WAITING FOR PLAYER</p>
                          <div class="num-of-dices">Number of Dices: 1</div>
                          <p class="move">LAST MOVE: </p>`
    gridDiv.prepend(playerDiv);
  }

  for (let i = 0; i < numOfPlayers; i++) {
    let stakeDiv = document.createElement("div");
    stakeDiv.classList.add('column');
    stakeDiv.classList.add(`column-${numOfPlayers - i}`);
    stakingTable.style.gridTemplateColumns = `repeat(${numOfPlayers}, 1fr)`;
    stakeDiv.innerHTML = `<p class="staking-header">${SINGULAR[numOfPlayers - 1 - i]}</p>
                          <button class="staking-btn">ONES</button><br>
                          <button class="staking-btn">TWOS</button><br>
                          <button class="staking-btn">THREES</button><br>
                          <button class="staking-btn">FOURS</button><br>
                          <button class="staking-btn">FIVES</button><br>
                          <button class="staking-btn">SIXES</button>`
    stakingTable.prepend(stakeDiv);
  }

  } catch (error) {
    console.log(error);
  }
};

export { prepareMultiGame };