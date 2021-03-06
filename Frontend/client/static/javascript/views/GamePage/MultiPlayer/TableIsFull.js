import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("TABLE IS FULL !");
    }

    async getHtml() {
        return `
        <div class="select2"> 
          <h1>This Table is Full ;( Go Back To Lobby And Find Another Game Or Create Your Own</h1>
          <a id="single-player" class="btn" href="/play/single-player">Single Player - Play with Bots !</a>
          <a id="multi-player" class="btn" href="/play/multi-player-lobby">Multi player - Play with other People !</a>
        </div>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { logout } from '/static/javascript/utilities/logout.js';


        dataFromServer(window.location.pathname, returnOrigin);
        document.getElementById('logout-btn').addEventListener('click', logout);
        `
    }
}