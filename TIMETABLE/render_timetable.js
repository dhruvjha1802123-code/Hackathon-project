// Import necessary functions and data


const timetableBody = document.getElementsByClassName('timetable-body');
const time = ['09:15-10:15', '10:15-11:30', '11:45-1:30', '02:00-03:15', '03:15-04:15'];
const classNumHeader = document.getElementsByClassName('class-name');
const generateTimetableButton = document.getElementById("generate-timetable-button");
const classField = document.getElementById("ClassField");
const classButton = document.querySelector(".ClassSubmit");
const classForm = document.getElementById("classForm");
const subjectTable = document.getElementById("subjectTable");
const workloadSection = document.getElementById("WorkloadSection");
const workload_content = document.getElementById("workload-content");
const subject = document.getElementById("subjects")

// ✅ New input fields for current and new values
const curr_subject_input = document.querySelector(".curr_subject");
const curr_faculty_input = document.querySelector(".curr_faculty");
const curr_time_input = document.querySelector(".curr_time");
const to_subject_input = document.querySelector(".to_subject");
const to_faculty_input = document.querySelector(".to_faculty");
const to_time_input = document.querySelector(".to_time");
const change_info_button = document.querySelector(".change-info");

const classSelect = document.getElementById("class-select");
const allTimetablesContainer = document.getElementById("all-timetables");
const template = document.getElementById("timetable-template");

// ✅ Track the currently selected cell
let selectedCell = null;
let selectedLecture = null;
let selectedClassIndex = null;
let selectedDayIndex = null;
let selectedSlotIndex = null;

generateTimetableButton.addEventListener("click", () => {
    
    const selectedIndex = parseInt(classSelect.value);
    const selectedClass = timetable[selectedIndex];
    allTimetablesContainer.innerHTML = "";
    
    const clone = template.content.cloneNode(true);
    
    // const className = "Class " + (selectedIndex + 1) + " Timetable";
    const classNameElement = clone.querySelector(".class-name");
    classNameElement.textContent = "Class " + (selectedIndex + 1) + " Timetable";
    
    const tbody = clone.querySelector(".timetable-body");
    
    for (let slotIndex = 0; slotIndex < LECTURE_SLOTS; slotIndex++) {
        const row = document.createElement("tr");
        
        const timeCell = document.createElement("td");
        timeCell.classList.add("time-cell");
        timeCell.textContent = time[slotIndex];
        row.appendChild(timeCell);
        
        for (let dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {
            const cell = document.createElement("td");
            cell.classList.add("lecture-cell");
            
            const lecture = selectedClass[dayIndex][slotIndex];
            cell.textContent = lecture ? `${lecture.name} \n (${lecture.teacher})` : "FREE";
            // cell.textContent += lecture ? `\n(${lecture.teacher})` : "";
            
            // ✅ Add styling for better UX
            if (lecture) {
                cell.style.cursor = "pointer";
                cell.style.transition = "background-color 0.3s";
            }
            
            row.appendChild(cell);
            
            // ✅ Click handler - store reference to THIS specific cell
            cell.addEventListener("click", () => {
                if (!lecture) {
                    alert("This is a FREE period");
                    return;
                }
                
                const userConfirmed = confirm(
                    `📚 Subject: ${lecture.name}\n👨‍🏫 Teacher: ${lecture.teacher}\n🏫 Class: ${selectedIndex + 1}\n📅 Day: ${DAYS[dayIndex]}\n⏰ Time: ${time[slotIndex]}\n\nDo you want to edit this lecture?`
                );
                
                if (userConfirmed) {
                    // ✅ Remove highlight from previously selected cell
                    if (selectedCell) {
                        selectedCell.style.backgroundColor = "";
                        selectedCell.style.border = "";
                    }
                    
                    // ✅ Store the selected cell and its data
                    selectedCell = cell;
                    selectedLecture = lecture;
                    selectedClassIndex = selectedIndex;
                    selectedDayIndex = dayIndex;
                    selectedSlotIndex = slotIndex;
                    
                    // ✅ Highlight the selected cell
                    cell.style.backgroundColor = "#ffffcc";
                    cell.style.border = "2px solid #ff9800";
                    
                    // Scroll to the form
                    subjectTable.scrollIntoView({ behavior: 'smooth' });
                    
                    // Populate current values
                    if (curr_subject_input) curr_subject_input.value = lecture.name;
                    if (curr_faculty_input) curr_faculty_input.value = lecture.teacher;
                    
                    const subjectInfo = subjects.find(s => s.name === lecture.name);
                    if (curr_time_input && subjectInfo) {
                        curr_time_input.value = subjectInfo.lecturesPerWeek;
                    }
                    
                    // Clear the "change to" fields
                    if (to_subject_input) to_subject_input.value = "";
                    if (to_faculty_input) to_faculty_input.value = "";
                    if (to_time_input) to_time_input.value = "";
                    
                    console.log("Selected:", {
                        subject: lecture.name,
                        teacher: lecture.teacher,
                        class: selectedIndex + 1,
                        day: DAYS[dayIndex],
                        slot: slotIndex + 1
                    });
                } else {
                    console.log("User cancelled editing");
                }
            });
            
            // ✅ Hover effects
            cell.addEventListener("mouseenter", () => {
                if (lecture && cell !== selectedCell) {
                    cell.style.backgroundColor = "#4f9fe159";
                }
            });
            
            cell.addEventListener("mouseleave", () => {
                if (cell !== selectedCell) {
                    cell.style.backgroundColor = "";
                }
            });
        }
        
        tbody.appendChild(row);
    }
    
    allTimetablesContainer.appendChild(clone);

    workloadSection.style.display = "block";
    workloadSection.scrollIntoView({ behavior: "smooth" });

});

// ✅ Single event listener for the change button (outside the cell click)
change_info_button.addEventListener("click", () => {
    if (!selectedCell || !selectedLecture) {
        alert("Please select a lecture cell first!");
        return;
    }
    
    const newSubject = to_subject_input.value.trim(); // "   Mathematics   " ---> "Mathematics"
    const newFaculty = to_faculty_input.value.trim();
    // const newTime = to_time_input.value.trim();
    
    if (!newSubject && !newFaculty) {
        alert("Please enter at least a new subject or faculty!");
        return;
    }
    
    // ✅ Update the timetable data structure
    const updatedSubject = newSubject || selectedLecture.name;
    const updatedTeacher = newFaculty || selectedLecture.teacher;
    
    timetable[selectedClassIndex][selectedDayIndex][selectedSlotIndex] = {
        name: updatedSubject,
        teacher: updatedTeacher
    };
    
    // ✅ Update ONLY the selected cell's display
    selectedCell.textContent = `${updatedSubject}\n(${updatedTeacher})`;
    
    // ✅ Update the subject in the subjects array if needed
    if (newSubject || newFaculty) {
        const subjectIndex = subjects.findIndex(s => s.name === selectedLecture.name);
        if (subjectIndex !== -1 && newSubject) {
            // If changing subject name
            subjects[subjectIndex].name = updatedSubject;
            subjects[subjectIndex].teacher = updatedTeacher;
        }
        if (subjectIndex !== -1 && newFaculty) {
            // If changing teacher
            subjects[subjectIndex].teacher = updatedTeacher;
        }
    }
    
    // ✅ Clear selection
    selectedCell.style.backgroundColor = "#90ee90"; // Light green to show it was changed
    selectedCell.style.border = "2px solid #4caf50";
    
    setTimeout(() => {
        if (selectedCell) {
            selectedCell.style.backgroundColor = "";
            selectedCell.style.border = "";
        }
    }, 2000);
    
    // Clear form fields
    curr_subject_input.value = "";
    curr_faculty_input.value = "";
    curr_time_input.value = "";
    to_subject_input.value = "";
    to_faculty_input.value = "";
    to_time_input.value = "";
    
    // Reset selection
    selectedCell = null;
    selectedLecture = null;
    
    console.log("Lecture updated successfully!");
    alert("Lecture updated successfully!");
});

classField.maxlength = NUM_CLASSES.toString().length;
classField.addEventListener("input", () => {
    if (classField.value.length > classField.maxLength) {
        classField.value = classField.value.slice(0, classField.maxLength);
    }
});

classForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    NUM_CLASSES = Number(classField.value) || 4;
    console.log("Number of Classes set to:", NUM_CLASSES);
    
    finalTimetables.length = 0;
    Object.keys(classesCount).forEach(k => delete classesCount[k]);
    
    initializeTimetable();
    
    console.log("Before generateTimetable");
    console.log("Timetable structure:", timetable);
    
    if (!generateTimetable(0, 0, 0)) {
        console.log("❌ Could not generate timetable with current constraints.");
        return;
    }
    
    console.log("After generateTimetable");
    console.log("Generated timetable:", timetable);
    
    classSelect.innerHTML = '';
    for (let i = 0; i < NUM_CLASSES; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Class ${i + 1}`;
        classSelect.appendChild(option);
    }
});



if (generateTimetableButton.clicked !== true) {
    generateTimetableButton.click();
}

workloadSection.style.display("none")