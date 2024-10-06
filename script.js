import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Thêm học sinh mới
window.addNewStudent = async function () {
    const name = document.getElementById("newStudentName").value;
    const selectedClasses = Array.from(document.querySelectorAll('.input-field:nth-child(2) .checkbox-list input:checked')).map(input => input.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "students"), {
                name: name,
                classes: selectedClasses
            });
            alert("Thêm học sinh thành công!");
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
    }
}

// Điểm danh học sinh
window.markAttendance = async function () {
    const name = document.getElementById("studentName").value;
    const selectedClasses = Array.from(document.querySelectorAll('.input-field:nth-child(3) .checkbox-list input:checked')).map(input => input.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                classes: selectedClasses,
                date: new Date().toISOString().split('T')[0]
            });
            alert("Điểm danh thành công!");
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
    }
}
