import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    startAt,
    endAt,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Thêm học sinh mới
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const studentName = document.getElementById("newStudentName").value;
    const selectedClasses = Array.from(
        document.querySelectorAll("#classesSelection input:checked")
    ).map((checkbox) => checkbox.value);

    if (studentName && selectedClasses.length > 0) {
        await addDoc(collection(db, "students"), {
            name: studentName,
            classes: selectedClasses,
        });
        alert("Học sinh đã được thêm thành công!");
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp học.");
    }
});

// Điểm danh học sinh
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const studentName = document.getElementById("attendanceStudentName").value;
    const selectedClasses = Array.from(
        document.querySelectorAll("#classesAttendanceSelection input:checked")
    ).map((checkbox) => checkbox.value);
    
    if (studentName && selectedClasses.length > 0) {
        await addDoc(collection(db, "attendance"), {
            name: studentName,
            classes: selectedClasses,
            date: new Date().toISOString(),
        });
        alert("Điểm danh thành công!");
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp học để điểm danh.");
    }
});

// Gợi ý tên khi nhập
async function setupAutoComplete(inputId, suggestionsListId) {
    const input = document.getElementById(inputId);
    const suggestionsList = document.getElementById(suggestionsListId);

    input.addEventListener("input", async () => {
        const querySnapshot = await getDocs(collection(db, "students"));
        const suggestions = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().name.toLowerCase().includes(input.value.toLowerCase())) {
                suggestions.push(doc.data().name);
            }
        });

        suggestionsList.innerHTML = "";
        suggestions.forEach((suggestion) => {
            const div = document.createElement("div");
            div.textContent = suggestion;
            div.addEventListener("click", () => {
                input.value = suggestion;
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(div);
        });
    });
}

setupAutoComplete("attendanceStudentName", "suggestionsListAttendance");
setupAutoComplete("queryStudentName", "suggestionsListQuery");

