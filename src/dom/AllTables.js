const apiKey = import.meta.env.VITE_API_KEY;
const apiUrlTest = import.meta.env.VITE_API_URL_TEST;
const apiUrl = import.meta.env.VITE_API_URL;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accountID = urlParams.get('accountID');
    localStorage.setItem("accountID", accountID);
    const accessToken = localStorage.getItem('accessToken');
    let currentPage = 1; 

    try {
        const response = await fetch(`${apiUrlTest}/api/admin/feedings?accountID=${accountID}&page=${currentPage}`, {
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

        const feedingsUser = await response.json();
        console.log("Alimentacion:", feedingsUser.feedings);

        renderFeedingTable(feedingsUser.feedings);

        const prevPageButton = document.querySelector("#prevPage");
        const nextPageButton = document.querySelector("#nextPage");

        prevPageButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--; 
                fetchFeedings(currentPage); 
            }
        });

        nextPageButton.addEventListener("click", () => {
            currentPage++; 
            fetchFeedings(currentPage); 
        });

        const exportButton = document.getElementById("exportButton");
        if (exportButton) {
            exportButton.addEventListener("click", async function() {
                await exportCSV();
            });
        } else {
            console.error("El botón exportButton no se encontró en el DOM.");
        }

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
        alert("Error al cargar la lista de pacientes.");
    }
});

async function fetchFeedings(page) {
    const accountID = localStorage.getItem('accountID');
    const accessToken = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch(`${apiUrlTest}/api/admin/feedings?accountID=${accountID}&page=${page}`, {
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

        const feedingsUser = await response.json();
        console.log("Alimentacion:", feedingsUser.feedings);
        renderFeedingTable(feedingsUser.feedings);
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderFeedingTable(feedings) {
    const tableBody = document.querySelector("#feedings-table-body");
    tableBody.innerHTML = ""; 

    feedings.forEach((feeding) => {
        const dateFormatted = new Date(feeding.userFeedDate).toLocaleDateString("es-ES");

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="padding: 10px; border: 1px solid #ddd;">${feeding.dailyMeal|| "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${dateFormatted|| "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${feeding.userFeedTime|| "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${feeding.satietyLevel|| "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${feeding.emotionsLinked|| "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${feeding.totalCalories|| "No disponible"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
                    ${feeding.saucerPictureUrl ? 
                    `<a href="${feeding.saucerPictureUrl}" target="_blank">Foto</a>` 
                    : "No disponible"}
            </td>
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

async function exportCSV() {

    const accountID = localStorage.getItem('accountID');
    const accessToken = localStorage.getItem('accessToken');

    fetch(`${apiUrlTest}/api/admin/feedings/export-all-feedings?accountID=${accountID}`, {
        method: "GET",
        headers: {
            "Content-Type": "text/csv",
            "Authorization": `Bearer ${accessToken}`,
            "Metabolique_API_KEY": `${apiKey}`,
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al descargar el archivo.");

        const disposition = response.headers.get("Content-Disposition");
        let filename = "datos_exportados.csv"; // Nombre por defecto

        if (disposition && disposition.includes("filename=")) {
            const matches = disposition.match(/filename="([^"]+)"/);
            if (matches && matches.length > 1) {
                filename = matches[1]; 
            }
        }

        return response.blob().then(blob => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Usar el nombre asignado por el servidor
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error("Error:", error));
};

async function logout() {
    localStorage.clear(); 
    history.replaceState(null, null, "../index.html");
    window.location.href = "../index.html"; 
}