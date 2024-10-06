import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDL56ekmdndk3wd099KuJWUyogRUa3bwW8",
    authDomain: "kidstars-7434d.firebaseapp.com",
    projectId: "kidstars-7434d",
    storageBucket: "kidstars-7434d.appspot.com",
    messagingSenderId: "616350873520",
    appId: "1:616350873520:web:9d765d0bf5a483fa964875",
    measurementId: "G-FJMK0F1LRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Thêm học sinh mới
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value.trim();
    const selectedClasses = Array.from(document.querySelectorAll('#classesSelection input[type="checkbox"]:checked')).map(el => el.value);

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
    const name = document.getElementById("attendanceStudentName").value.trim();
    const selectedClasses = Array.from(document.querySelectorAll('#classesAttendanceSelection input[type="checkbox"]:checked')).map(el => el.value);

    if (name && selectedClasses.length > 0) {
        try {
            const currentDate = new Date().toISOString();
            await addDoc(collection(db, "attendance"), {
                name: name,
                classes: selectedClasses,
                date: currentDate
            });
            alert("Điểm danh thành công!");
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

// Truy vấn lịch sử điểm danh
document.getElementById("queryAttendanceButton").addEventListener("click", async () => {
    const studentName = document.getElementById("queryStudentName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    let startDateTime = null;
    let endDateTime = null;

    if (startDate && startTime) {
        startDateTime = new Date(`${startDate}T${startTime}`);
    } else if (startDate) {
        startDateTime = new Date(startDate);
    }

    if (endDate && endTime) {
        endDateTime = new Date(`${endDate}T${endTime}`);
    } else if (endDate) {
        endDateTime = new Date(endDate);
    }

    try {
        const q = query(collection(db, "attendance"), where("name", "==", studentName));
        const querySnapshot = await getDocs(q);

        let result = "";
        let attendanceCountByClass = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const attendanceDate = new Date(data.date);

            if (startDateTime && attendanceDate < startDateTime) return;
            if (endDateTime && attendanceDate > endDateTime) return;

            data.classes.forEach((classAttended) => {
                const formattedDate = `${attendanceDate.toLocaleDateString("vi-VN")} - ${attendanceDate.toLocaleTimeString("vi-VN")}`;
                result += `${data.name} - ${classAttended} - ${formattedDate}<br>`;

                if (attendanceCountByClass[classAttended]) {
                    attendanceCountByClass[classAttended]++;
                } else {
                    attendanceCountByClass[classAttended] = 1;
                }
            });
        });

        result += "<h4>Tổng kết điểm danh:</h4>";
        for (const [className, count] of Object.entries(attendanceCountByClass)) {
            result += `${className}: ${count} buổi<br>`;
        }

        document.getElementById("attendanceResult").innerHTML = result || "Không tìm thấy kết quả nào.";
    } catch (error) {
        console.error("Lỗi khi truy vấn lịch sử điểm danh: ", error);
        document.getElementById("attendanceResult").innerHTML = "Có lỗi xảy ra khi truy vấn dữ liệu.";
    }
});
