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
          if (path.substring(0, 5) === '/user') { document.getElementById('user-login').innerText += " " + response?.data?.login }
          if (path === '/play/multi-player-lobby') {
            response?.data?.waitingGames.forEach((game) => {
              let liNode = document.createElement("li");
              liNode.innerHTML = `<p>Game Created by<a target="_blank" href="${returnOrigin(false) + '/user/' + game.creator_uid}" class="user-a-tag">${game.creator}</a>For ${game.numOfPlayers} Players </p>
                                  <p claas="slots">1/${game.numOfPlayers}</p>
                                  <a href="${returnOrigin(false) + path + '/' + game._id}" class="join-btn">JOIN</a>`;
              document.getElementById('list-of-games').appendChild(liNode);
            })
          }

      } else {
          document.getElementsByClassName('login-register')[0].style.display = "block";
          document.getElementsByClassName('login-register')[1].style.display = "block";
          document.getElementById('user-route').style.display = "none";
          document.getElementById('logout').style.display = "none";
          document.getElementById('play').style.display = "none";                   
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