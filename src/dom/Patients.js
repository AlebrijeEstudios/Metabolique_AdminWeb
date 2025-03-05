import { config } from '../config.js';

document.addEventListener("DOMContentLoaded", async () => {

    const apiUrlTest = config.VITE_API_URL_TEST;
    const apiUrl = config.VITE_API_URL;
    const apiKey = config.VITE_API_KEY;

    const doctorID = localStorage.getItem('doctorID');
    const accessToken = localStorage.getItem('accessToken');
    let currentPage = 1; 

    try {
        const response = await fetch(`${apiUrlTest}/api/admin/patients?doctorID=${doctorID}&page=${currentPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Metabolique_API_KEY": `${apiKey}`,
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener la lista de pacientes");
        }

        const patients = await response.json();

        renderPatientsTable(patients.account);

        const prevPageButton = document.querySelector("#prevPage");
        const nextPageButton = document.querySelector("#nextPage");

        prevPageButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--; 
                fetchPatients(currentPage); 
            }
        });

        nextPageButton.addEventListener("click", () => {
            currentPage++;  
            fetchPatients(currentPage); 
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar la lista de pacientes.");
    }
});

async function fetchPatients(page) {
    const apiUrlTest = config.VITE_API_URL_TEST;
    const apiUrl = config.VITE_API_URL;
    const apiKey = config.VITE_API_KEY;
    const doctorID = localStorage.getItem('doctorID');
    const accessToken = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch(`${apiUrlTest}/api/admin/patients?doctorID=${doctorID}&page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Metabolique_API_KEY": `${apiKey}`,
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener la lista de pacientes");
        }

        const patients = await response.json();
    
        renderPatientsTable(patients.account);

        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", async function() {
                await logout();
            });
        } else {
            console.error("El botón logoutButton no se encontró en el DOM.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderPatientsTable(patients) {
    const tableBody = document.querySelector("#patients-table-body");
    tableBody.innerHTML = ""; 

    patients.forEach((patient) => {
        const birthDateFormatted = new Date(patient.birthDate).toLocaleDateString("es-ES");

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="AllTables.html?accountID=${patient.accountID}" style="text-decoration: none; color: inherit;">${patient.username || "No disponible"}</a>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">${patient.email || "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${birthDateFormatted || "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${patient.sex || "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${patient.stature || "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${patient.weight || "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${patient.protocolToFollow || "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Editar</button>
                    <button style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Eliminar</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function logout() {
    localStorage.clear(); 
    history.pushState(null, null, "../index.html");
    window.location.href = "../index.html";
}