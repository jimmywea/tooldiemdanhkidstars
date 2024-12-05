import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import XLSX from "https://cdn.sheetjs.com/xlsx-0.18.10/xlsx.mjs";

// Thay đổi giao diện khi chuyển tab
document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
        document.querySelectorAll(".section").forEach(section => section.classList.remove("active"));

        item.classList.add("active");
        const sectionId = item.id.replace("Button", "Section");
        document.getElementById(sectionId).classList.add("active");
    });
});

// Truy vấn dữ liệu
document.getElementById("runQueryButton").addEventListener("click", async () => {
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

// Xuất dữ liệu ra Excel
document.getElementById("runExportButton").addEventListener("click", async () => {
    const name = document.getElementById("queryStudentName").value.trim().toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    try {
        const q = query(
            collection(db, "attendance"),
            where("name", "==", name),
            where("date", ">=", Timestamp.fromDate(new Date(startDate))),
            where("date", "<=", Timestamp.fromDate(new Date(endDate)))
        );
        const snapshot = await getDocs(q);

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
        alert("Có lỗi xảy ra khi xuất file.");
    }
});
