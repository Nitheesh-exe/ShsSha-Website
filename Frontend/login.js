document.addEventListener("DOMContentLoaded", () => {
    const loginContent = document.querySelector(".login-content");
    const loginHeading = loginContent?.querySelector(".login-heading");
    const formsContainer = loginContent?.querySelector(".login-forms");
    const customerLoginCard = loginContent?.querySelector(".login-customer-card");
    const authButtons = document.querySelectorAll("[data-auth-mode]");
    const loginForm = document.querySelector('[data-auth-panel="login"]');
    const registerForm = document.querySelector('[data-auth-panel="register"]');

    function showAccountDetails() {
        if (!loginContent || !formsContainer) return;

        loginHeading.hidden = true;
        formsContainer.hidden = true;

        let accountDetails = loginContent.querySelector("[data-account-details]");
        accountDetails.hidden = false;
        accountDetails.replaceChildren();

        const label = document.createElement("span");
        label.className = "login-label";
        label.textContent = "CUSTOMER";

        const heading = document.createElement("h3");
        heading.id = "account-details-title";
        heading.textContent = "Account Details";

        const welcome = document.createElement("p");
        const userName = localStorage.getItem("userName") || "Customer";
        welcome.textContent = `Welcome back, ${userName}!`;

        const email = document.createElement("p");
        email.className = "account-email";
        email.textContent = localStorage.getItem("userEmail") || "Email unavailable";

        let adminLink = loginContent.querySelector("[data-account-admin-link]");
        if (!adminLink) {
            adminLink = document.createElement("a");
            adminLink.className = "button button-admin account-admin-link";
            adminLink.href = "admin-login.html";
            adminLink.dataset.accountAdminLink = "";
            adminLink.textContent = "Admin login";
        }

        const signOutButton = document.createElement("button");
        signOutButton.className = "button button-primary button-block";
        signOutButton.type = "button";
        signOutButton.textContent = "Sign Out";
        signOutButton.addEventListener("click", () => {
            localStorage.clear();
            window.location.reload();
        });

        accountDetails.append(label, heading, welcome, email, signOutButton);
        accountDetails.insertAdjacentElement("afterend", adminLink);
    }

    if (customerLoginCard && localStorage.getItem("authToken") !== null) {
        showAccountDetails();
        return;
    }

    if (formsContainer) formsContainer.hidden = false;
    if (loginHeading) loginHeading.hidden = false;

    authButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedMode = button.dataset.authMode;
            authButtons.forEach((option) => {
                const isSelected = option === button;
                option.classList.toggle("is-active", isSelected);
                option.setAttribute("aria-pressed", String(isSelected));
            });
            document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
                panel.hidden = panel.dataset.authPanel !== selectedMode;
            });
        });
    });

    registerForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = registerForm.querySelector("[data-login-status]");
        const name = registerForm.elements.namedItem("name").value;
        const email = registerForm.elements.namedItem("email").value;
        const password = registerForm.elements.namedItem("password").value;
        const confirmPassword = registerForm.elements.namedItem("confirmPassword").value;

        if (password !== confirmPassword) {
            status.textContent = "Passwords do not match.";
            status.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            if (!response.ok) throw new Error("Registration failed");
            status.textContent = "Registration successful! You can now sign in.";
            status.style.color = "green";
            registerForm.reset();
        } catch {
            status.textContent = "Error: Could not connect to server.";
            status.style.color = "red";
        }
    });

    loginForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = loginForm.querySelector("[data-login-status]");
        const username = loginForm.elements.namedItem("email").value;
        const password = loginForm.elements.namedItem("password").value;
        const credentials = btoa(`${username}:${password}`);

        fetch("http://localhost:8080/api/user", {
            method: "GET",
            headers: { Authorization: `Basic ${credentials}` }
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            return response.json();
        })
            .then((userData) => {
            localStorage.setItem("authToken", `Basic ${credentials}`);
            localStorage.setItem("userName", userData.name);
            localStorage.setItem("userEmail", userData.email);
            showAccountDetails();
        })
            .catch(() => {
            status.textContent = "Invalid credentials or could not connect.";
            status.style.color = "red";
        });
    });

    document.querySelector('[data-login-role="admin"]')?.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.assign("admin-dashboard.html");
    });
});