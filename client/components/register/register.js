import axios, { post } from 'axios';

const registerBtn = document.getElementById('post-btn');
const loginInput = document.querySelector(".login");
const passwordInput = document.querySelector(".password");
const password2Input = document.querySelector(".password2");

console.log(axios);

const register = () => {
    post('http://localhost:3000/register', {
        "login": loginInput.value,
        "password": passwordInput.value,
        "password2": password2Input.value
    })
    .then((response) => {
        console.log(response);
    });
};


registerBtn.addEventListener('click', register);