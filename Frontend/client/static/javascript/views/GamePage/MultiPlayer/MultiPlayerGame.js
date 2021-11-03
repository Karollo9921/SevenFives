import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("SEVEN FIVES !");
    }

    async getHtml() {
        return `
        <div class="grid">
            <div class="backlog-multi">
                <p class="nickname">BACKLOG</p>
                <ul>
                </ul>
            </div>
            <div class="main-player">
                <p class="nickname" id="nickname"></p>
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
                </div>
            </div>
            <div class="chat-in-game">
                <p class="nickname">CHAT</p>
            </div>
            <form class="input-message-multi">
                <input type="text" id="chat-message-multi" name="chat-message-multi" required>
                <input id="chat-message-btn-multi" type="submit" value="Send Message">
            </form>
        </div>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { gameSocket } from '/static/javascript/sockets/gameSocket.js';
        import { prepareMultiGame } from '/static/javascript/utilities/prepareMultiGame.js';
        import { logout } from '/static/javascript/utilities/logout.js';

        prepareMultiGame(gameSocket);
        // gameSocket();
        dataFromServer(window.location.pathname, returnOrigin);
        document.getElementById('logout-btn').addEventListener('click', logout);
        `
    }
}