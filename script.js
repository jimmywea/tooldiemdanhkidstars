// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

// Load student names for suggestions
async function loadStudentNames() {
    const studentsRef = collection(db, "students");
    const studentSnapshot = await getDocs(studentsRef);
    const studentList = document.getElementById("studentList");

    studentSnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.data().name;
        studentList.appendChild(option);
    });
}

// Add new student
async function addStudent() {
    const studentName = document.getElementById("newStudentName").value;
    const classesSelection = document.querySelectorAll("#classesSelection input[type=checkbox]:checked");
    const classes = Array.from(classesSelection).map((checkbox) => checkbox.value);

    if (studentName && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), {
                name: studentName,
                classes: classes
            });
            alert("Đã thêm học sinh thành công!");
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một lớp học.");
    }
}

// Mark student attendance
async function markAttendance() {
    const studentName = document.getElementById("attendanceStudentName").value;
    const classesAttendanceSelection = document.querySelectorAll("#classesAttendanceSelection input[type=checkbox]:checked");
    const classes = Array.from(classesAttendanceSelection).map((checkbox) => checkbox.value);
    const currentDate = new Date().toISOString();

    if (studentName && classes.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: studentName,
                classes: classes,
                date: currentDate
            });
            alert("Điểm danh thành công!");
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một lớp học.");
    }
}

// Query attendance by name and date range
async function queryAttendanceByNameAndDate() {
    const studentName = document.getElementById("queryStudentName").value;
    const startDate = new Date(document.getElementById("startDate").value).toISOString();
    const endDate = new Date(document.getElementById("endDate").value).toISOString();

    const attendanceRef = collection(db, "attendance");
    const q = query(attendanceRef, where("name", "==", studentName));
    const querySnapshot = await getDocs(q);

    let resultHTML = "";
    let totalAttendance = 0;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const attendanceDate = new Date(data.date);
        if (attendanceDate >= new Date(startDate) && attendanceDate <= new Date(endDate)) {
            resultHTML += `${data.name} - ${data.classes.join(", ")} - ${attendanceDate.toLocaleString()}<br>`;
            totalAttendance++;
        }
    });
    resultHTML += `<strong>Tổng số buổi đã điểm danh: ${totalAttendance}</strong>`;
    document.getElementById("attendanceResultByName").innerHTML = resultHTML;
}

// Query attendance by time range
async function queryAttendanceByTime() {
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    if (!startTime || !endTime) {
        alert("Vui lòng chọn giờ bắt đầu và giờ kết thúc.");
        return;
    }

    const attendanceRef = collection(db, "attendance");
    const querySnapshot = await getDocs(attendanceRef);

    let resultHTML = "";
    let totalAttendance = 0;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const attendanceDate = new Date(data.date);
        const attendanceTime = attendanceDate.getHours() + ":" + attendanceDate.getMinutes();

        if (attendanceTime >= startTime && attendanceTime <= endTime) {
            resultHTML += `${data.name} - ${data.classes.join(", ")} - ${attendanceDate.toLocaleString()}<br>`;
            totalAttendance++;
        }
    });
    resultHTML += `<strong>Tổng số học sinh đã điểm danh trong khoảng thời gian: ${totalAttendance}</strong>`;
    document.getElementById("attendanceResultByTime").innerHTML = resultHTML;
}

// Event listeners
document.getElementById("addStudentButton").addEventListener("click", addStudent);
document.getElementById("markAttendanceButton").addEventListener("click", markAttendance);
document.getElementById("queryByNameAndDateButton").addEventListener("click", queryAttendanceByNameAndDate);
document.getElementById("queryByTimeButton").addEventListener("click", queryAttendanceByTime);

// Load student names for suggestions when the page loads
window.onload = loadStudentNames;
