import HomePage from './views/HomePage.js';
import Login from './views/Login.js';
import Register from './views/Register.js';


const navigateTo = url => {
    history.pushState(null, null ,url);
    router();
}

const router = async () => {
    const routes = [
        { path: "/", view: HomePage },
        { path: "/login", view: Login },
        { path: "/register", view: Register }  
    ];

    // choose our route
    const ourRoutes = routes.map(route => {
        return {
            route: route,
            isOurRoute: location.pathname === route.path
        };
    });

    let ourRoute = ourRoutes.find(route => route.isOurRoute );
    if (!ourRoute) {
        ourRoute = {
            route: routes[0],
            isOurRoute: true
        }
    }

    const view = new ourRoute.route.view();

    document.querySelector('#app').innerHTML = await view.getHtml();

    //Adding a script tag
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('defer', 'defer');
    script.text = await view.addScript();
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

