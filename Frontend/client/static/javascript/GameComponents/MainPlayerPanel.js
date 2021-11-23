export class MainPlayerPanel {

  constructor(player) {
    this.player = player;
    this.login = '';
    this.dices = [];
    this.numOfDices = 1;
    this.diceCasted = false;
  };

  setNickname(login) {
    this.login = login;
  };

  setNumOfDices(numOfDices) {
    this.numOfDices = numOfDices;
  };

  addDice() {
    let diceDiv = document.createElement('div');
    diceDiv.classList.add('dice');
    diceDiv.textContent = '?';
    this.player.children[1].appendChild(diceDiv);
    this.numOfDices += 1;
  };

  addDice2() {
    let diceDiv = document.createElement('div');
    diceDiv.classList.add('dice');
    diceDiv.textContent = '?';
    this.player.children[1].appendChild(diceDiv);
  };

  castTheDices() {
    this.dices = [];
    Array.from(this.player.getElementsByClassName('dice')).forEach((dice) => {
      dice.textContent = Math.ceil(Math.random() * 6).toString();
      this.dices.push(parseInt(dice.textContent));
    });
    this.diceCasted = true;
  };

  setDiceDefault() {
    Array.from(this.player.getElementsByClassName('dice')).forEach((dice) => {
      dice.textContent = '?';
    });
  }

  displayDices() {
    this.diceCasted = this.dices[0] === '?' ? false : true;
    for (let i = 0; i < this.dices.length - 1; i++) {
      this.addDice2();
    };

    for (let i = 0; i < this.dices.length; i++) {
      this.player.getElementsByClassName('dice')[i].textContent = this.dices[i].toString();
    };
  };

  isDiceCasted() {
    return this.diceCasted;
  };

  returnPlayerLogin() {
    return this.login;
  };

};