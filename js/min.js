
var user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : [];

function localStorageUpdate() {
    localStorage.setItem("user", JSON.stringify(user));
}

document.getElementById('showRegister').addEventListener("click",showRegister);
function showRegister() {
    document.getElementById('registerForm').classList.remove('d-none');
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('resultPage').classList.add('d-none');
    document.getElementById('registerError').classList.add('d-none');
}

 document.getElementById('showLogin').addEventListener("click",showLogin);
function showLogin() {
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('loginForm').classList.remove('d-none');
    document.getElementById('resultPage').classList.add('d-none');
    document.getElementById('loginError').classList.add('d-none');
}

document.getElementById('register').addEventListener("click",register);
function register() {
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var imageInput = document.getElementById("image");
    var errorElement = document.getElementById("registerError");

    var registerInput = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        isLoggedIn: false,
        image: ''
    };

    if (!registerInput.name || !registerInput.email || !registerInput.password) {
        errorElement.textContent = "All fields are required.";
        errorElement.classList.remove("d-none");
        return;
    }

    if (!validateName(registerInput.name)) {
        errorElement.textContent = "Please enter a name with at least 4 characters.";
        errorElement.classList.remove("d-none");
        return;
    }

    if (!validateEmail(registerInput.email)) {
        errorElement.textContent = "Email is not valid.";
        errorElement.classList.remove("d-none");
        return;
    }

    if (!validatePassword(registerInput.password)) {
        errorElement.textContent = "The password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        errorElement.classList.remove("d-none");
        return;
    }

    var emails = user.map(existingUser => existingUser.email);

    if (emails.includes(registerInput.email)) {
        errorElement.textContent = "Email is already registered. Please use a different email.";
        errorElement.classList.remove("d-none");
        return;
    }

    if (imageInput.files && imageInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            registerInput.image = e.target.result; 
            user.push(registerInput);
            localStorageUpdate();
            errorElement.classList.add("d-none");
            alert("Registration successful! Redirecting to login page.");
            clearRegisterForm();
            showLogin();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        user.push(registerInput);
        localStorageUpdate();
        errorElement.classList.add("d-none");
        alert("Registration successful! Redirecting to login page.");
        clearRegisterForm();
        showLogin();
    }
}

document.getElementById('login').addEventListener("click",login);
function login() {
    const emailLogin = document.getElementById("loginEmail").value.trim();
    const passwordLogin = document.getElementById("loginPassword").value.trim();
    const errorElementLogin = document.getElementById("loginError");

    if (!emailLogin || !passwordLogin) {
        errorElementLogin.textContent = "All fields are required.";
        errorElementLogin.classList.remove("d-none");
        return;
    }

    const userData = user.find(u => u.email === emailLogin);

    if (!userData) {
        errorElementLogin.textContent = "Email is not registered.";
        errorElementLogin.classList.remove("d-none");
        return;
    }

    if (userData.password !== passwordLogin) {
        errorElementLogin.textContent = "Password is incorrect.";
        errorElementLogin.classList.remove("d-none");
        return;
    }

    userData.isLoggedIn = true;
    localStorageUpdate();
    errorElementLogin.classList.add("d-none");
    clearLoginForm();
    showResultPage(userData.name);
}

function showResultPage(userName) {
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('resultPage').classList.remove('d-none');
    document.getElementById('navLogin').classList.remove('d-none');
    document.getElementById('userName').textContent = userName;

    var currentUser = user.find(u => u.name === userName);
    if (currentUser && currentUser.image) {
        var userImage = document.getElementById('userImage');
        userImage.src = currentUser.image; 
        userImage.classList.remove('d-none');
    } else {
        document.getElementById('userImage').classList.add('d-none');
    }
}

function clearRegisterForm() {
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
    document.getElementById("image").value = '';
    document.getElementById('registerError').classList.add('d-none');
}

function clearLoginForm() {
    document.getElementById("loginEmail").value = '';
    document.getElementById("loginPassword").value = '';
    document.getElementById('loginError').classList.add('d-none');
}

var logoutNav=document.getElementById('navLogin');
logoutNav.addEventListener("click",logout);
function logout() {
    logoutNav.classList.add('d-none');
    user.forEach(u => u.isLoggedIn = false);
    localStorageUpdate();
    showLogin();
}

function validateName(name) {
    return name.length >= 4;
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePassword(password) {
    const passwordPattern = /^[0-9]{8,}$/;
    return passwordPattern.test(password);
}
window.onload = function() {
    const userData = localStorage.getItem("user");
    if (userData) {
        user = JSON.parse(userData);
    }

    const currentUser = user.find(u => u.isLoggedIn);
    if (currentUser) {
        showResultPage(currentUser.name);
    } else {
        showRegister();
    }
};
