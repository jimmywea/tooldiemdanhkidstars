import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

// Function to load student names into datalist for autocomplete
async function loadStudentNames() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Clear existing options

    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.data().name;
            studentList.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading student names: ", error);
    }
}

// Call loadStudentNames on page load
window.addEventListener('DOMContentLoaded', () => {
    loadStudentNames();
});

// Add student function
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
            loadStudentNames(); // Reload the student list
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

// Attendance marking function
document.getElementById('markAttendanceButton').addEventListener('click', () => {
    const name = document.getElementById('attendanceStudentName').value;
    if (name) {
        // Code để đánh dấu điểm danh cho học sinh, ví dụ thêm vào Firestore
        console.log(`Điểm danh học sinh: ${name}`);
        alert(`Điểm danh thành công cho học sinh: ${name}`);
    } else {
        alert("Vui lòng nhập tên học sinh để điểm danh.");
    }
});

// Query attendance history function
document.getElementById('queryAttendanceButton').addEventListener('click', () => {
    const name = document.getElementById('queryStudentName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (name) {
        // Code để truy vấn lịch sử điểm danh, ví dụ từ Firestore
        console.log(`Truy vấn điểm danh cho học sinh: ${name} từ ${startDate} đến ${endDate}`);
        alert(`Truy vấn điểm danh cho học sinh: ${name} từ ${startDate} đến ${endDate}`);
    } else {
        alert("Vui lòng nhập tên học sinh để truy vấn.");
    }
});
