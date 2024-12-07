import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Hàm tiện ích
const getElement = (id) => document.getElementById(id);
const getSelectedValues = (selector) =>
    Array.from(document.querySelectorAll(selector)).filter(el => el.checked).map(el => el.value);

// Thêm học sinh mới
getElement("addStudentButton").addEventListener("click", async () => {
    const name = getElement("newStudentName").value.trim();
    const classes = getSelectedValues("#classesSelection input");

    if (name && classes.length > 0) {
        await addDoc(collection(db, "students"), { name, classes });
        alert("Học sinh đã được thêm thành công!");
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
});

// Điểm danh học sinh
getElement("markAttendanceButton").addEventListener("click", async () => {
    const name = getElement("attendanceStudentName").value.trim();
    const date = getElement("attendanceDate").value;
    const time = getElement("attendanceTime").value;
    const classes = getSelectedValues("#classesAttendanceSelection input");

    if (name && date && time && classes.length > 0) {
        await addDoc(collection(db, "attendance"), {
            name,
            date: Timestamp.fromDate(new Date(`${date}T${time}`)),
            classes
        });
        alert("Điểm danh thành công!");
    } else {
        alert("Vui lòng nhập tên, ngày, giờ và chọn ít nhất một lớp.");
    }
});

// Gợi ý tìm kiếm tên học sinh
getElement("attendanceStudentName").addEventListener("input", async () => {
    const queryText = getElement("attendanceStudentName").value.toLowerCase();
    if (queryText.length > 1) {
        const q = query(collection(db, "students"), where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
        const querySnapshot = await getDocs(q);
        const suggestions = querySnapshot.docs.map(doc => doc.data().name);

        const suggestionsList = getElement("suggestionsListAttendance");
        suggestionsList.innerHTML = "";
        suggestions.forEach(name => {
            const div = document.createElement("div");
            div.textContent = name;
            div.addEventListener("click", () => {
                getElement("attendanceStudentName").value = name;
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(div);
        });
    }
});

// Truy vấn học sinh theo tên và ngày
getElement("queryByNameAndDateButton").addEventListener("click", async () => {
    const name = getElement("queryStudentName").value.trim();
    const startDateInput = getElement("startDate").value;
    const endDateInput = getElement("endDate").value;

    if (name && startDateInput && endDateInput) {
        const startDate = new Date(startDateInput + "T00:00:00");
        const endDate = new Date(endDateInput + "T23:59:59");

        const attendanceQuery = query(
            collection(db, "attendance"),
            where("name", "==", name),
            where("date", ">=", Timestamp.fromDate(startDate)),
            where("date", "<=", Timestamp.fromDate(endDate))
        );

        const querySnapshot = await getDocs(attendanceQuery);
        const resultsContainer = getElement("attendanceResult");
        resultsContainer.innerHTML = "";
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const div = document.createElement("div");
                div.textContent = `Tên: ${data.name}, Ngày: ${data.date.toDate().toLocaleString()}`;
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.textContent = "Không có dữ liệu phù hợp.";
        }
    } else {
        alert("Vui lòng nhập tên học sinh và chọn khoảng ngày.");
    }
});

// Truy vấn theo giờ
getElement("queryByTimeButton").addEventListener("click", async () => {
    const startDateInput = getElement("timeStartDate").value;
    const endDateInput = getElement("timeEndDate").value;
    const startTimeInput = getElement("startTime").value;
    const endTimeInput = getElement("endTime").value;

    if (startDateInput && endDateInput && startTimeInput && endTimeInput) {
        const startDateTime = new Date(`${startDateInput}T${startTimeInput}`);
        const endDateTime = new Date(`${endDateInput}T${endTimeInput}`);

        const attendanceQuery = query(
            collection(db, "attendance"),
            where("date", ">=", Timestamp.fromDate(startDateTime)),
            where("date", "<=", Timestamp.fromDate(endDateTime))
        );

        const querySnapshot = await getDocs(attendanceQuery);
        const resultsContainer = getElement("attendanceResult");
        resultsContainer.innerHTML = "";
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const div = document.createElement("div");
                div.textContent = `Tên: ${data.name}, Ngày: ${data.date.toDate().toLocaleString()}`;
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.textContent = "Không có dữ liệu phù hợp.";
        }
    } else {
        alert("Vui lòng nhập đầy đủ thông tin.");
    }
});
