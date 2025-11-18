const API_BASE = "/api";

// DOM elements
const coursesList = document.getElementById("coursesList");
const studentsList = document.getElementById("studentsList");
const modal = document.getElementById("modal");
const modalCourses = document.getElementById("modalCourses");
const closeModal = document.getElementById("closeModal");

let currentStudent = null;

// Load UI Data
async function loadCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  const data = await res.json();
  coursesList.innerHTML = data.map(c => `
    <tr>
      <td>${c.title}</td>
      <td>${c.code}</td>
      <td>
        <button class="btn delete" onclick="deleteCourse('${c._id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

async function loadStudents(name = "") {
  const url = name ? `${API_BASE}/students?name=${name}` : `${API_BASE}/students`;
  const res = await fetch(url);
  const data = await res.json();
  studentsList.innerHTML = data.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.email || "-"}</td>
      <td>${s.registeredCourses.length}</td>
      <td>
        <button class="btn register" onclick="openRegisterModal('${s._id}')">Manage Courses</button>
        <button class="btn delete" onclick="deleteStudent('${s._id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

loadCourses();
loadStudents();

// Add Course
document.getElementById("courseForm").onsubmit = async (e) => {
  e.preventDefault();
  const title = courseTitle.value;
  const code = courseCode.value;
  await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, code })
  });
  courseForm.reset();
  loadCourses();
};

// Add Student
document.getElementById("studentForm").onsubmit = async (e) => {
  e.preventDefault();
  const name = studentName.value;
  const email = studentEmail.value;
  await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });
  studentForm.reset();
  loadStudents();
};

// Search Students
document.getElementById("studentSearch").oninput = (e) => {
  loadStudents(e.target.value);
};

// Delete Course
async function deleteCourse(id) {
  await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
  loadCourses();
  loadStudents(); // refresh registered courses count
}

// Delete Student
async function deleteStudent(id) {
  await fetch(`${API_BASE}/students/${id}`, { method: "DELETE" });
  loadStudents();
}

// Open modal to register courses
async function openRegisterModal(studentId) {
  currentStudent = studentId;
  modal.classList.remove("hidden");

  const [coursesRes, studentRes] = await Promise.all([
    fetch(`${API_BASE}/courses`),
    fetch(`${API_BASE}/students/${studentId}`)
  ]);
  const courses = await coursesRes.json();
  const student = await studentRes.json();

  const registeredIds = student.registeredCourses.map(c => c.courseId);

  modalCourses.innerHTML = courses.map(c => `
    <li>
      ${c.title} (${c.code})
      ${
        registeredIds.includes(c._id)
          ? `<button onclick="unregisterCourse('${c._id}')">Unregister</button>`
          : `<button onclick="registerCourse('${c._id}')">Register</button>`
      }
    </li>
  `).join("");
}

closeModal.onclick = () => modal.classList.add("hidden");

// Register student to course
async function registerCourse(courseId) {
  await fetch(`${API_BASE}/students/${currentStudent}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId })
  });
  openRegisterModal(currentStudent);
  loadStudents();
}

// Unregister course
async function unregisterCourse(courseId) {
  await fetch(`${API_BASE}/students/${currentStudent}/unregister`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId })
  });
  openRegisterModal(currentStudent);
  loadStudents();
}

// Seed Demo Data
document.getElementById("seedBtn").onclick = async () => {
  await fetch(`${API_BASE}/seed`, { method: "POST" });
  loadCourses();
  loadStudents();
};
