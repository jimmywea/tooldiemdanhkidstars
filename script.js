import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Hàm thêm học sinh mới
export async function addNewStudent() {
    const studentName = document.getElementById("studentName").value;
    const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked')).map(e => e.value);

    if (studentName.trim() === "" || selectedCourses.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
        return;
    }

    try {
        await addDoc(collection(db, "students"), {
            name: studentName,
            courses: selectedCourses
        });
        alert("Học sinh đã được thêm thành công!");
        document.getElementById("studentName").value = "";
        document.querySelectorAll('input[name="course"]').forEach(e => e.checked = false);
    } catch (e) {
        console.error("Lỗi khi thêm học sinh: ", e);
    }
}

// Hàm gợi ý tên học sinh khi nhập
export async function suggestStudents(inputId, suggestionBoxId) {
    const input = document.getElementById(inputId).value.toLowerCase();
    const suggestionBox = document.getElementById(suggestionBoxId);
    suggestionBox.innerHTML = "";

    if (input.trim() === "") {
        return;
    }

    try {
        const q = query(collection(db, "students"), where("name", ">=", input), where("name", "<=", input + "\uf8ff"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const listItem = document.createElement("li");
            listItem.textContent = doc.data().name;
            listItem.onclick = () => {
                document.getElementById(inputId).value = doc.data().name;
                suggestionBox.innerHTML = "";
            };
            suggestionBox.appendChild(listItem);
        });
    } catch (e) {
        console.error("Lỗi khi tìm kiếm học sinh: ", e);
    }
}

// Hàm điểm danh học sinh (ví dụ)
export async function markAttendance() {
    const studentName = document.getElementById("attendanceName").value;
    // Logic điểm danh thêm vào đây
}

// Hàm truy vấn lịch sử điểm danh (ví dụ)
export async function queryAttendance() {
    const studentName = document.getElementById("queryName").value;
    // Logic truy vấn lịch sử điểm danh thêm vào đây
}

window.addNewStudent = addNewStudent;
window.suggestStudents = suggestStudents;
window.markAttendance = markAttendance;
window.queryAttendance = queryAttendance;
