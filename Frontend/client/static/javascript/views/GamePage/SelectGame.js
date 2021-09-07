import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Select your game !");
    }

    async getHtml() {
        return `
        <div class="select"> 
            <a id="single-player" class="btn" href="/play/single-player">Single Player - Play with Bots !</a>
            <a id="multi-player" class="btn" href="">Multi player - Play with other People !</a>
        </div>
        `
    }

    async addScript() {
        return `
        dataFromServer = async () => {
            let url = 'http://localhost:3000/play'
            let userUrl = 'http://localhost:5000/user/';
            await axios.get(url, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                if (response?.data?.isLoggedIn) {
                    document.getElementsByClassName('login-register')[0].style.visibility = "hidden";
                    document.getElementsByClassName('login-register')[1].style.visibility = "hidden";
                    document.getElementById('user-route').style.visibility = "visible";
                    document.getElementById('logout').style.visibility = "visible";
                    document.getElementById('play').style.visibility = "visible";
                    document.getElementById('user-route').setAttribute("href", userUrl + response?.data?.user?.uid);
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