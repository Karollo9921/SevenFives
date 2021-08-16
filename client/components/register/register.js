const registerBtn = document.getElementById('post-btn');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');

register = async (clickEvent) => {
    clickEvent.preventDefault();
    let url = 'http://localhost:3000/register';
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

document.getElementById('post-btn').addEventListener('click', register);