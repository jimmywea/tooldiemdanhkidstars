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

// Function to load student names (assuming you are displaying student names somewhere)
async function loadStudentNames() {
    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentListElement = document.getElementById("studentList"); // Assumes you have an element with id 'studentList'

        // Check if the element exists before trying to modify it
        if (studentListElement) {
            studentListElement.innerHTML = ""; // Clear the list
            querySnapshot.forEach((doc) => {
                const studentData = doc.data();
                const listItem = document.createElement("li");
                listItem.textContent = studentData.name;
                studentListElement.appendChild(listItem);
            });
        } else {
            console.error("Element with ID 'studentList' not found.");
        }
    } catch (e) {
        console.error("Lỗi khi tải danh sách học sinh: ", e);
    }
}

// Add new student
document.getElementById('addStudentButton').addEventListener('click', async () => {
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
            loadStudentNames(); // Reload the student list after adding
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
            alert("Lỗi khi thêm học sinh: " + e.message);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

// Mark attendance
document.getElementById('markAttendanceButton').addEventListener('click', async () => {
    const name = document.getElementById('attendanceStudentName').value;
    const selectedClasses = Array.from(document.querySelectorAll('#classesAttendanceSelection input[type="checkbox"]:checked'))
        .map(el => el.value);
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                classes: selectedClasses,
                date: date
            });
            alert("Điểm danh thành công cho học sinh: " + name);
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
            alert("Lỗi khi điểm danh: " + e.message);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

// Query attendance history
document.getElementById('queryAttendanceButton').addEventListener('click', async () => {
    const name = document.getElementById('queryStudentName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (name && startDate && endDate) {
        try {
            const querySnapshot = await getDocs(collection(db, "attendance"));
            let resultText = `Lịch sử điểm danh cho học sinh: ${name} từ ${startDate} đến ${endDate}:\n`;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name === name && data.date >= startDate && data.date <= endDate) {
                    resultText += `- Ngày: ${data.date}, Môn học: ${data.classes.join(", ")}\n`;
                }
            });

            if (resultText === `Lịch sử điểm danh cho học sinh: ${name} từ ${startDate} đến ${endDate}:\n`) {
                resultText += "Không có kết quả.";
            }

            const attendanceResultElement = document.getElementById('attendanceResult');
            if (attendanceResultElement) {
                attendanceResultElement.innerText = resultText;
            } else {
                console.error("Element with ID 'attendanceResult' not found.");
            }
        } catch (e) {
            console.error("Lỗi khi truy vấn lịch sử điểm danh: ", e);
            alert("Lỗi khi truy vấn lịch sử điểm danh: " + e.message);
        }
    } else {
        alert("Vui lòng nhập tên học sinh và khoảng thời gian để truy vấn.");
    }
});
