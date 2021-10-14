import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Profile");
    }

    async getHtml() {
        return `
        <div class="user-profile">
            <h3 id="user-login">User Login: </h3>
            <h3 class="rating">Rating: </h3>
            <h3 class="games">Number of games: </h3>
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