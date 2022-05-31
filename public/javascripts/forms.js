const S = (val) => document.querySelector(val);

const loginForm = S('#login-form');
const registerForm = S('#register-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = e.target[0].value;
    const password = e.target[1].value;

    console.log(username, password);
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
    .then(res => res.status == 200 ? location.reload() : res.json())
    .catch(err => console.log(err));
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e)
});