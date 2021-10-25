const returnOrigin = (isBackend) => {
  let url;
  if (window.location.origin === 'https://seven-fives.herokuapp.com' || !isBackend ) 
  { 
    url = window.location.origin;
  } else {
    url = 'http://localhost:3000';
  }
  return url;
}

const createGame = async (e) => {
  e.preventDefault();

  let numOfPlayers = document.getElementById('numOfPlayers').value
  let url = returnOrigin(true) + '/api/play/multi-player-lobby';

  try {
    const response = await axios.post(url, { numOfPlayers: numOfPlayers }, 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    window.location.href = response.data.url;
    console.log(response);

  } catch (error) {
    console.log(error);
  }
};

export { createGame };