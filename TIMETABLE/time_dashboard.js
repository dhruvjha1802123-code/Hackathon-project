document.addEventListener("DOMContentLoaded", () => {
  const classValueSpan = document.querySelector('.class-value');
  const teacherValueSpan = document.querySelector('.teacher-value');
  const subjectsValueSpan = document.querySelector('.subjects-value');
  const conflictValueSpan = document.querySelector('.conflict-value');

  classValueSpan.textContent = NUM_CLASSES;
  teacherValueSpan.textContent = new Set(subjects.map(s => s.teacher)).size;
  subjectsValueSpan.textContent = subjects.length;
});
