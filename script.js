import { db, collection, addDoc, getDocs, query, where } from './firebase-config.js';

async function addNewStudent() {
    const name = document.getElementById('newStudentName').value;
    const selectedClasses = Array.from(document.querySelectorAll('#classesSelection input[type="checkbox"]:checked'))
                                  .map(el => el.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "students"), {
                name: name,
                classes: selectedClasses
            });
            alert("Học sinh đã được thêm thành công!");
        } catch (e) {
            console.error("Lỗi khi thêm học sinh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên và chọn ít nhất một môn học.");
    }
}

async function markAttendance() {
    const name = document.getElementById('attendanceStudentName').value;

    if (name) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                date: new Date().toISOString()
            });
            alert("Điểm danh thành công!");
        } catch (e) {
            console.error("Lỗi khi điểm danh: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để điểm danh.");
    }
}

async function queryAttendance() {
    const name = document.getElementById('queryStudentName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (name) {
        try {
            const attendanceQuery = query(
                collection(db, "attendance"),
                where("name", "==", name)
            );

            const querySnapshot = await getDocs(attendanceQuery);
            let results = "<h3>Kết Quả:</h3>";

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if ((!startDate || new Date(data.date) >= new Date(startDate)) &&
                    (!endDate || new Date(data.date) <= new Date(endDate))) {
                    results += `<p>${data.name} - ${data.date}</p>`;
                }
            });

            document.getElementById('attendanceResults').innerHTML = results;
        } catch (e) {
            console.error("Lỗi khi truy vấn: ", e);
        }
    } else {
        alert("Vui lòng nhập tên học sinh để truy vấn.");
    }
}

async function suggestStudents(inputId) {
    const nameFragment = document.getElementById(inputId).value.toLowerCase();
    if (nameFragment.length === 0) return;

    const querySnapshot = await getDocs(collection(db, "students"));
    const suggestions = [];

    querySnapshot.forEach((doc) => {
        if (doc.data().name.toLowerCase().includes(nameFragment)) {
            suggestions.push(doc.data().name);
        }
    });

    console.log("Suggestions for " + inputId + ": ", suggestions);
}
