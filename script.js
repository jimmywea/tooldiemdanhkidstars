// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

// Load student names
async function loadStudentNames() {
    try {
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const studentNamesDatalist = document.getElementById("studentNames");
        studentNamesDatalist.innerHTML = ""; // Clear existing options
        studentsSnapshot.forEach((doc) => {
            let option = document.createElement("option");
            option.value = doc.data().name;
            studentNamesDatalist.appendChild(option);
        });
    } catch (e) {
        console.error("Error loading student names: ", e);
    }
}

// Add new student
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value;
    const selectedClasses = Array.from(document.querySelectorAll("#classesSelection input[type='checkbox']:checked")).map(el => el.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "students"), {
                name: name,
                classes: selectedClasses
            });
            alert("Học sinh đã được thêm thành công!");
            loadStudentNames(); // Reload student names
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

// Mark attendance
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value;
    const selectedClasses = Array.from(document.querySelectorAll("#classesAttendanceSelection input[type='checkbox']:checked")).map(el => el.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                classes: selectedClasses,
                date: new Date().toISOString()
            });
            alert(`Điểm danh thành công cho học sinh: ${name}`);
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
});

// Query attendance
document.getElementById("queryAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value;
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    endDate.setDate(endDate.getDate() + 1); // Include the end day

    if (name) {
        try {
            const q = query(collection(db, "attendance"), where("name", "==", name));
            const querySnapshot = await getDocs(q);
            let resultHTML = "";
            let totalSessions = 0;
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const attendanceDate = new Date(data.date);
                
                if (attendanceDate >= startDate && attendanceDate < endDate) {
                    totalSessions++;
                    const dateStr = `${attendanceDate.toLocaleDateString()} - ${attendanceDate.toLocaleTimeString()}`;
                    resultHTML += `<p>${data.name} - ${data.classes.join(", ")} - ${dateStr}</p>`;
                }
            });

            resultHTML += `<strong>Tổng số buổi đã điểm danh: ${totalSessions}</strong>`;
            document.getElementById("attendanceResult").innerHTML = resultHTML || "Không có kết quả phù hợp.";
        } catch (e) {
            console.error("Lỗi khi truy vấn điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để truy vấn.");
    }
});

// Load student names on page load
window.addEventListener("load", loadStudentNames);
