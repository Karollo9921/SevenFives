const dataFromServer = async (path, returnOrigin) => {

  let url = path.substring(0, 5) === '/user' ? returnOrigin(true) + '/api/user/' + window.location.href.substring((returnOrigin(true) + '/api/user/').length, window.location.href.length) : returnOrigin(true) + path;
  let userUrl = returnOrigin(false) + '/user/';

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
          document.getElementById('play').style.visibility = "visible";
          document.getElementById('user-route').style.visibility = "visible";
          document.getElementById('user-route').setAttribute("href", userUrl + response?.data?.user?.uid);
          document.getElementById('logout').style.visibility = "visible";

          if (path === '/play/single-player') { document.getElementsByClassName('main-player')[0].children[0].textContent = response?.data?.user.login.toUpperCase() }
          if (path.substring(0, 5) === '/user') { document.getElementById('user-login').innerText += " " + response?.data?.login }

      } else {
          document.getElementsByClassName('login-register')[0].style.visibility = "visible";
          document.getElementsByClassName('login-register')[1].style.visibility = "visible";
          document.getElementById('user-route').style.visibility = "hidden";
          document.getElementById('logout').style.visibility = "hidden";
          document.getElementById('play').style.visibility = "hidden";                   
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