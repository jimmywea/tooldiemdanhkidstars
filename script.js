import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value.trim();
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(el => el.value);

    if (name && classes.length > 0) {
        try {
            await addDoc(collection(db, "students"), { name, classes });
            alert("Học sinh đã được thêm thành công!");
            document.getElementById("newStudentName").value = "";
            document.querySelectorAll("#classesSelection input:checked").forEach(el => el.checked = false);
        } catch (error) {
            console.error("Lỗi khi thêm học sinh: ", error);
            alert("Có lỗi xảy ra khi thêm học sinh. Vui lòng thử lại.");
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
            document.getElementById("attendanceStudentName").value = "";
            document.getElementById("attendanceDate").value = "";
            document.getElementById("attendanceTime").value = "";
            document.querySelectorAll("#classesAttendanceSelection input:checked").forEach(el => el.checked = false);
        } catch (error) {
            console.error("Lỗi khi điểm danh: ", error);
            alert("Có lỗi xảy ra khi điểm danh. Vui lòng thử lại.");
        }
    } else {
        alert("Vui lòng nhập tên, ngày, giờ và chọn ít nhất một lớp.");
    }
});

document.getElementById("attendanceStudentName").addEventListener("input", async () => {
    const queryText = document.getElementById("attendanceStudentName").value.trim().toLowerCase();
    if (queryText.length > 1) {
        try {
            const q = query(collection(db, "students"), where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
            const querySnapshot = await getDocs(q);
            const suggestions = querySnapshot.docs.map(doc => doc.data().name);

            const suggestionsList = document.getElementById("suggestionsListAttendance");
            suggestionsList.innerHTML = "";
            suggestions.forEach(name => {
                const div = document.createElement("div");
                div.textContent = name;
                div.addEventListener("click", () => {
                    document.getElementById("attendanceStudentName").value = name;
                    suggestionsList.innerHTML = "";
                });
                suggestionsList.appendChild(div);
            });
        } catch (error) {
            console.error("Lỗi khi tìm kiếm học sinh: ", error);
        }
    } else {
        document.getElementById("suggestionsListAttendance").innerHTML = "";
    }
});
