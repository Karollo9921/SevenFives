import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("HomePage");
    }

    async getHtml() {
        return `
        <div id="home-data"><p>Logged User: </p></div>
        `
    }

    async addScript() {
        return `
        dataFromServer = async () => {
            console.log("Hello!")
            let url = 'http://localhost:3000/';
            let userUrl = 'http://localhost:5000/user/';
            await axios.get(url, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                console.log(document.getElementsByClassName('login-register'));
                document.getElementById('home-data').innerHTML = (JSON.stringify(response?.data?.isLoggedIn) || "Login Or Get") + " " + (JSON.stringify(response?.data?.user?.login) || "Account !");
                if (response?.data?.isLoggedIn) {
                    document.getElementsByClassName('login-register')[0].style.visibility = "hidden";
                    document.getElementsByClassName('login-register')[1].style.visibility = "hidden";
                    document.getElementById('user-route').style.visibility = "visible";
                    document.getElementById('user-route').setAttribute("href", userUrl + response?.data?.user?.uid);
                    document.getElementById('logout').style.visibility = "visible";
                } else {
                    document.getElementsByClassName('login-register')[0].style.visibility = "visible";
                    document.getElementsByClassName('login-register')[1].style.visibility = "visible";
                    document.getElementById('user-route').style.visibility = "hidden";
                    document.getElementById('logout').style.visibility = "hidden";                   
                }
            })
            .catch(err => {
                document.getElementById('home-data').innerHTML = err
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