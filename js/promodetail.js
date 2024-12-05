const api_key = "2e59b78b-486a-4f87-9164-89bd250fe84c";
const url_api = "http://146.59.242.125:3009";
const container = document.querySelector("#container");
const newStudentBtn = document.getElementById('newStudentBtn');
const newForm = document.getElementById('newForm');

function getPromoId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    return id;
}

async function getPromoStudents() {
    try {
        const response = await fetch(url_api + "/promos/" + getPromoId(), {
            method: "GET",
            headers: {
                authorization: "Bearer " + api_key
            }
        });
        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }
        const data = await response.json();
        console.log("Données reçues:", data.students);

        displayStudents(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
    }
}
getPromoStudents();

function displayStudents(data) {
    container.innerHTML = '';
    const students = data.students;

    students.forEach(function (student) {
        let article = document.createElement("article");
        article.className = "student-container";
        article.innerHTML =
            "<p>Âge : " + student.age + "</p>" +
            "<p>Prénom : " + student.firstName + "</p>" +
            "<p>Nom : " + student.lastName + "</p>" +
            "<div class='button-container'>" +
            "<button class='modifyBtn'>Modifier</button>" +
            "<button class='deleteBtn'>Supprimer</button></div>" +
            "<form class='modifyForm' style='display:none;'>" +
            "<input type='number' class='modifyAge' value='" + student.age + "' placeholder='Âge'>" +
            "<input type='text' class='modifyFirstName' value='" + student.firstName + "' placeholder='Prénom'>" +
            "<input type='text' class='modifyLastName' value='" + student.lastName + "' placeholder='Nom'>" +
            "<button type='submit'>Enregistrer</button>" +
            "</form>";

        container.appendChild(article);

   
        article.querySelector('.deleteBtn').addEventListener('click', function () {
            deleteStudents(getPromoId(), student._id); 
        });

        article.querySelector('.modifyBtn').addEventListener('click', function () {
            article.querySelector('.modifyForm').style.display = 'block';
        });

        article.querySelector('.modifyForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const updatedData = {
                age: article.querySelector('.modifyAge').value,
                firstName: article.querySelector('.modifyFirstName').value,
                lastName: article.querySelector('.modifyLastName').value
            };
            modifyPromoApi(getPromoId(), student._id, updatedData);
        });
    });
}

async function deleteStudents(promoid, studentId) {
    try {
        const response = await fetch(url_api + "/promos/" + promoid + "/students/" + studentId, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + api_key
            }
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la promo');
        }
        await getPromoStudents();
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
    }
}


async function modifyPromoApi(promoId, studentId, updatedData) {
    try {
        const response = await fetch(url_api + "/promos/" + promoId + "/students/" + studentId, {
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
        await getPromoStudents();
    } catch (error) {
        console.error("Erreur lors de la modification:", error);
    }
}

newStudentBtn.addEventListener('click', function () {
    newForm.style.display = 'block';
});

newForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const firstname = document.getElementById('firstName').value;
    const lastname = document.getElementById('lastName').value;
    const age = document.getElementById('Age').value;

    const bodyData = {
        firstName: firstname,
        lastName: lastname,
        age: age, 
    };

    console.log("Données à envoyer:", bodyData);

    try {
       
        const response = await fetch(url_api + "/promos/" + getPromoId() + "/students", { 
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) { 
            throw new Error('Erreur lors de la création de l\'étudiant');
        }

        console.log("Nouvel étudiant créé");
        await getPromoStudents(); 
        newForm.reset(); 
        newForm.style.display = 'none'; 
    } catch (error) {
        console.error("Erreur détaillée:", error);
    }
});