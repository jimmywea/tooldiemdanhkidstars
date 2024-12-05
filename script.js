import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, Timestamp, startAfter, limit } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Hàm truy vấn toàn bộ dữ liệu theo thời gian
async function fetchAllDataByTime(name, startDate, endDate) {
    const batchLimit = 500; // Số lượng tối đa bản ghi mỗi batch
    let results = [];
    let lastVisible = null;

    // Vòng lặp để lấy dữ liệu theo batch
    while (true) {
        const q = lastVisible
            ? query(
                collection(db, "attendance"),
                where("name", "==", name),
                where("date", ">=", Timestamp.fromDate(new Date(startDate))),
                where("date", "<=", Timestamp.fromDate(new Date(endDate))),
                startAfter(lastVisible),
                limit(batchLimit)
              )
            : query(
                collection(db, "attendance"),
                where("name", "==", name),
                where("date", ">=", Timestamp.fromDate(new Date(startDate))),
                where("date", "<=", Timestamp.fromDate(new Date(endDate))),
                limit(batchLimit)
              );

        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            break; // Nếu không có dữ liệu mới, kết thúc vòng lặp
        }

        snapshot.docs.forEach(doc => results.push(doc.data()));
        lastVisible = snapshot.docs[snapshot.docs.length - 1]; // Cập nhật bản ghi cuối cùng
    }

    return results; // Trả về toàn bộ kết quả
}

// Truy vấn và hiển thị dữ liệu
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
        const data = await fetchAllDataByTime(name, startDate, endDate);

        if (data.length === 0) {
            noDataMessage.style.display = "block";
        } else {
            data.forEach(record => {
                const tr = document.createElement("tr");
                const attendanceDate = record.date.toDate();
                tr.innerHTML = `
                    <td>${record.name}</td>
                    <td>${attendanceDate.toLocaleDateString()}</td>
                    <td>${attendanceDate.toLocaleTimeString()}</td>
                    <td>${record.classes.join(", ")}</td>
                    <td>${record.status || "Không rõ"}</td>
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
