import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
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
        dataFromServer = async () => {
            console.log("Hello!")
            let url = 'http://localhost:3000/login';
            await axios.get(url, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                console.log(document.getElementsByClassName('login-register'));
                if (response?.data?.isLoggedIn) {
                    window.location.href = response.data.url;
                    document.getElementsByClassName('login-register')[0].style.visibility = "hidden";
                    document.getElementsByClassName('login-register')[1].style.visibility = "hidden";
                    document.getElementById('logout').style.visibility = "visible";
                } else {
                    document.getElementsByClassName('login-register')[0].style.visibility = "visible";
                    document.getElementsByClassName('login-register')[1].style.visibility = "visible";
                    document.getElementById('logout').style.visibility = "hidden";                   
                }
            })
            .catch(err => {
                document.getElementById('home-data').innerHTML = err
            });
        };
        
        dataFromServer();


        const loginBtn = document.getElementById('post-btn');
        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');


        login = async (clickEvent) => {
            clickEvent.preventDefault();
            let url = 'http://localhost:3000/login';
            await axios.post(url, { login: loginInput.value, password: passwordInput.value }, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                if (response.data.success) {
                    window.location.href = response.data.url;
                    // console.log(response.data.session);
                } else {
                    document.getElementById('message').innerHTML = response.data.message
                }
            })
            .catch(err => {
                document.getElementById('message').innerHTML = err
            });
        };

        document.getElementById('post-btn').addEventListener('click', login);
        `
    }
}