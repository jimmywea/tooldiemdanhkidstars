import { db } from "./firebase-config.js";
import {
    collection, addDoc, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value.trim();
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked"))
                         .map(input => input.value);

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), { name, classes });
            alert("Thêm học sinh thành công!");
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value.trim();
    const classes = Array.from(document.querySelectorAll("#classesAttendanceSelection input:checked"))
                         .map(input => input.value);
    const date = new Date();

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), { name, classes, date: date.toISOString() });
            alert("Điểm danh thành công!");
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

document.getElementById("queryAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    if (name) {
        try {
            let q = query(collection(db, "attendance"), where("name", "==", name));

            const querySnapshot = await getDocs(q);
            let results = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const attendanceDate = new Date(data.date);

                if (startDate && endDate) {
                    const startDateTime = new Date(`${startDate}T${startTime || "00:00"}`);
                    const endDateTime = new Date(`${endDate}T${endTime || "23:59"}`);

                    if (attendanceDate >= startDateTime && attendanceDate <= endDateTime) {
                        results.push(`${data.name} - ${data.classes.join(", ")} - ${attendanceDate.toLocaleString()}`);
                    }
                } else {
                    results.push(`${data.name} - ${data.classes.join(", ")} - ${attendanceDate.toLocaleString()}`);
                }
            });

            document.getElementById("attendanceResult").innerHTML = results.join("<br>") + `<br>Tổng số buổi đã điểm danh: ${results.length}`;
        } catch (e) {
            console.error("Lỗi khi truy vấn: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để truy vấn.");
    }
});
