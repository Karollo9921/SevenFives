import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Play with Computer !");
    }

    async getHtml() {
        return `
        <div class="grid">
            <div class="player1 player">
                <p class="nickname"></p>
                <div class="num-of-dices">Number of Dices: 1</div>
            </div>
            <div class="player2 player">
                <p class="nickname"></p>
                <div class="num-of-dices">Number of Dices: 1</div>
            </div>
            <div class="player3 player">
                <p class="nickname"></p>
                <div class="num-of-dices">Number of Dices: 1</div>
            </div>
            <div class="backlog">
                <p class="nickname">BACKLOG</p>
                <ul>
                </ul>
            </div>
            <div class="main-player">
                <p class="nickname"></p>
                <div class="dices">
                    <div class="dice">?</div>
                </div>
                <div class="decide">
                    <button id="roll">ROLL THE DICE !</button>
                    <button id="call" style="display: none;">CALL HIM A LIAR !</button>
                    <button id="ok" style="display: none;">OK !</button>
                </div>
                <div class="statement">
                    <h3>ROLL THE DICE ! ^</h3>
                </div>
            </div>
            <div class="staking-table">
                <p class="nickname">STAKING - TABLE</p>
                <div class="grid-table">
                    <div class="column-1" class="column">
                        <p class="staking-header">ONE</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                    <div class="column-2" class="column">
                        <p class="staking-header">TWO</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                    <div class="column-3" class="column">
                        <p class="staking-header">THREE</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                    <div class="column-4" class="column">
                        <p class="staking-header">FOUR</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    async addScript() {
        return `
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { logout } from '/static/javascript/utilities/logout.js';

        dataFromServer(window.location.pathname);
        document.getElementById('logout-btn').addEventListener('click', logout);
        `
    }
}