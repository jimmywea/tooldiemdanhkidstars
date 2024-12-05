import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import XLSX from "https://cdn.sheetjs.com/xlsx-0.18.10/xlsx.mjs";

const queryButton = document.getElementById("queryButton");
const exportButton = document.getElementById("exportButton");

async function fetchAttendanceData(name, startDate, endDate) {
    const q = query(
        collection(db, "attendance"),
        where("name", "==", name),
        where("date", ">=", Timestamp.fromDate(new Date(startDate))),
        where("date", "<=", Timestamp.fromDate(new Date(endDate)))
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

queryButton.addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim().toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const loadingIndicator = document.getElementById("loadingIndicator");
    const noDataMessage = document.getElementById("noDataMessage");
    const tableBody = document.getElementById("resultTable");

    loadingIndicator.style.display = "block";
    noDataMessage.style.display = "none";
    tableBody.innerHTML = "";

    try {
        const data = await fetchAttendanceData(name, startDate, endDate);
        if (data.length === 0) {
            noDataMessage.style.display = "block";
        } else {
            data.forEach(record => {
                const row = document.createElement("tr");
                const attendanceDate = record.date.toDate();
                row.innerHTML = `
                    <td>${record.name}</td>
                    <td>${attendanceDate.toLocaleDateString()}</td>
                    <td>${attendanceDate.toLocaleTimeString()}</td>
                    <td>${record.classes.join(", ")}</td>
                    <td>${record.status || "Không rõ"}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Lỗi khi truy vấn dữ liệu.");
    } finally {
        loadingIndicator.style.display = "none";
    }
});

exportButton.addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim().toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    try {
        const data = await fetchAttendanceData(name, startDate, endDate);
        if (data.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const formattedData = data.map(record => ({
            "Tên Học Sinh": record.name,
            "Ngày": record.date.toDate().toLocaleDateString(),
            "Giờ": record.date.toDate().toLocaleTimeString(),
            "Môn Học": record.classes.join(", "),
            "Trạng Thái": record.status || "Không rõ"
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, "attendance.xlsx");
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Lỗi khi xuất file.");
    }
});
