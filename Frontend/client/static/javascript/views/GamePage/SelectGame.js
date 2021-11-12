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
            <a id="multi-player" class="btn" href="/play/multi-player-lobby">Multi player - Play with other People !</a>
        </div>
        <div class="video">
            <h2>HOW TO PLAY</h3>
            <iframe 
                width="606" 
                height="346" 
                src="https://www.youtube.com/embed/8yUkTpzXQZc" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; 
                autoplay; 
                clipboard-write; 
                encrypted-media; 
                gyroscope; 
                picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
        `
    }

    async addScript() {
        return `
        import { returnOrigin } from '/static/javascript/utilities/url.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { logout } from '/static/javascript/utilities/logout.js';

        dataFromServer(window.location.pathname, returnOrigin);
        document.getElementById('logout-btn').addEventListener('click', logout);
        `
    }
}