import HomePage from './views/HomePage/HomePage.js';
import Login from './views/AuthPage/Login.js';
import Register from './views/AuthPage/Register.js';
import User from './views/UserPage/User.js';
import NotFound from './views/404/NotFound.js';
import SelectGame from './views/GamePage/SelectGame.js';
import SinglePlayer from './views/GamePage/SinglePlayer/SinglePlayer.js';
import MultiPlayerLobby from './views/GamePage/MultiPlayer/lobby.js';


const letsRegexOurPath = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null ,url);
    router();
}

const router = async () => {
    const routes = [
        { path: "/404", view: NotFound },
        { path: "/", view: HomePage },
        { path: "/login", view: Login },
        { path: "/register", view: Register },
        { path: "/user/:id", view: User },
        { path: "/play", view: SelectGame },
        { path: "/play/single-player", view: SinglePlayer },
        { path: "/play/multi-player-lobby", view: MultiPlayerLobby },
    ];

    // choose our route
    const ourRoutes = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(letsRegexOurPath(route.path))
        };
    });

    let ourRoute = ourRoutes.find(route => route.result !== null );
    if (!ourRoute) {
        ourRoute = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new ourRoute.route.view(getParams(ourRoute));
    document.querySelector('#app').innerHTML = await view.getHtml();

    const scriptModule = document.createElement('script');
    if (ourRoute.route.path === '/play/single-player') {
        scriptModule.setAttribute('type', 'module');
        scriptModule.src = '/static/javascript/single-player-game.js'
        document.body.appendChild(scriptModule);
    }

    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.text = await view.addScript();
    script.setAttribute('defer', 'defer');
    document.body.appendChild(script);

};

window.addEventListener("popstate", router);

// load router after click buttom and load DOM
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.ourRoutes("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        } else {
            e.preventDefault();
        }
    });

    router();
});

