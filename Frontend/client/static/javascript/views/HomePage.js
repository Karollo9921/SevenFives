import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
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
            await axios.get(url, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            .then(response => {
                document.getElementById('home-data').innerHTML = JSON.stringify(response.data)
            })
            .catch(err => {
                document.getElementById('home-data').innerHTML = err
            });
        };
        
        dataFromServer();
        `
    }
}