// const loginForm = document.getElementById('loginForm')
// const emailInput = document.getElementById('email')
// const passwordInput = document.getElementById('password')

// if (loginForm) {
//     loginForm.addEventListener('submit', async (event) => {
//         event.preventDefault()

//         const email = emailInput.value.trim()
//         const password = passwordInput.value

//         if (!email || !password) {
//             return alert('Please enter both email and password.')
//         }

//         const response = await fetch('http://localhost:8000/api/v1/user/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ email, password })
//         })

//         const data = await response.json()
//         console.log(data)

//         if (!response.ok) {
//             return alert(data.message || data.error?.message || 'Login failed. Please try again.')
//         }

//         localStorage.setItem('token', data.token)
//         alert(data.message || 'Login successful!')
//         window.location.href = './home.html'
//     })
// }