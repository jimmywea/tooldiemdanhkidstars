import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value;
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(el => el.value);

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), { name, classes });
            alert("Học sinh đã được thêm thành công!");
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Đã xảy ra lỗi khi thêm học sinh.");
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
    }
});

document.getElementById("markAttendanceButton").addEventListener("click", async () => {
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
            console.error("Error marking attendance: ", error);
            alert("Đã xảy ra lỗi khi điểm danh.");
        }
    } else {
        alert("Vui lòng nhập tên, ngày, giờ và chọn ít nhất một lớp.");
    }
});

document.getElementById("attendanceStudentName").addEventListener("input", async () => {
    const queryText = document.getElementById("attendanceStudentName").value.toLowerCase();
    const suggestionsList = document.getElementById("suggestionsListAttendance");
    suggestionsList.innerHTML = "";

    if (queryText.length > 1) {
        try {
            const q = query(collection(db, "students"), where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
            const querySnapshot = await getDocs(q);
            const suggestions = querySnapshot.docs.map(doc => doc.data().name);

            if (suggestions.length > 0) {
                suggestions.forEach(name => {
                    const div = document.createElement("div");
                    div.textContent = name;
                    div.addEventListener("click", () => {
                        document.getElementById("attendanceStudentName").value = name;
                        suggestionsList.innerHTML = "";
                    });
                    suggestionsList.appendChild(div);
                });
            } else {
                const noResult = document.createElement("div");
                noResult.textContent = "Không tìm thấy kết quả.";
                suggestionsList.appendChild(noResult);
            }
        } catch (error) {
            console.error("Error fetching suggestions: ", error);
        }
    }
});
