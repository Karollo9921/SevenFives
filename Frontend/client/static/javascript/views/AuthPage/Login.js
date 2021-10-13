import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
    }

    async getHtml() {
        return `
        <h1>Login</h1>
        <p id="message"></p>
        <form action="http://localhost:3000/login" method="POST">
            <div>
                <label for="login">Login</label>
                <input type="text" id="login" name="login" required>
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>    
            <!-- <button type="submit">Login</button>            -->
            <input 
                id="post-btn" 
                type="submit" 
                value="Login"
            >
        </form>
        <p>You don't have an account? Go <a href="/register" class="btn">Register</a></p>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { login } from '/static/javascript/utilities/postData.js';

        dataFromServer(window.location.pathname, returnOrigin);
        document.getElementById('post-btn').addEventListener('click', login);
        `
    }
}