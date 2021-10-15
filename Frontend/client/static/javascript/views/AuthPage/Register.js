import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register");
    }

    async getHtml() {
        return `
        <div class="auth-form">
            <h1>Register</h1>
            <p id="message"></p>
            <form>
                <p for="register">Login</p>
                <input type="text" id="login" name="register" required>
                <p for="password">Password</p>
                <input type="password" id="password" name="password" required>
                <p for="password2">Confirm Password</p>
                <input type="password" id="password2" name="password2" required>
                <input 
                    type="submit" 
                    value="Register"
                    id="post"
                >
            </form>
            <a href="/login">Already have an account?</a>
        </div>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { register } from '/static/javascript/utilities/postData.js';

        dataFromServer(window.location.pathname, returnOrigin);        
        document.getElementById('post').addEventListener('click', register);
        `
    }
}