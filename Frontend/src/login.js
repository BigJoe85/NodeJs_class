const loginForm = document.getElementById('loginForm')
const email = document.getElementById('email')
const password = document.getElementById('password')



loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    try {
        const response = await fetch('http://localhost:8000/api/v1/user/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value.trim(),
                password: password.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

         //Convert the response to javascript object
        const data = await response.json()

        if (response.ok) {
            alert('Login successful!')
            localStorage.setItem('token', data.token)
            window.location.href = './home.html'
        } else {
            alert(data.message || 'Unable to login')
            console.log(data.message)
        }

    } catch (error) {
        alert('Something went wrong. Please try again.')
        console.error(error)
    }
})

