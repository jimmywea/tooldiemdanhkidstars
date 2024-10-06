import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js";

// Thêm học sinh mới
async function addNewStudent() {
    const studentName = document.getElementById('newStudentName').value;
    const selectedCourses = [];
    document.querySelectorAll('#newStudentCourses input[type="checkbox"]:checked').forEach((checkbox) => {
        selectedCourses.push(checkbox.value);
    });

    if (studentName === "" || selectedCourses.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học!");
        return;
    }

    try {
        await addDoc(collection(db, "students"), {
            name: studentName,
            classes: selectedCourses
        });
        alert('Thêm học sinh thành công!');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Gợi ý tên học sinh khi điểm danh
async function suggestStudents() {
    const studentInput = document.getElementById('studentName').value.toLowerCase();
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = "";

    if (studentInput.length < 2) return; // Bắt đầu gợi ý khi nhập từ 2 ký tự trở lên

    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        querySnapshot.forEach((doc) => {
            const studentName = doc.data().name;
            if (studentName.toLowerCase().includes(studentInput)) {
                const li = document.createElement('li');
                li.textContent = studentName;
                li.onclick = () => {
                    document.getElementById('studentName').value = studentName;
                    suggestionsList.innerHTML = "";
                };
                suggestionsList.appendChild(li);
            }
        });
    } catch (e) {
        console.error("Error getting documents: ", e);
    }
}

// Điểm danh học sinh
async function markAttendance() {
    const studentName = document.getElementById('studentName').value;
    const selectedCourses = [];
    document.querySelectorAll('#courseSelect input[type="checkbox"]:checked').forEach((checkbox) => {
        selectedCourses.push(checkbox.value);
    });

    if (studentName === "" || selectedCourses.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học!");
        return;
    }

    try {
        await addDoc(collection(db, "attendance"), {
            name: studentName,
            courses: selectedCourses,
            timestamp: new Date()
        });
        alert('Điểm danh thành công!');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export { addNewStudent, suggestStudents, markAttendance };
