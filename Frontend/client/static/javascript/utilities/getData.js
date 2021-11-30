const dataFromServer = async (path, returnOrigin) => {

  let url = path.substring(0, 5) === '/user' ? returnOrigin(true) + '/api/user/' + window.location.href.substring((window.location.origin + '/user/').length, window.location.href.length) : returnOrigin(true) + '/api' + path;
  let userUrl = returnOrigin(false) + '/user/';

  await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
  .then(response => {
      if (response?.data?.isLoggedIn) {
        
          document.getElementsByClassName('login-register')[0].style.display = "none";
          document.getElementsByClassName('login-register')[1].style.display = "none";
          document.getElementById('play').style.display = "block";
          document.getElementById('user-route').style.display = "block";
          document.getElementById('user-route').setAttribute("href", userUrl + response?.data?.user?.uid);
          document.getElementById('logout').style.display = "block";

          if (path === '/play/single-player') { document.getElementsByClassName('main-player')[0].children[0].textContent = response?.data?.user.login.toUpperCase() }
          if (path.substring(0, 5) === '/user') { 
            document.getElementById('user-login').innerText += " " + response?.data?.login
            document.getElementById('rating').innerText += " " + response?.data?.rating
            document.getElementById('games').innerText += " " + response?.data?.numOfPlayedGames
          }

      } else {
          document.getElementsByClassName('login-register')[0].style.display = "block";
          document.getElementsByClassName('login-register')[1].style.display = "block";
          document.getElementById('user-route').style.display = "none";
          document.getElementById('logout').style.display = "none";
          document.getElementById('play').style.display = "none"; 
          
          if (!['/', '/login', '/register'].includes(window.location.pathname)) {
            window.location.href = returnOrigin(false) + "/login";
          };
      }
  })
  .catch(err => {
    if ((err.toString().substr(err.toString().length - 3) == 404)) {
        window.location.href = returnOrigin(false) + "/404";
    } else {
        return console.log("This is my error: " + err)
    }
  });
};

export { dataFromServer };