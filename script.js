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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Hàm thêm học sinh mới
async function addNewStudent() {
    const studentName = document.getElementById("studentName").value;
    const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked')).map(e => e.value);

    if (studentName.trim() === "" || selectedCourses.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
        return;
    }

    try {
        await db.collection("students").add({
            name: studentName,
            courses: selectedCourses
        });
        alert("Học sinh đã được thêm thành công!");
        document.getElementById("studentName").value = "";
        document.querySelectorAll('input[name="course"]').forEach(e => e.checked = false);
    } catch (e) {
        console.error("Lỗi khi thêm học sinh: ", e);
    }
}

// Hàm gợi ý tên học sinh khi nhập
async function suggestStudents(inputId, suggestionBoxId) {
    const input = document.getElementById(inputId).value.toLowerCase();
    const suggestionBox = document.getElementById(suggestionBoxId);
    suggestionBox.innerHTML = "";

    if (input.trim() === "") {
        return;
    }

    try {
        const q = db.collection("students").where("name", ">=", input).where("name", "<=", input + "\uf8ff");
        const querySnapshot = await q.get();

        querySnapshot.forEach((doc) => {
            const listItem = document.createElement("li");
            listItem.textContent = doc.data().name;
            listItem.onclick = () => {
                document.getElementById(inputId).value = doc.data().name;
                suggestionBox.innerHTML = "";
            };
            suggestionBox.appendChild(listItem);
        });
    } catch (e) {
        console.error("Lỗi khi tìm kiếm học sinh: ", e);
    }
}

// Hàm điểm danh học sinh
async function markAttendance() {
    const studentName = document.getElementById("attendanceName").value;
    if (studentName.trim() === "") {
        alert("Vui lòng nhập tên học sinh.");
        return;
    }
    try {
        await db.collection("attendance").add({
            name: studentName,
            timestamp: new Date()
        });
        alert("Điểm danh thành công!");
        document.getElementById("attendanceName").value = "";
    } catch (e) {
        console.error("Lỗi khi điểm danh: ", e);
    }
}

// Hàm truy vấn lịch sử điểm danh
async function queryAttendance() {
    const studentName = document.getElementById("queryName").value;
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    endDate.setDate(endDate.getDate() + 1);

    const attendanceRecords = document.getElementById("attendanceRecords");
    attendanceRecords.innerHTML = "";

    if (studentName.trim() === "") {
        alert("Vui lòng nhập tên học sinh.");
        return;
    }

    try {
        const q = db.collection("attendance")
            .where("name", "==", studentName)
            .where("timestamp", ">=", startDate)
            .where("timestamp", "<=", endDate);
        const querySnapshot = await q.get();

        querySnapshot.forEach((doc) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Tên: ${doc.data().name}, Thời Gian: ${doc.data().timestamp.toDate()}`;
            attendanceRecords.appendChild(listItem);
        });
    } catch (e) {
        console.error("Lỗi khi truy vấn điểm danh: ", e);
    }
}

// Gắn các hàm vào window để sử dụng từ HTML
window.addNewStudent = addNewStudent;
window.suggestStudents = suggestStudents;
window.markAttendance = markAttendance;
window.queryAttendance = queryAttendance;
