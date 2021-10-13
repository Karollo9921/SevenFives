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

const logout = async (clickEvent) => {
  clickEvent.preventDefault();

  let url = returnOrigin(true) + '/logout';

  await axios.post(url, { }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
  .then(response => {
      if (response.data.success) {
          window.location.href = response.data.url;
      } else {
          document.getElementById('message').innerHTML = response.data.message
      }
  })
  .catch(err => {
      document.getElementById('message').innerHTML = err
  });
};

export { logout };