import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("HomePage");
    }

    async getHtml() {
        return `
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