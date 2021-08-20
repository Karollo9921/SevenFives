import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
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
        const registerBtn = document.getElementById('post-btn');
        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');
        const password2Input = document.getElementById('password2');
            
        register = async (clickEvent) => {
            clickEvent.preventDefault();
            let url = 'http://localhost:3000/register';
            let data = JSON.stringify(
                {
                    login: loginInput.value,
                    password: passwordInput.value,
                    password2: password2Input.value
                }
            );
            const postData = await fetch(url, {
                method: 'POST',
                // credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'manual',
                body: data
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.url;
                } else {
                    document.getElementById('message').innerHTML = data.message
                }
            })
            .catch(err => {
                document.getElementById('message').innerHTML = err
            });
            return postData().json();
        };
        
        document.getElementById('post-btn').addEventListener('click', register);
        `
    }
}