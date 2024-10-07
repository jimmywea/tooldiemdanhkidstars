import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL56ek-ExampleKey",
    authDomain: "kidstars-7434d.firebaseapp.com",
    projectId: "kidstars-7434d",
    storageBucket: "kidstars-7434d.appspot.com",
    messagingSenderId: "616350873520",
    appId: "1:616350873520:web:9d765d0bf5a483fa964875",
    measurementId: "G-FJMK0F1LRN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('addStudentButton').addEventListener('click', async () => {
    const name = document.getElementById('newStudentName').value;
    const selectedClasses = [...document.querySelectorAll('#classesSelection input:checked')].map(el => el.value);
    if (name && selectedClasses.length) {
        await addDoc(collection(db, "students"), { name, classes: selectedClasses });
        alert('Học sinh đã được thêm!');
    }
});

document.getElementById('markAttendanceButton').addEventListener('click', async () => {
    const name = document.getElementById('attendanceStudentName').value;
    const selectedClasses = [...document.querySelectorAll('#classesAttendanceSelection input:checked')].map(el => el.value);
    if (name && selectedClasses.length) {
        const date = new Date().toISOString();
        await addDoc(collection(db, "attendance"), { name, classes: selectedClasses, date });
        alert('Điểm danh thành công!');
    }
});

document.getElementById('queryByNameButton').addEventListener('click', async () => {
    const name = document.getElementById('queryStudentName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const q = query(
        collection(db, "attendance"),
        where("name", "==", name),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
    );

    const querySnapshot = await getDocs(q);
    let resultText = '';
    querySnapshot.forEach(doc => {
        const data = doc.data();
        resultText += `${data.name} - ${data.classes.join(', ')} - ${data.date}<br>`;
    });

    document.getElementById('attendanceResult').innerHTML = resultText;
});

document.getElementById('queryByTimeButton').addEventListener('click', async () => {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    const q = query(
        collection(db, "attendance"),
        where("date", ">=", startTime),
        where("date", "<=", endTime)
    );

    const querySnapshot = await getDocs(q);
    let resultText = '';
    querySnapshot.forEach(doc => {
        const data = doc.data();
        resultText += `${data.name} - ${data.classes.join(', ')} - ${data.date}<br>`;
    });

    document.getElementById('attendanceResult').innerHTML = resultText;
});
