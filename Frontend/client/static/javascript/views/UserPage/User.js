import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Profile");
    }

    async getHtml() {
        return `
        <h3 id="user-login">User Login: </h3>
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