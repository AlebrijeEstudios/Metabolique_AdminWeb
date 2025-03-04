const apiKey = import.meta.env.VITE_API_KEY;
const apiUrlTest = import.meta.env.VITE_API_URL_TEST;
const apiUrl = import.meta.env.VITE_API_URL;

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Por favor, completa todos los campos antes de continuar.");
            return; 
        }

        const loginData = { username, password };
        console.log("Datos enviados:", loginData);

        try { 
            const response = await fetch(`${apiUrlTest}/api/admin/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Metabolique_API_KEY": `${apiKey}`,
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error("Error en la autenticación. Verifica tus credenciales.");
            }

            const data = await response.json();
            
            if (!data.auth || !data.auth.doctorID || !data.auth.accessToken) {
                throw new Error("Respuesta de autenticación inválida.");
            }

            const doctorID = data.auth.doctorID;
            const accessToken = data.auth.accessToken;

            localStorage.setItem("doctorID", doctorID);
            localStorage.setItem("accessToken", accessToken);

            window.location.href = `./pages/Patients.html`;

        } catch (error) {
            console.error("Error:", error);
            alert("Error al iniciar sesión. Verifica tus credenciales.");
        }
    });
});
