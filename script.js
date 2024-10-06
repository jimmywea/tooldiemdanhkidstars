import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const addStudentButton = document.getElementById('addStudentButton');
    const markAttendanceButton = document.getElementById('markAttendanceButton');
    const queryAttendanceButton = document.getElementById('queryAttendanceButton');

    addStudentButton.addEventListener('click', async () => {
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
    });

    markAttendanceButton.addEventListener('click', async () => {
        const name = document.getElementById('attendanceStudentName').value;
        
        if (name) {
            try {
                await addDoc(collection(db, "attendance"), {
                    name: name,
                    date: new Date().toISOString()
                });
                alert("Điểm danh thành công!");
            } catch (e) {
                console.error("Lỗi khi điểm danh: ", e);
            }
        } else {
            alert("Vui lòng nhập tên học sinh để điểm danh.");
        }
    });

    queryAttendanceButton.addEventListener('click', async () => {
        const name = document.getElementById('queryStudentName').value;
        if (name) {
            const q = query(collection(db, "attendance"), where("name", "==", name));
            const querySnapshot = await getDocs(q);
            let result = "";
            querySnapshot.forEach((doc) => {
                result += `Ngày điểm danh: ${doc.data().date}<br>`;
            });
            document.getElementById('attendanceResult').innerHTML = result || "Không có dữ liệu điểm danh.";
        } else {
            alert("Vui lòng nhập tên học sinh để truy vấn.");
        }
    });
});
