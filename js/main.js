const api_key = "2e59b78b-486a-4f87-9164-89bd250fe84c";
const url_api = "http://146.59.242.125:3009";

const schoolname = document.querySelector("#schoolname");
const container = document.querySelector("#container");
const newClassBtn = document.getElementById('newClassBtn');
const newClassForm = document.getElementById('newClassForm');

async function getPromo() {
    try {
        const response = await fetch(url_api + "/promos", {
            method: "GET",
            headers: {
                authorization: "Bearer " + api_key
            }
        });
        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }
        const data = await response.json();
        console.log("Données reçues:", data);
        displayPromo(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des promos:", error);
    }
}

function displayPromo(data) {
    container.innerHTML = '';
    data.forEach(function (element) {
        let article = document.createElement("article");
        article.className = "promo-container";
        article.innerHTML =  
            "<p>" + element.name + "</p>" +
            "<p>Date de début: " + element.startDate.split("T")[0] + "</p>" +
            "<p>Date de fin: " + element.endDate.split("T")[0] + "</p>" +
            "<p>Élèves: " + element.students.length + "</p>" +
            "<div class='button-container'>" +
            "<button class='modifyBtn'>Modifier</button>" +
            "<button class='deleteBtn'>Supprimer</button>" +
            "<a href='./pages/promodétails.html?id="+element._id+"' class='details'>Détails</a>"+
            "</div>" +
            "<form class='modifyForm' style='display:none;'>" +
            "<input type='text' class='modifyName' value='" + element.name + "'>" +
            "<input type='date' class='modifyStartDate' value='" + element.startDate + "'>" +
            "<input type='date' class='modifyEndDate' value='" + element.endDate + "'>" +
            "<button type='submit'>Enregistrer</button>" +
            "</form>";

        container.appendChild(article);

        article.querySelector('.deleteBtn').addEventListener('click', function () {
            deletePromoApi(element._id);
        });

        article.querySelector('.modifyBtn').addEventListener('click', function () {
            article.querySelector('.modifyForm').style.display = 'block';
        });

        article.querySelector('.modifyForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const updatedData = {
                name: article.querySelector('.modifyName').value,
                startDate: article.querySelector('.modifyStartDate').value,
                endDate: article.querySelector('.modifyEndDate').value
            };
            modifyPromoApi(element._id, updatedData);
        });
    });
}

async function deletePromoApi(promoId) {
    try {
        const response = await fetch(url_api + "/promos/" + promoId, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + api_key
            }
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la promo');
        }
        await getPromo();
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
    }
}

newClassBtn.addEventListener('click', function () {
    newClassForm.style.display = newClassForm.style.display === 'none' ? 'block' : 'none';
});

newClassForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const className = document.getElementById('className').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const bodyData = {
        name: className,
        startDate: startDate,
        endDate: endDate,
        students: []
    };

    console.log("Données à envoyer:", bodyData);

    try {
        const response = await fetch(url_api + "/promos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key
            },
            body: JSON.stringify(bodyData)
        });




        console.log("Nouvelle classe créée");
        await getPromo();
        newClassForm.reset();
        newClassForm.style.display = 'none';
    } catch (error) {
        console.error("Erreur détaillée:", error);
    }
});

async function modifyPromoApi(promoId, updatedData) {
    try {
        const response = await fetch(url_api + "/promos/" + promoId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key
            }, 
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la modification de la promo');
        }
        await getPromo();
    } catch (error) {
        console.error("Erreur lors de la modification:", error);
    }
}



getPromo();