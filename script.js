import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import XLSX from "https://cdn.sheetjs.com/xlsx-0.18.10/xlsx.mjs";

async function addStudent() {
    const name = document.getElementById("newStudentName").value;
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(el => el.value);

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), { name, classes });
            alert("Học sinh đã được thêm thành công!");
        } catch (error) {
            console.error("Error adding student:", error);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
}

async function markAttendance() {
    const name = document.getElementById("attendanceStudentName").value;
    const date = document.getElementById("attendanceDate").value;
    const time = document.getElementById("attendanceTime").value;
    const classes = Array.from(document.querySelectorAll("#classesAttendanceSelection input:checked")).map(el => el.value);

    if (name && date && time && classes.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name,
                date: Timestamp.fromDate(new Date(`${date}T${time}`)),
                classes
            });
            alert("Điểm danh thành công!");
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    } else {
        alert("Vui lòng nhập đầy đủ thông tin.");
    }
}

async function exportToExcel() {
    try {
        const snapshot = await getDocs(collection(db, "attendance"));
        const data = snapshot.docs.map(doc => ({
            "Tên Học Sinh": doc.data().name,
            "Thời Gian": doc.data().date.toDate().toLocaleString(),
            "Môn Học": doc.data().classes.join(", "),
            "Trạng Thái": doc.data().status || "Không rõ"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, "attendance.xlsx");
    } catch (error) {
        console.error("Error exporting to Excel:", error);
    }
}

document.getElementById("addStudentButton").addEventListener("click", addStudent);
document.getElementById("markAttendanceButton").addEventListener("click", markAttendance);
document.getElementById("exportButton").addEventListener("click", exportToExcel);
