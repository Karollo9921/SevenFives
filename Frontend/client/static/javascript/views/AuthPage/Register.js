import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register");
    }

    async getHtml() {
        return `
        <h1>Register</h1>
        <p id="message"></p>
        <form action="http://localhost:3000/register" method="POST">
            <div>
                <label for="register">Login</label>
                <input type="text" id="login" name="login" class="login" required>
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="password" required>
            </div>    
            <div>
                <label for="password2">Repeat Password</label>
                <input type="password" id="password2" name="password2" class="password2" required>
            </div>
            <!-- <button type="submit" id="post-btn">Register</button> -->
            <input 
                id="post-btn" 
                type="submit" 
                value="Register"
            >       
        </form>
        <p>Do you have an account? Go <a href="/login">Login</a></p>  
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { register } from '/static/javascript/utilities/postData.js';

        dataFromServer(window.location.pathname, returnOrigin);        
        document.getElementById('post-btn').addEventListener('click', register);
        `
    }
}