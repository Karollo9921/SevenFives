dataFromServer = async () => {
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