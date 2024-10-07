import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Thêm học sinh mới
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const studentName = document.getElementById("newStudentName").value;
    const selectedClasses = Array.from(
        document.querySelectorAll("#classesSelection input:checked")
    ).map((checkbox) => checkbox.value);

    if (studentName && selectedClasses.length > 0) {
        await addDoc(collection(db, "students"), {
            name: studentName,
            classes: selectedClasses,
        });
        alert("Học sinh đã được thêm thành công!");
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp học.");
    }
});

// Điểm danh học sinh
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const studentName = document.getElementById("attendanceStudentName").value;
    const selectedClasses = Array.from(
        document.querySelectorAll("#classesAttendanceSelection input:checked")
    ).map((checkbox) => checkbox.value);
    const attendanceDate = document.getElementById("attendanceDate").value;
    const attendanceTime = document.getElementById("attendanceTime").value;

    if (studentName && selectedClasses.length > 0 && attendanceDate && attendanceTime) {
        await addDoc(collection(db, "attendance"), {
            name: studentName,
            classes: selectedClasses,
            date: `${attendanceDate}T${attendanceTime}:00`,
        });
        alert("Điểm danh thành công!");
    } else {
        alert("Vui lòng nhập tên, chọn lớp học, và chọn ngày giờ để điểm danh.");
    }
});

// Gợi ý tên khi nhập
async function setupAutoComplete(inputId, suggestionsListId) {
    const input = document.getElementById(inputId);
    const suggestionsList = document.getElementById(suggestionsListId);

    input.addEventListener("input", async () => {
        if (input.value.length === 0) {
            suggestionsList.innerHTML = "";
            return;
        }

        const querySnapshot = await getDocs(collection(db, "students"));
        const suggestions = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().name.toLowerCase().includes(input.value.toLowerCase())) {
                suggestions.push(doc.data().name);
            }
        });

        suggestionsList.innerHTML = "";
        suggestions.forEach((suggestion) => {
            const div = document.createElement("div");
            div.textContent = suggestion;
            div.addEventListener("click", () => {
                input.value = suggestion;
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(div);
        });
    });
}

setupAutoComplete("attendanceStudentName", "suggestionsListAttendance");
setupAutoComplete("queryStudentName", "suggestionsListQuery");

// Truy vấn học sinh theo tên và ngày
document.getElementById("queryByNameAndDateButton").addEventListener("click", async () => {
    const studentName = document.getElementById("queryStudentName").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (studentName && startDate && endDate) {
        const attendanceQuery = query(
            collection(db, "attendance"),
            where("name", "==", studentName),
            orderBy("date")
        );

        const querySnapshot = await getDocs(attendanceQuery);
        let results = "";
        querySnapshot.forEach((doc) => {
            const date = doc.data().date;
            if (date >= startDate && date <= endDate) {
                results += `${doc.data().name} - ${doc.data().classes.join(", ")} - ${date}<br>`;
            }
        });

        document.getElementById("attendanceResult").innerHTML = results || "Không có kết quả.";
    } else {
        alert("Vui lòng nhập tên và chọn ngày.");
    }
});

// Truy vấn học sinh theo giờ
document.getElementById("queryByTimeButton").addEventListener("click", async () => {
    const timeStartDate = document.getElementById("timeStartDate").value;
    const timeEndDate = document.getElementById("timeEndDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    if (timeStartDate && timeEndDate && startTime && endTime) {
        const attendanceQuery = query(collection(db, "attendance"), orderBy("date"));

        const querySnapshot = await getDocs(attendanceQuery);
        let results = "";
        querySnapshot.forEach((doc) => {
            const date = doc.data().date;
            if (date >= `${timeStartDate}T${startTime}` && date <= `${timeEndDate}T${endTime}`) {
                results += `${doc.data().name} - ${doc.data().classes.join(", ")} - ${date}<br>`;
            }
        });

        document.getElementById("attendanceResult").innerHTML = results || "Không có kết quả.";
    } else {
        alert("Vui lòng nhập đầy đủ thông tin truy vấn theo giờ.");
    }
});
