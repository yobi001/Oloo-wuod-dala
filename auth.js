// Grab DOM elements
const signupForm = document.getElementById("signup-form");
const signinForm = document.getElementById("login-form");
const toggleAuth = document.getElementById("toggle-auth");
const formTitle = document.getElementById("form-title");
const messageArea = document.getElementById("message-area");

// --- SIGN UP SUBMISSION ---
signupForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;


    // Password Validation Check
    const validationMessage = validatePassword(password);
    if (validationMessage) {
        messageArea.textContent = `❌ ${validationMessage}`;
        messageArea.style.color = "red";
        return; // Stop execution if password is weak
    }
    //send data to the server side by using the port number 3000
    const result = await postData("http://localhost:3000/api/auth/signup", { username, email, password });

    if (result && result.success) {
        messageArea.textContent = `✅ Success! redirecting to the dashboard.. `;
        messageArea.style.color = "green";
        signupForm.reset();

        // Automatically switch to login form
        toggleAuth.click();
        //Redirect to the dashboard after short delay
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    } else {
        messageArea.textContent = `❌ ${result.message || "Login failed"}`;
        messageArea.style.color = "red";
    }



});
// --- SIGNIN SUBMISSION ---
signinForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        messageArea.textContent = " Email and password are required.";
        messageArea.style.color = "red";
        return;
    }

    const result = await postData("http://localhost:3000/api/auth/signin", { email, password });

    if (result && result.success) {
        messageArea.textContent = `loginin successful! Redirecting to dashboard...`;
        messageArea.style.color = "green";
        signinForm.reset();

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    } else {
        messageArea.textContent = ` ${result.message || "login failed"}`;
        messageArea.style.color = "red";
    }
});

// --- TOGGLE BETWEEN SIGNUP & SIGNIN ---
toggleAuth.addEventListener("click", () => {
    if (signupForm.style.display !== "none") {
        signupForm.style.display = "none";
        signinForm.style.display = "block";
        formTitle.textContent = "Sign In";
        toggleAuth.textContent = "Don’t have an account? Create one";
    } else {
        signupForm.style.display = "block";
        signinForm.style.display = "none";
        formTitle.textContent = "Create Account";
        toggleAuth.textContent = "Already have an account? Sign In";
    }
});

// --- PASSWORD VALIDATION FUNCTION ---
function validatePassword(password) {
    if (password.length < 10) return "Password must be at least 10 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter (a-z).";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number (0-9).";
    return null;
}

// --- Helper: Post Data to Server ---
async function postData(url = "", data = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 10 seconds

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return { success: false, message: `Server error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        clearTimeout(timeout);

        if (err.name === "AbortError") {
            return { success: false, message: "Request timed out. Please try again." };
        }

        console.error("Fetch failed:", err.message);
        alert("Fetch failed: " + err.message);
        return { success: false, message: "" };

    }
}