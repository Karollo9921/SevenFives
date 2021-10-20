import { returnOrigin } from '../utilities/url.js';

const fetchUser = (url) => {
  return axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  ).then(response => response.data.user);
};

const displayUsers = (users) => {
  document.getElementById("ul-players").innerHTML = '';
  users.forEach((user) => {
    let liNode = document.createElement("li");
    let divNode = document.createElement("div");
    let pNode = document.createElement("p");
    let textnode = document.createTextNode(user.user)
    pNode.appendChild(textnode)
    divNode.classList.add("green");
    pNode.classList.add(user.user)
    liNode.appendChild(divNode);
    liNode.appendChild(pNode)
    document.getElementById("ul-players").appendChild(liNode);
  })
}


const user = await fetchUser(returnOrigin(true) + '/api/play/multi-player-lobby');

const lobbySocket = async () => {
  const socket = io(returnOrigin(true) + '/api/play/multi-player-lobby');

  socket.on('connect', () => {
    console.log(`User Connected: ${socket.id}`);
  });


  socket.on('disconnect', () => {
    console.log(socket.id);
  });

  socket.emit('dataToServer', { user: user.login });
  socket.on('updateUsersList', (users) => {
    displayUsers(users);
  });
}

export { lobbySocket }