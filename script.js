import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function () {
    const addStudentButton = document.getElementById('addStudentButton');
    const markAttendanceButton = document.getElementById('markAttendanceButton');
    const queryAttendanceButton = document.getElementById('queryAttendanceButton');

    addStudentButton.addEventListener('click', addNewStudent);
    markAttendanceButton.addEventListener('click', markAttendance);
    queryAttendanceButton.addEventListener('click', queryAttendance);

    async function addNewStudent() {
        const name = document.getElementById('newStudentName').value;
        const selectedClasses = Array.from(document.querySelectorAll('#classesSelection input[type="checkbox"]:checked'))
            .map(el => el.value);

        if (name && selectedClasses.length > 0) {
            try {
                await addDoc(collection(db, "students"), {
                    name: name,
                    classes: selectedClasses
                });
                alert("Học sinh đã được thêm thành công!");
            } catch (e) {
                console.error("Lỗi khi thêm học sinh: ", e);
            }
        } else {
            alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
        }
    }

    async function markAttendance() {
        const name = document.getElementById('attendanceStudentName').value;

        if (name) {
            try {
                await addDoc(collection(db, "attendance"), {
                    name: name,
                    date: new Date().toISOString(),
                });
                alert("Điểm danh thành công!");
            } catch (e) {
                console.error("Lỗi khi điểm danh: ", e);
            }
        } else {
            alert("Vui lòng nhập tên học sinh.");
        }
    }

    async function queryAttendance() {
        const name = document.getElementById('queryStudentName').value;

        if (name) {
            try {
                const q = query(collection(db, "attendance"), where("name", "==", name));
                const querySnapshot = await getDocs(q);
                let result = `${name} đã được điểm danh ${querySnapshot.size} lần:\n`;
                querySnapshot.forEach((doc) => {
                    result += `- ${doc.data().date}\n`;
                });
                document.getElementById('attendanceResult').innerText = result;
            } catch (e) {
                console.error("Lỗi khi truy vấn điểm danh: ", e);
            }
        } else {
            alert("Vui lòng nhập tên học sinh để truy vấn.");
        }
    }
});
