import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL56ek...",
    authDomain: "kidstars-7434d.firebaseapp.com",
    projectId: "kidstars-7434d",
    storageBucket: "kidstars-7434d.appspot.com",
    messagingSenderId: "616350873520",
    appId: "1:616350873520:web:9d765d0bf5a483fa964875",
    measurementId: "G-FJMK0F1LRN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const addStudentButton = document.getElementById("addStudentButton");
    const markAttendanceButton = document.getElementById("markAttendanceButton");
    const queryStudentButton = document.getElementById("queryStudentButton");
    const queryTimeButton = document.getElementById("queryTimeButton");

    addStudentButton.addEventListener("click", addStudent);
    markAttendanceButton.addEventListener("click", markAttendance);
    queryStudentButton.addEventListener("click", queryAttendanceByStudent);
    queryTimeButton.addEventListener("click", queryAttendanceByTime);

    const attendanceStudentNameInput = document.getElementById("attendanceStudentName");
    const queryStudentNameInput = document.getElementById("queryStudentName");

    if (attendanceStudentNameInput) {
        attendanceStudentNameInput.addEventListener("input", async () => {
            const query = attendanceStudentNameInput.value.toLowerCase();
            const suggestions = await getStudentSuggestions(query);
            updateSuggestionsList("suggestionsListAttendance", suggestions);
        });
    }

    if (queryStudentNameInput) {
        queryStudentNameInput.addEventListener("input", async () => {
            const query = queryStudentNameInput.value.toLowerCase();
            const suggestions = await getStudentSuggestions(query);
            updateSuggestionsList("suggestionsListQuery", suggestions);
        });
    }
});

async function addStudent() {
    const newStudentName = document.getElementById("newStudentName").value;
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(cb => cb.value);
    if (newStudentName && classes.length > 0) {
        await addDoc(collection(db, "students"), { name: newStudentName, classes });
        alert("Học sinh đã được thêm!");
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một lớp!");
    }
}

async function markAttendance() {
    const studentName = document.getElementById("attendanceStudentName").value;
    const classes = Array.from(document.querySelectorAll("#classesAttendanceSelection input:checked")).map(cb => cb.value);
    if (studentName && classes.length > 0) {
        await addDoc(collection(db, "attendance"), { name: studentName, classes, date: new Date().toISOString() });
        alert("Điểm danh thành công!");
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một lớp để điểm danh!");
    }
}

async function getStudentSuggestions(query) {
    const snapshot = await getDocs(collection(db, "students"));
    let suggestions = [];
    snapshot.forEach((doc) => {
        const studentName = doc.data().name.toLowerCase();
        if (studentName.includes(query)) {
            suggestions.push(doc.data().name);
        }
    });
    return suggestions;
}

function updateSuggestionsList(listId, suggestions) {
    const suggestionsList = document.getElementById(listId);
    if (suggestionsList) {
        suggestionsList.innerHTML = "";
        suggestions.forEach((suggestion) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "suggestion-item";
            suggestionItem.textContent = suggestion;
            suggestionsList.appendChild(suggestionItem);
            suggestionItem.addEventListener("click", () => {
                if (listId === "suggestionsListAttendance") {
                    document.getElementById("attendanceStudentName").value = suggestion;
                } else if (listId === "suggestionsListQuery") {
                    document.getElementById("queryStudentName").value = suggestion;
                }
                suggestionsList.innerHTML = "";
            });
        });
    }
}

// Implement the remaining query functions (queryAttendanceByStudent, queryAttendanceByTime)
