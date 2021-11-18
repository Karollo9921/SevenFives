export class PlayerPanel {

  constructor(player) {
    this.player = player;
    this.login = '';
    this.status = '';
    this.numOfDices = 1;

    if (Array.from(this.player.getElementsByClassName('ready')).length === 0) {
      let pNode = document.createElement("p");
      pNode.classList.add('ready');
      this.player.insertBefore(pNode, this.player.children[1]);
    }
  };

  setNickname(login) {
    this.player.children[0].textContent = login;
    this.login = login;
  };

  setStatus(status, color) {
    this.status = status;
    this.player.children[1].textContent = status;
    this.player.children[1].style.color = color;
  };

  setNumOfDices(numOfDices) {
    if (numOfDices < 6) {
      this.player.children[2].textContent = `Number of Dices: ${numOfDices}`;
    } else {
      this.player.children[2].textContent = `This Player Lost and is Out of Game`;
      this.player.children[2].style.color = 'Red';
      this.player.children[2].style.fontWeight = "100";
    }
    this.numOfDices = numOfDices;
  };

  setLastMove(lastMove) {
    this.player.children[3].textContent = `LAST MOVE: ${lastMove}`;
  };

  returnPlayerLogin() {
    return this.login;
  };

  returnPlayerStatus() {
    return this.status;
  }

};