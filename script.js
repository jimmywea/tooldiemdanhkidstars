// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDL56ekmdndk3wd099KuJWUyogRUa3bwW8",
    authDomain: "kidstars-7434d.firebaseapp.com",
    projectId: "kidstars-7434d",
    storageBucket: "kidstars-7434d.appspot.com",
    messagingSenderId: "616350873520",
    appId: "1:616350873520:web:9d765d0bf5a483fa964875",
    measurementId: "G-FJMK0F1LRN"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Thêm học sinh mới
const addStudentButton = document.getElementById('addStudentButton');
addStudentButton.addEventListener('click', async () => {
    const name = document.getElementById('newStudentName').value;
    const classes = Array.from(document.querySelectorAll('#classesSelection input:checked')).map(input => input.value);
    
    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), {
                name: name,
                classes: classes
            });
            alert('Thêm học sinh thành công!');
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
            alert('Lỗi khi thêm học sinh!');
        }
    } else {
        alert('Vui lòng nhập tên và chọn ít nhất một lớp.');
    }
});

// Điểm danh học sinh
const markAttendanceButton = document.getElementById('markAttendanceButton');
markAttendanceButton.addEventListener('click', async () => {
    const name = document.getElementById('attendanceStudentName').value;
    const classes = Array.from(document.querySelectorAll('#classesAttendanceSelection input:checked')).map(input => input.value);
    const timestamp = Timestamp.now();

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                classes: classes,
                date: timestamp
            });
            alert('Điểm danh thành công!');
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
            alert('Lỗi khi điểm danh!');
        }
    } else {
        alert('Vui lòng nhập tên và chọn ít nhất một lớp.');
    }
});

// Truy vấn lịch sử điểm danh
const queryAttendanceButton = document.getElementById('queryAttendanceButton');
queryAttendanceButton.addEventListener('click', async () => {
    const name = document.getElementById('queryStudentName').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    endDate.setDate(endDate.getDate() + 1); // Để bao gồm cả ngày kết thúc

    if (name && !isNaN(startDate) && !isNaN(endDate)) {
        try {
            const q = query(collection(db, "attendance"), where("name", "==", name));
            const querySnapshot = await getDocs(q);
            let resultHTML = '';
            let attendanceCount = 0;
            let classAttendance = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const date = data.date.toDate();
                if (date >= startDate && date < endDate) {
                    data.classes.forEach(cls => {
                        if (!classAttendance[cls]) {
                            classAttendance[cls] = 0;
                        }
                        classAttendance[cls]++;
                    });
                    resultHTML += `${data.name} - ${data.classes.join(", ")} - ${date.toLocaleDateString()} - ${date.toLocaleTimeString()}<br>`;
                    attendanceCount++;
                }
            });

            resultHTML += `<br>Tổng số buổi đã điểm danh: ${attendanceCount}<br>`;
            for (const [cls, count] of Object.entries(classAttendance)) {
                resultHTML += `${cls}: ${count} buổi<br>`;
            }

            document.getElementById('attendanceResult').innerHTML = resultHTML;
        } catch (e) {
            console.error("Lỗi khi truy vấn lịch sử điểm danh: ", e);
            alert('Lỗi khi truy vấn lịch sử điểm danh!');
        }
    } else {
        alert('Vui lòng nhập tên học sinh và chọn ngày hợp lệ.');
    }
});

// Gợi ý tên học sinh
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const studentSnapshot = await getDocs(collection(db, "students"));
        let optionsHTML = '';
        studentSnapshot.forEach((doc) => {
            const studentName = doc.data().name;
            optionsHTML += `<option value="${studentName}">`;
        });
        document.getElementById('studentNames').innerHTML = optionsHTML;
    } catch (e) {
        console.error("Lỗi khi tải danh sách học sinh: ", e);
    }
});
