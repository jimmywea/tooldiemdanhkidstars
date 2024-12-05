import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import XLSX from "https://cdn.sheetjs.com/xlsx-0.18.10/xlsx.mjs";

// Truy vấn học sinh theo tên và ngày
document.getElementById("queryByNameAndDateButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim().toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const loadingIndicator = document.getElementById("loadingIndicator");
    const noDataMessage = document.getElementById("noDataMessage");
    const tableBody = document.getElementById("attendanceResult");

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
                const tr = document.createElement("tr");
                const attendanceDate = data.date.toDate();
                tr.innerHTML = `
                    <td>${data.name}</td>
                    <td>${attendanceDate.toLocaleDateString()}</td>
                    <td>${attendanceDate.toLocaleTimeString()}</td>
                    <td>${data.classes.join(", ")}</td>
                    <td>${data.status || "Không rõ"}</td>
                `;
                tableBody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error("Error querying attendance:", error);
        alert("Đã xảy ra lỗi khi truy vấn dữ liệu.");
    } finally {
        loadingIndicator.style.display = "none";
    }
});

// Xuất file Excel
document.getElementById("exportButton").addEventListener("click", async () => {
    try {
        const snapshot = await getDocs(collection(db, "attendance"));
        if (snapshot.empty) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const data = snapshot.docs.map(doc => ({
            "Tên Học Sinh": doc.data().name,
            "Ngày": doc.data().date.toDate().toLocaleDateString(),
            "Giờ": doc.data().date.toDate().toLocaleTimeString(),
            "Môn Học": doc.data().classes.join(", "),
            "Trạng Thái": doc.data().status || "Không rõ"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, "attendance.xlsx");
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Lỗi khi xuất file. Vui lòng thử lại.");
    }
});
