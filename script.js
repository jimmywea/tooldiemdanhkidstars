import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, limit, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import XLSX from "https://cdn.sheetjs.com/xlsx-0.18.10/xlsx.mjs";

document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value.trim();
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(el => el.value);

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), { name, classes });
            alert("Học sinh đã được thêm thành công!");
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Lỗi khi thêm học sinh. Vui lòng thử lại.");
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
});

document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value.trim();
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
            alert("Lỗi khi điểm danh. Vui lòng thử lại.");
        }
    } else {
        alert("Vui lòng nhập tên, ngày, giờ và chọn ít nhất một lớp.");
    }
});

document.getElementById("exportButton").addEventListener("click", async () => {
    try {
        const snapshot = await getDocs(collection(db, "attendance"));
        const data = snapshot.docs.map(doc => doc.data());
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, "attendance.xlsx");
        alert("Xuất file thành công!");
    } catch (error) {
        console.error("Error exporting Excel:", error);
        alert("Lỗi khi xuất file. Vui lòng thử lại.");
    }
});
