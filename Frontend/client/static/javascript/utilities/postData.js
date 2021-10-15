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

const login = async (clickEvent) => {
  clickEvent.preventDefault();

  var loginInput = document.getElementById('login');
  var passwordInput = document.getElementById('password');

  let url = returnOrigin(true) + '/api/login';

  await axios.post(url, { login: loginInput.value, password: passwordInput.value }, {
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
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = err.response.data.message;
    setTimeout(() => {
      document.getElementById('message').textContent = '';
      document.getElementById('message').style.display = 'none';
    }, 7000);
  });
};


const register = async (clickEvent) => {
  clickEvent.preventDefault();

  var loginInput = document.getElementById('login');
  var passwordInput = document.getElementById('password');
  var password2Input = document.getElementById('password2');

  let url = returnOrigin(true) + '/api/register';

  await axios.post(url, { 
    login: loginInput.value, 
    password: passwordInput.value, 
    password2: password2Input.value 
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })
  .then(response => {
    console.log(response);
    if (response.data.success) {
        window.location.href = response.data.url;
    } else {
        document.getElementById('message').innerHTML = response.data.message
    }
  })
  .catch(err => {
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = err.response.data.message;
    setTimeout(() => {
      document.getElementById('message').textContent = '';
      document.getElementById('message').style.display = 'none';
    }, 7000);
  });

};

export { login, register };

