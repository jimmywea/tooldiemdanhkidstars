import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Hàm tiện ích
const getElement = (id) => document.getElementById(id);
const getSelectedValues = (selector) => 
    Array.from(document.querySelectorAll(selector)).filter(el => el.checked).map(el => el.value);

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

// Thêm học sinh
getElement("addStudentButton").addEventListener("click", async () => {
    const name = getElement("newStudentName").value.trim();
    const classes = getSelectedValues("#classesSelection input");

    if (name && classes.length > 0) {
        await addDoc(collection(db, "students"), { name, classes });
        alert("Học sinh đã được thêm thành công!");
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
});

// Điểm danh học sinh
getElement("markAttendanceButton").addEventListener("click", async () => {
    const name = getElement("attendanceStudentName").value.trim();
    const date = getElement("attendanceDate").value;
    const time = getElement("attendanceTime").value;
    const classes = getSelectedValues("#classesAttendanceSelection input");

    if (name && date && time && classes.length > 0) {
        await addDoc(collection(db, "attendance"), {
            name,
            date: Timestamp.fromDate(new Date(`${date}T${time}`)),
            classes
        });
        alert("Điểm danh thành công!");
    } else {
        alert("Vui lòng nhập tên, ngày, giờ và chọn ít nhất một lớp.");
    }
});

// Gợi ý tìm kiếm tên học sinh
getElement("attendanceStudentName").addEventListener("input", debounce(async () => {
    const queryText = getElement("attendanceStudentName").value.toLowerCase().trim();
    if (queryText.length > 1) {
        const q = query(collection(db, "students"), where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
        const querySnapshot = await getDocs(q);
        const suggestions = querySnapshot.docs.map(doc => doc.data().name);

        const suggestionsList = getElement("suggestionsListAttendance");
        suggestionsList.innerHTML = "";
        suggestions.forEach(name => {
            const div = document.createElement("div");
            div.textContent = name;
            div.addEventListener("click", () => {
                getElement("attendanceStudentName").value = name;
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(div);
        });
    }
}, 300));
