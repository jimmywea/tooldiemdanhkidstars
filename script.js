// JavaScript Functionality

// Thêm học sinh mới
function addNewStudent() {
    const studentName = document.getElementById("newStudentName").value.trim();
    const courses = Array.from(document.querySelectorAll("#newCourses input:checked")).map(input => input.value);

    if (studentName === "" || courses.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
        return;
    }

    db.collection("students").add({
        name: studentName,
        classes: courses
    })
    .then(() => {
        alert("Thêm học sinh thành công!");
        document.getElementById("newStudentName").value = "";
        document.querySelectorAll("#newCourses input:checked").forEach(input => input.checked = false);
    })
    .catch(error => {
        console.error("Error adding student: ", error);
    });
}

// Gợi ý tên học sinh
function suggestStudents() {
    const input = document.getElementById("studentName").value.trim().toLowerCase();
    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = "";

    if (input.length > 0) {
        db.collection("students").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const student = doc.data();
                if (student.name.toLowerCase().includes(input)) {
                    const li = document.createElement("li");
                    li.textContent = student.name;
                    li.onclick = function () {
                        document.getElementById("studentName").value = student.name;
                        suggestionsList.innerHTML = "";
                    };
                    suggestionsList.appendChild(li);
                }
            });
        });
    }
}

// Điểm danh học sinh
function markAttendance() {
    const studentName = document.getElementById("studentName").value.trim();
    const courses = Array.from(document.querySelectorAll("#attendanceCourses input:checked")).map(input => input.value);

    if (studentName === "" || courses.length === 0) {
        alert("Vui lòng nhập tên học sinh và chọn ít nhất một môn học.");
        return;
    }

    db.collection("attendance").add({
        name: studentName,
        classes: courses,
        date: new Date().toISOString().split("T")[0]
    })
    .then(() => {
        alert("Điểm danh thành công!");
        document.getElementById("studentName").value = "";
        document.querySelectorAll("#attendanceCourses input:checked").forEach(input => input.checked = false);
    })
    .catch(error => {
        console.error("Error marking attendance: ", error);
    });
}

// Gợi ý tên học sinh cho truy vấn điểm danh
function suggestStudentsForQuery() {
    const input = document.getElementById("queryName").value.trim().toLowerCase();
    const querySuggestionsList = document.getElementById("querySuggestions");
    querySuggestionsList.innerHTML = "";

    if (input.length > 0) {
        db.collection("students").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const student = doc.data();
                if (student.name.toLowerCase().includes(input)) {
                    const li = document.createElement("li");
                    li.textContent = student.name;
                    li.onclick = function () {
                        document.getElementById("queryName").value = student.name;
                        querySuggestionsList.innerHTML = "";
                    };
                    querySuggestionsList.appendChild(li);
                }
            });
        });
    }
}

// Truy vấn lịch sử điểm danh
function queryAttendance() {
    const studentName = document.getElementById("queryName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (studentName === "" || startDate === "" || endDate === "") {
        alert("Vui lòng nhập tên học sinh và chọn ngày bắt đầu và kết thúc.");
        return;
    }

    const attendanceRecords = document.getElementById("attendanceRecords");
    attendanceRecords.innerHTML = "";

    db.collection("attendance")
        .where("name", "==", studentName)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const record = doc.data();
                const recordDate = record.date;
                if (recordDate >= startDate && recordDate <= endDate) {
                    const li = document.createElement("li");
                    li.textContent = `${record.date}: ${record.classes.join(", ")}`;
                    attendanceRecords.appendChild(li);
                }
            });
        })
        .catch(error => {
            console.error("Error querying attendance: ", error);
        });
}
