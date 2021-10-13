import { returnOrigin } from '../utilities/url.js';

const lobbySocket = () => {
  const socket = io(returnOrigin(true) + '/api/play/multi-player-lobby');

  socket.on('connect', () => {
      console.log(socket);
  })

  socket.on('disconnect', () => {
      socket.on('messageFromServer', (dataFromServer) => {
          var login = dataFromServer.dat
          let liTagToDelete = Array.from(document.getElementById("ul-players").children).find(activePlayer => activePlayer.children[1].textContent = login);
          console.log(liTagToDelete);
          liTagToDelete[0].remove();
      });
  });

  socket.on('messageFromServer', (dataFromServer) => {
      var login = dataFromServer.data;
      var activePlayers = []
      Array.from(document.getElementById("ul-players").children).forEach(activePlayer => {
          activePlayers.push(activePlayer.children[1].textContent)
      })
      if (!activePlayers.includes(login)) {
          var liNode = document.createElement("li");
          var divNode = document.createElement("div");
          var pNode = document.createElement("p");
          var textnode = document.createTextNode(login)
          pNode.appendChild(textnode)
          divNode.classList.add("green");
          pNode.classList.add(login)
          liNode.appendChild(divNode);
          liNode.appendChild(pNode)
          document.getElementById("ul-players").appendChild(liNode);
      }
      console.log(activePlayers)
  });

  socket.emit('dataToServer', { data: "Data from the Client!" });
}

export { lobbySocket }