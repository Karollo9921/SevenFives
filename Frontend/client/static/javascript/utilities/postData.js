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
      document.getElementById('message').innerHTML = err
  });
};


const register = async (clickEvent) => {
  clickEvent.preventDefault();

  var loginInput = document.getElementById('login');
  var passwordInput = document.getElementById('password');
  var password2Input = document.getElementById('password2');

  let url = returnOrigin(true) + '/api/register';

  let data = JSON.stringify(
      {
          login: loginInput.value,
          password: passwordInput.value,
          password2: password2Input.value
      }
  );

  const postData = await fetch(url, {
      method: 'POST',
      // credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
      redirect: 'manual',
      body: data
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          window.location.href = data.url;
      } else {
          document.getElementById('message').innerHTML = data.message
      }
  })
  .catch(err => {
      document.getElementById('message').innerHTML = err
  });

  return postData().json();
};

export { login, register };

