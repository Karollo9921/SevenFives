import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
    }

    async getHtml() {
        return `
        <div class="auth-form">
            <h1>Login</h1>
            <p id="message"></p>
            <form>
                <p for="login">Login</p>
                <input type="text" id="login" name="login" required>
                <p for="password">Password</p>
                <input type="password" id="password" name="password" required>
                <input 
                    type="submit" 
                    value="Login"
                    id="post"
                >
            </form>
            <a href="/register">Don't have an account?</a>
        </div>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { login } from '/static/javascript/utilities/postData.js';

        dataFromServer(window.location.pathname, returnOrigin);
        document.getElementById('post').addEventListener('click', login);
        `
    }
}