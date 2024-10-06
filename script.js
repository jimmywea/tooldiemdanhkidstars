import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase Configuration
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

// Add New Student
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

// Mark Attendance
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value;

    if (name) {
        try {
            const studentsQuery = query(collection(db, "students"), where("name", "==", name));
            const querySnapshot = await getDocs(studentsQuery);

            if (!querySnapshot.empty) {
                await addDoc(collection(db, "attendance"), {
                    name: name,
                    date: new Date().toISOString()
                });
                alert("Điểm danh thành công!");
            } else {
                alert("Không tìm thấy học sinh.");
            }
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để điểm danh.");
    }
});

// Query Attendance History
document.getElementById("queryAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value;

    if (name) {
        try {
            const attendanceQuery = query(collection(db, "attendance"), where("name", "==", name));
            const querySnapshot = await getDocs(attendanceQuery);

            const resultDiv = document.getElementById("attendanceResult");
            resultDiv.innerHTML = "";  // Clear previous results

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const attendance = doc.data();
                    const div = document.createElement("div");
                    div.textContent = `Học sinh: ${attendance.name}, Ngày: ${new Date(attendance.date).toLocaleDateString()}`;
                    resultDiv.appendChild(div);
                });
            } else {
                resultDiv.innerHTML = "Không có kết quả.";
            }
        } catch (e) {
            console.error("Lỗi khi truy vấn điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để truy vấn.");
    }
});
