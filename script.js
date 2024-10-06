import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Thêm học sinh mới
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value;
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

// Điểm danh học sinh
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value;

    if (name) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                date: new Date().toISOString()
            });
            alert("Điểm danh thành công cho học sinh!");
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh.");
    }
});

// Truy vấn lịch sử điểm danh
document.getElementById("queryAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value;

    if (name) {
        try {
            const q = query(collection(db, "attendance"), where("name", "==", name));
            const querySnapshot = await getDocs(q);

            let resultHTML = `<h3>Kết quả truy vấn cho học sinh: ${name}</h3>`;
            querySnapshot.forEach((doc) => {
                resultHTML += `<p>Ngày điểm danh: ${doc.data().date}</p>`;
            });

            document.getElementById("attendanceResult").innerHTML = resultHTML;
        } catch (e) {
            console.error("Lỗi khi truy vấn lịch sử điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để truy vấn.");
    }
});
