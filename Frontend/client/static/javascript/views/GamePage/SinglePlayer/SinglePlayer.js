import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Play with Computer !");
    }

    async getHtml() {
        return `
        <div class="grid">
            <div class="player1 player">
                <p class="nickname"></p>
                <div class="num-of-dices">Number of Dices: 1</div>

            </div>
            <div class="player2 player">
                <p class="nickname"></p>
                <div class="num-of-dices">Number of Dices: 1</div>
            </div>
            <div class="player3 player">
                <p class="nickname"></p>
                <div class="num-of-dices">Number of Dices: 1</div>
            </div>
            <div class="backlog">
                <p class="nickname">BACKLOG</p>
                <ul>
                </ul>
            </div>
            <div class="main-player">
                <p class="nickname"></p>
                <div class="dices">
                    <div class="dice">?</div>
                </div>
                <div class="decide">
                    <button id="roll">ROLL THE DICE !</button>
                    <button id="call" style="display: none;">CALL HIM A LIAR !</button>
                    <button id="ok" style="display: none;">OK !</button>
                </div>
                <div class="statement">
                    <h3>ROLL THE DICE ! ^</h3>
                </div>
            </div>
            <div class="staking-table">
                <p class="nickname">STAKING - TABLE</p>
                <div class="grid-table">
                    <div class="column-1" class="column">
                        <p class="staking-header">ONE</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                    <div class="column-2" class="column">
                        <p class="staking-header">TWO</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                    <div class="column-3" class="column">
                        <p class="staking-header">THREE</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                    <div class="column-4" class="column">
                        <p class="staking-header">FOUR</p>
                        <button class="staking-btn">ONES</button><br>
                        <button class="staking-btn">TWOS</button><br>
                        <button class="staking-btn">THREES</button><br>
                        <button class="staking-btn">FOURS</button><br>
                        <button class="staking-btn">FIVES</button><br>
                        <button class="staking-btn">SIXES</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    async addScript() {
        return `
        dataFromServer = async () => {
            let url = 'http://localhost:3000/play/single-player'
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