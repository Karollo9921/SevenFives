export class Player {

    constructor(nickname, isBot) {
        this.nickname = nickname;
        this.isBot = isBot;
        this.numOfDices = 1;
        this.dices = ['?'];
        this.lastMove = '';
        this.inGame = true;
    };
};
