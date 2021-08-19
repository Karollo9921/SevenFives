const loginBtn = document.getElementById('post-btn');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');


login = async (clickEvent) => {
    clickEvent.preventDefault();
    let url = 'http://localhost:3000/login';
    await axios.post(url, { login: loginInput.value, password: passwordInput.value }, {
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        withCredentials: true
      })
    .then(response => {
        if (response.data.success) {
            window.location.href = response.data.url;
            // console.log(response.data.session);
        } else {
            document.getElementById('message').innerHTML = response.data.message
        }
    })
    .catch(err => {
        document.getElementById('message').innerHTML = err
    });
};

document.getElementById('post-btn').addEventListener('click', login);