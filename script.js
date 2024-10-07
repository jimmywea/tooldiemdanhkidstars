import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value;
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(el => el.value);
    
    if (name && classes.length > 0) {
        await addDoc(collection(db, "students"), { name, classes });
        alert("Học sinh đã được thêm thành công!");
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
});

// Điểm danh học sinh với ngày và giờ tùy chọn
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value;
    const date = document.getElementById("attendanceDate").value;
    const time = document.getElementById("attendanceTime").value;
    const classes = Array.from(document.querySelectorAll("#classesAttendanceSelection input:checked")).map(el => el.value);

    if (name && date && time && classes.length > 0) {
        await addDoc(collection(db, "attendance"), { name, date, time, classes });
        alert("Điểm danh thành công!");
    } else {
        alert("Vui lòng nhập tên, ngày, giờ và chọn ít nhất một lớp.");
    }
});

// Gợi ý tên học sinh khi nhập
document.getElementById("attendanceStudentName").addEventListener("input", async () => {
    const queryText = document.getElementById("attendanceStudentName").value.toLowerCase();
    if (queryText.length > 1) {
        const q = query(collection(db, "students"), where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
        const querySnapshot = await getDocs(q);
        const suggestions = querySnapshot.docs.map(doc => doc.data().name);

        const suggestionsList = document.getElementById("suggestionsListAttendance");
        suggestionsList.innerHTML = "";
        suggestions.forEach(name => {
            const div = document.createElement("div");
            div.textContent = name;
            div.addEventListener("click", () => {
                document.getElementById("attendanceStudentName").value = name;
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(div);
        });
    }
});
