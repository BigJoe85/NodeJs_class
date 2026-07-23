let registerForm = document.getElementById('registerForm')
let image = document.getElementById('image')
let userName = document.getElementById('userName')
let email = document.getElementById('email')
let password = document.getElementById('password')
let confirmPassword = document.getElementById('confirmPassword')
let role = document.getElementById('role')


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        let response = await fetch("http://localhost:8000/api/v1/user/register", {
            method: "post",
            body: JSON.stringify({
                userName: userName.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
                role: role.value,
                image: image.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data)

        if (response.ok) {
            alert('Registration Successful!')
            registerForm.reset()
            window.location.href = './src/login.html';
        } else {
            alert(data.message || 'Registration Failed')
        }
    } catch (error) {
        alert('Something went wrong. Please try again.')
        console.error(error)
    }
})


















// const registerForm = document.getElementById('registerForm')
// const loginForm = document.getElementById('loginForm')
// const emailInput = document.getElementById('email')
// const passwordInput = document.getElementById('password')

// if (registerForm) {
//     const imageInput = document.getElementById('image')
//     const userNameInput = document.getElementById('userName')
//     const confirmPasswordInput = document.getElementById('confirmPassword')
//     const roleInput = document.getElementById('role')

//     registerForm.addEventListener('submit', async (e) => {
//         e.preventDefault()

//         const response = await fetch('http://localhost:8000/api/v1/user/register', {
//             method: 'POST',
//             body: JSON.stringify({
//                 userName: userNameInput?.value || '',
//                 email: emailInput?.value || '',
//                 password: passwordInput?.value || '',
//                 confirmPassword: confirmPasswordInput?.value || '',
//                 role: roleInput?.value || '',
//                 image: imageInput?.value || ''
//             }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })

//         const data = await response.json()
//         console.log(data)

//         if (response.ok) {
//             alert('Registration Successful!')
//             window.location.href = '/src/login.html'
//         } else {
//             alert(data.message || 'Registration Failed')
//         }
//     })
// }

// if (loginForm) {
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault()

//         if (!emailInput?.value || !passwordInput?.value) {
//             return alert('Please enter both email and password')
//         }

//         const response = await fetch('http://localhost:8000/api/v1/user/login', {
//             method: 'POST',
//             body: JSON.stringify({
//                 email: emailInput.value,
//                 password: passwordInput.value
//             }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })

//         const data = await response.json()
//         console.log(data)

//         if (response.ok) {
//             localStorage.setItem('token', data.token)
//             alert(data.message || 'User logged in successfully')
//             window.location.href = '/src/home.html'
//         } else {
//             alert(data.message || data.error?.message || 'Login failed')
//         }
//     })
// }

