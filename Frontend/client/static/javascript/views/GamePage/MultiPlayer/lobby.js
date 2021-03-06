import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Let's Play !");
    }

    async getHtml() {
        return `
        <div class="grid-lobby">
            <div class="chat" id="chat">
            </div>
            <div class="players-header"><h3>Active Players:</h3></div>
            <div class="logged-in-players">
                <ul id="ul-players">
                </ul>
            </div>
            <div class="create-game">
                <form id="create" method="post">
                    <button id="create-btn" type="submit">Create a Game</button>
                    <p for="numOfPlayers">Set the Number of Players:</p>
                    <select name="numOfPlayers" id="numOfPlayers">
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                </form>
            </div>
            <form class="input-message">
                <input type="text" id="chat-message" name="chat-message" required>
                <input id="chat-message-btn" type="submit" value="Send Message">
            </form>
            <div class="list-of-games">
                <ul id="list-of-games">
                </ul>
            </div>
        </div>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { lobbySocket } from '/static/javascript/sockets/lobbySocket.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { logout } from '/static/javascript/utilities/logout.js';

        dataFromServer(window.location.pathname, returnOrigin);
        lobbySocket();
        document.getElementById('logout-btn').addEventListener('click', logout);
        `
    }
}