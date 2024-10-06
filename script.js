import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

// Thêm học sinh mới
document.getElementById('addStudentButton').addEventListener('click', async () => {
    const name = document.getElementById('newStudentName').value;
    const selectedClasses = Array.from(document.querySelectorAll('#newStudentClasses input:checked')).map(cb => cb.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "students"), {
                name: name,
                classes: selectedClasses
            });
            alert('Thêm học sinh thành công');
        } catch (error) {
            console.error("Lỗi khi thêm học sinh: ", error);
        }
    } else {
        alert('Vui lòng nhập tên học sinh và chọn ít nhất một môn học');
    }
});

// Đề xuất tên học sinh khi nhập
async function suggestStudents() {
    const input = document.getElementById('studentName').value.toLowerCase();
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';

    if (input.length > 1) {
        try {
            const studentsSnapshot = await getDocs(collection(db, "students"));
            studentsSnapshot.forEach((doc) => {
                const studentName = doc.data().name.toLowerCase();
                if (studentName.includes(input)) {
                    const listItem = document.createElement('li');
                    listItem.textContent = doc.data().name;
                    listItem.addEventListener('click', () => {
                        document.getElementById('studentName').value = doc.data().name;
                        suggestionsList.innerHTML = '';
                    });
                    suggestionsList.appendChild(listItem);
                }
            });
        } catch (error) {
            console.error("Lỗi khi truy vấn học sinh: ", error);
        }
    }
}

// Gắn sự kiện input vào trường tên học sinh
document.getElementById('studentName').addEventListener('input', suggestStudents);

// Điểm danh học sinh
document.getElementById('markAttendanceButton').addEventListener('click', async () => {
    const name = document.getElementById('studentName').value;
    const selectedClasses = Array.from(document.querySelectorAll('#courseSelect input:checked')).map(cb => cb.value);

    if (name && selectedClasses.length > 0) {
        try {
            await addDoc(collection(db, "attendance"), {
                name: name,
                classes: selectedClasses,
                date: new Date().toISOString()
            });
            alert('Điểm danh thành công');
        } catch (error) {
            console.error("Lỗi khi điểm danh: ", error);
        }
    } else {
        alert('Vui lòng nhập tên học sinh và chọn ít nhất một môn học');
    }
});

// Truy vấn lịch sử điểm danh
document.getElementById('queryAttendanceButton').addEventListener('click', async () => {
    const name = document.getElementById('queryName').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const resultsList = document.getElementById('attendanceRecords');
    resultsList.innerHTML = '';

    if (name) {
        try {
            const q = query(collection(db, "attendance"), where("name", "==", name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const attendanceDate = new Date(data.date);
                if (attendanceDate >= startDate && attendanceDate <= endDate) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${data.name} - ${data.classes.join(", ")} - ${attendanceDate.toLocaleDateString()}`;
                    resultsList.appendChild(listItem);
                }
            });
        } catch (error) {
            console.error("Lỗi khi truy vấn điểm danh: ", error);
        }
    } else {
        alert('Vui lòng nhập tên học sinh để truy vấn');
    }
});
