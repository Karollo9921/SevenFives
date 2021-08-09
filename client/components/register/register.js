import axios from 'axios';

const registerBtn = document.getElementById('post-btn');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');

console.log(registerBtn);
console.log(loginInput);
console.log(passwordInput);
console.log(password2Input);


const register = () => {
    console.log('login clicked');
    axios.post(
        'http://localhost:3000/register', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    .then((response) => {
        console.log(response);
    });
};

// const register = () => {
//     console.log('button is clicked');
//     let data = JSON.stringify(
//         {
//             login: loginInput.value,
//             password: passwordInput.value,
//             password2: password2Input.value
//         }
//     );
//     console.log(data);
//     fetch("http://localhost:3000/register", {
//         headers: {
//           "Content-Type": "application/json"
//         },
//         method: "POST",
//         body: data
//       })
// };

registerBtn.addEventListener('click', register);