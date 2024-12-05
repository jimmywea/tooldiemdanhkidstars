import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Thêm học sinh
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("studentName").value.trim();
    const classes = Array.from(document.getElementById("studentClasses").selectedOptions).map(option => option.value);

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), { name, classes });
            alert("Thêm học sinh thành công!");
        } catch (error) {
            alert("Có lỗi xảy ra khi thêm học sinh.");
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
});

// Điểm danh học sinh
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value.trim();
    const date = document.getElementById("attendanceDate").value;
    const classes = Array.from(document.getElementById("attendanceClasses").selectedOptions).map(option => option.value);

    if (name && date && classes.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name,
                date: Timestamp.fromDate(new Date(date)),
                classes
            });
            alert("Điểm danh thành công!");
        } catch (error) {
            alert("Có lỗi xảy ra khi điểm danh.");
        }
    } else {
        alert("Vui lòng nhập đầy đủ thông tin.");
    }
});

// Truy vấn lịch sử điểm danh
document.getElementById("queryAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const loadingIndicator = document.getElementById("loadingIndicator");
    const noDataMessage = document.getElementById("noDataMessage");
    const tableBody = document.getElementById("resultTable");

    loadingIndicator.style.display = "block";
    noDataMessage.style.display = "none";
    tableBody.innerHTML = "";

    try {
        const q = query(
            collection(db, "attendance"),
            where("name", "==", name),
            where("date", ">=", Timestamp.fromDate(new Date(startDate))),
            where("date", "<=", Timestamp.fromDate(new Date(endDate)))
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            noDataMessage.style.display = "block";
        } else {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.date.toDate().toLocaleDateString()}</td>
                    <td>${data.date.toDate().toLocaleTimeString()}</td>
                    <td>${data.classes.join(", ")}</td>
                    <td>${data.status || "Không rõ"}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        alert("Có lỗi xảy ra khi truy vấn.");
    } finally {
        loadingIndicator.style.display = "none";
    }
});
