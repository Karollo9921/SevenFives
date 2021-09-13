import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Let's Play !");
    }

    async getHtml() {
        return `
        <div class="grid-lobby">
            <div class="chat">
                <p><span class="nickname">Karollo</span><span class="message">: Hello !</span></p>
            </div>
            <div class="logged-in-players">
                <ul>
                    <li><div class="green"></div> <p>Karollo</p> </li>
                    <li><div class="green"></div> <p>Karollo 2</p></li>
                </ul>
            </div>
            <div class="create-game">
                <form id="create" action="http://localhost:3000/play/:id" method="post">
                    <button id="create-btn" type="submit">Create a Game</button>
                </form>
            </div>
            <div class="input-message">
                <input type="text" id="chat-message" name="chat-message" required>
                <input id="post-btn" type="submit" value="Send Message">
            </div>
            <div class="list-of-games">
                <ul>
                    <li><p>Game Crated by Karollo For 5 Players </p><p claas="slots">1/5</p><a href="/play/:id" class="join-btn">JOIN</a></li>
                </ul>
            </div>
        </div>
        `
    }

    async addScript() {
        return `
        dataFromServer = async () => {
            let url = 'http://localhost:3000/play/multi-player-lobby'
            let userUrl = 'http://localhost:5000/user/';
            console.log("Hello!");
            console.log(url);
            await axios.get(url, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                console.log("This is my response: " + response);
                if (response?.data?.isLoggedIn) {
                    document.getElementsByClassName('login-register')[0].style.visibility = "hidden";
                    document.getElementsByClassName('login-register')[1].style.visibility = "hidden";
                    document.getElementById('user-route').style.visibility = "visible";
                    document.getElementById('logout').style.visibility = "visible";
                    document.getElementById('play').style.visibility = "visible";
                    // document.getElementById('user-login').innerText += " " + response?.data?.user.login
                    document.getElementById('user-route').setAttribute("href", userUrl + response?.data?.user?.uid);
                    document.getElementsByClassName('main-player')[0].children[0].textContent = response?.data?.user.login.toUpperCase();
                } else {
                    document.getElementsByClassName('login-register')[0].style.visibility = "visible";
                    document.getElementsByClassName('login-register')[1].style.visibility = "visible";
                    document.getElementById('play').style.visibility = "hidden";
                    document.getElementById('user-route').style.visibility = "hidden";
                    document.getElementById('logout').style.visibility = "hidden";                   
                }
            })
            .catch(err => {
                console.log(err);
                console.log(err.toString().substr(err.toString().length - 3) == 404)
                if ((err.toString().substr(err.toString().length - 3) == 404)) {
                    window.location.href = "http://localhost:5000/404";
                    console.log("Am I here?")
                } else {
                    return console.log("This is my error: " + err)
                }
            });
        };
        
        dataFromServer();

        const logoutBtn = document.getElementById('logout-btn');

        logout = async (clickEvent) => {
            clickEvent.preventDefault();
            let url = 'http://localhost:3000/logout';
            await axios.post(url, { }, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                if (response.data.success) {
                    window.location.href = response.data.url;
                } else {
                    document.getElementById('message').innerHTML = response.data.message
                }
            })
            .catch(err => {
                document.getElementById('message').innerHTML = err
            });
        };

        logoutBtn.addEventListener('click', logout);
        `
    }
}