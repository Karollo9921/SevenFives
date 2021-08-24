import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Profile");
    }

    async getHtml() {
        return `
        <h3 id="user-login">User Login: </h3>
        `
    }

    async addScript() {
        return `
        dataFromServer = async () => {
            let url = 'http://localhost:3000/user/' + window.location.href.substring(27, window.location.href.length);
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
                console.log(response);
                if (response?.data?.isLoggedIn) {
                    document.getElementsByClassName('login-register')[0].style.visibility = "hidden";
                    document.getElementsByClassName('login-register')[1].style.visibility = "hidden";
                    document.getElementById('user-route').style.visibility = "visible";
                    document.getElementById('logout').style.visibility = "visible";
                    document.getElementById('user-login').innerText += " " + response?.data?.login
                    document.getElementById('user-route').setAttribute("href", userUrl + response?.data?.uid);
                } else {
                    document.getElementsByClassName('login-register')[0].style.visibility = "visible";
                    document.getElementsByClassName('login-register')[1].style.visibility = "visible";
                    document.getElementById('user-route').style.visibility = "hidden";
                    document.getElementById('logout').style.visibility = "hidden";                   
                }
            })
            .catch(err => {
                console.log(err)
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