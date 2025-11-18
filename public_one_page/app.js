const API_BASE = "/api";

// DOM links
const coursesList = document.getElementById("coursesList");
const studentsList = document.getElementById("studentsList");
const studentSelect = document.getElementById("studentSelect");
const courseSelect = document.getElementById("courseSelect");

async function loadCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  const courses = await res.json();

  coursesList.innerHTML = courses.map(c => `
    <tr>
      <td>${c.title}</td><td>${c.code}</td>
      <td><button class="btn delete" onclick="deleteCourse('${c._id}')">X</button></td>
    </tr>
  `).join("");

  courseSelect.innerHTML = courses.map(c =>
    `<option value="${c._id}">${c.title} (${c.code})</option>`
  ).join("");
}

async function loadStudents() {
  const res = await fetch(`${API_BASE}/students`);
  const students = await res.json();

  studentsList.innerHTML = students.map(s => `
    <tr>
      <td>${s.name}</td><td>${s.email || "-"}</td>
      <td><button class="btn delete" onclick="deleteStudent('${s._id}')">X</button></td>
    </tr>
  `).join("");

  studentSelect.innerHTML = students.map(s =>
    `<option value="${s._id}">${s.name}</option>`
  ).join("");
}

loadCourses();
loadStudents();

// Add Course
document.getElementById("courseForm").onsubmit = async (e) => {
  e.preventDefault();
  await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      title: courseTitle.value,
      code: courseCode.value
    })
  });
  courseForm.reset();
  loadCourses();
};

// Add Student
document.getElementById("studentForm").onsubmit = async (e) => {
  e.preventDefault();
  await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: studentName.value,
      email: studentEmail.value
    })
  });
  studentForm.reset();
  loadStudents();
};

// Delete Course
async function deleteCourse(id) {
  await fetch(`${API_BASE}/courses/${id}`, {method: "DELETE"});
  loadCourses();
  loadStudents();
}

// Delete Student
async function deleteStudent(id) {
  await fetch(`${API_BASE}/students/${id}`, {method: "DELETE"});
  loadStudents();
}

// Register
document.getElementById("registerBtn").onclick = async () => {
  const studentId = studentSelect.value;
  const courseId = courseSelect.value;

  await fetch(`${API_BASE}/students/${studentId}/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({courseId})
  });
  alert("Registered!");
};

// Unregister
document.getElementById("unregisterBtn").onclick = async () => {
  const studentId = studentSelect.value;
  const courseId = courseSelect.value;

  await fetch(`${API_BASE}/students/${studentId}/unregister`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({courseId})
  });
  alert("Unregistered!");
};

// Seed Demo Data
document.getElementById("seedBtn").onclick = async () => {
  await fetch(`${API_BASE}/seed`, {method: "POST"});
  loadCourses();
  loadStudents();
};
