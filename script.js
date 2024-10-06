import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addStudentButton").addEventListener("click", addNewStudent);
    document.getElementById("markAttendanceButton").addEventListener("click", markAttendance);
    document.getElementById("queryAttendanceButton").addEventListener("click", queryAttendance);
});

const studentCollection = collection(db, "students");
const attendanceCollection = collection(db, "attendance");

async function addNewStudent() {
    const studentName = document.getElementById("newStudentName").value;
    const selectedSubjects = Array.from(document.querySelectorAll('#subjectOptions input:checked')).map(input => input.value);

    if (studentName && selectedSubjects.length > 0) {
        try {
            await addDoc(studentCollection, {
                name: studentName,
                classes: selectedSubjects
            });
            alert("Học sinh đã được thêm thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm học sinh: ", error);
        }
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
    }
}

async function suggestStudents() {
    const input = document.getElementById("studentName").value.toLowerCase();
    const suggestionsList = document.getElementById("suggestions");

    if (input) {
        try {
            const querySnapshot = await getDocs(studentCollection);
            suggestionsList.innerHTML = "";
            querySnapshot.forEach(doc => {
                const studentName = doc.data().name.toLowerCase();
                if (studentName.includes(input)) {
                    const li = document.createElement("li");
                    li.textContent = doc.data().name;
                    li.onclick = () => {
                        document.getElementById("studentName").value = doc.data().name;
                        suggestionsList.innerHTML = "";
                    };
                    suggestionsList.appendChild(li);
                }
            });
        } catch (error) {
            console.error("Lỗi khi gợi ý học sinh: ", error);
        }
    } else {
        suggestionsList.innerHTML = "";
    }
}

async function markAttendance() {
    const studentName = document.getElementById("studentName").value;

    if (studentName) {
        try {
            await addDoc(attendanceCollection, {
                name: studentName,
                timestamp: serverTimestamp()
            });
            alert("Điểm danh thành công!");
        } catch (error) {
            console.error("Lỗi khi điểm danh: ", error);
        }
    } else {
        alert("Vui lòng nhập tên học sinh.");
    }
}
