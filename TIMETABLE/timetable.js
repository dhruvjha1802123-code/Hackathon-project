// Timetable Generator using Backtracking Algorithm
// 3 Classes, Monday-Friday, 8 Lectures per day
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const classesCount = {};

const finalTimetables = [];
let timetable = [];
// Track teacher availability: teacherSchedule[teacher][day][slot] = true/false
let teacherSchedule = {};

const LECTURE_SLOTS = 5;    // Number of lecture slots per day
let NUM_CLASSES = 4;  // Number of classes to generate timetables for

let subjectCount = []; // subjectCount[class][subject] = number of lectures assigned

// Sample data - you can modify this
const subjects = [
    { name: 'Physics', teacher: 'Prof. Patel', lecturesPerWeek: 4 },
    { name: 'Biology', teacher: 'Prof. Mehta', lecturesPerWeek: 2 },
    { name: 'Chemistry', teacher: 'Prof. Kumar', lecturesPerWeek: 5 },
    { name: 'English', teacher: 'Prof. Desai', lecturesPerWeek: 3},
    { name: 'Mathematics', teacher: 'Prof. Sharma', lecturesPerWeek: 4 },
    { name: 'Computer Science', teacher: 'Prof. Singh', lecturesPerWeek: 3 },
    { name: 'History', teacher: 'Prof. Reddy', lecturesPerWeek: 2 },
    { name: 'Physical Education', teacher: 'Coach Verma', lecturesPerWeek: 3 },
];

function initializeTimetable() {
    timetable = [];
    teacherSchedule = {};
    subjectCount = [];
    finalTimetables.length = 0;
    
    for (let classes = 0; classes < NUM_CLASSES; classes++) {
        timetable[classes] = [];
        for (let days = 0; days < DAYS.length; days++) {
            timetable[classes][days] = Array(LECTURE_SLOTS).fill(null);
        }
    }
    
    for (let c = 0; c < NUM_CLASSES; c++) {
        subjectCount[c] = {};
        subjects.forEach(sub => {
            subjectCount[c][sub.name] = 0;
        });
    }
}
initializeTimetable();
// Check if teacher is available at given time
function isTeacherAvailable(teacher, day, slot) {
    // console.log(teacherSchedule);
    if (!teacherSchedule[teacher]) {
        // console.log(" "+ teacherSchedule[teacher] + " ")
        return true;
    }
    if (!teacherSchedule[teacher][day]) {
        // console.log(teacherSchedule)
        return true;
    }
    if (!teacherSchedule[teacher][day][slot]) {
        // console.log(teacherSchedule)
        return true;
    }
    // console.log(teacherSchedule)
    return false;
}

// Mark teacher as occupied
function occupyTeacher(teacher, day, slot) {
    if (!teacherSchedule[teacher]) {
        teacherSchedule[teacher] = {};
    }
    if (!teacherSchedule[teacher][day]) {
        teacherSchedule[teacher][day] = {};
    }
    teacherSchedule[teacher][day][slot] = true;
    return false;
}

// Free teacher slot
function freeTeacher(teacher, day, slot) {
    if (teacherSchedule[teacher] && teacherSchedule[teacher][day]) {
        teacherSchedule[teacher][day][slot] = false;
    }
}

// Check if subject quota is not exceeded
function canAssignSubject(classNum, subject) {
    return subjectCount[classNum][subject.name] < subject.lecturesPerWeek;
}

// Check constraints for assigning a subject
function isSafe(classNum, day, slot, subject, currTimetable) {
    // Check if teacher is available
    if (!isTeacherAvailable(subject.teacher, day, slot)) {
        return false;
    }
    
    // Check if subject quota allows
    if (!canAssignSubject(classNum, subject)) {
        return false;
    }
    
    // Avoid same subject in consecutive slots (optional constraint)
    if (slot > 0 && timetable[classNum][day][slot - 1]) {
        if (timetable[classNum][day][slot - 1].name === subject.name) {
            return false;
        }
    }

    // Now timetable is accessible
    // console.log(timetable)
    let lecturesOfDay = timetable[classNum][day];
    const foundSubject = lecturesOfDay.find(
        lecture => lecture && lecture.name === subject.name
    );
    
    if (foundSubject) {
        return false;
    }

    // console.log(currTimetable);
    if (!currTimetable) {
        return false;
    }
    return true;
}
// Main backtracking function
function generateTimetable(classNum, day, slot) {
     classesCount[classNum] = (classesCount[classNum] ?? 0) + 1;
    let currTimetable = {};
    // Base case: all classes, days, and slots filled
    if (classNum === NUM_CLASSES) {
        finalTimetables.push(JSON.parse(JSON.stringify(timetable)));
        currTimetable = JSON.stringify(timetable);
        return true;
    }

    // Move to next slot/day/class
    let nextClass = classNum;
    // let prevDay = day - 1;
    let nextDay = day;
    let nextSlot = slot + 1;

    // console.log(currTimetable);
    if (nextSlot === LECTURE_SLOTS) {
        nextSlot = 0;
        nextDay++;
    }

    if (nextDay === DAYS.length) {
        nextDay = 0;
        nextClass++;
        finalTimetables.push(JSON.parse(JSON.stringify(timetable)));
    }


    // Try assigning each subject
    for (let subject of subjects) {
        currTimetable = JSON.stringify(timetable[classNum][day]);
        // console.log("Current Timetable State: " + currTimetable);
        if (isSafe(classNum, day, slot, subject, currTimetable)) {
             // console.log(`is safe: ${subject.name}`)
             // Assign subject
             timetable[classNum][day][slot] = {
                name: subject.name,
                teacher: subject.teacher
             };
             subjectCount[classNum][subject.name]++;
             occupyTeacher(subject.teacher, day, slot);

            // Recurse to next slot
            if (generateTimetable(nextClass, nextDay, nextSlot)) {
                currTimetable = JSON.stringify(timetable[classNum][day][slot]);
                // console.log(currTimetable);
                return true;
            }

             // Backtrack if not successful
             timetable[classNum][day][slot] = null;
             subjectCount[classNum][subject.name]--;
             // console.log("Backtracking: Freeing teacher " + subject.teacher + " for " + DAYS[day] + " slot " + (slot + 1));
             freeTeacher(subject.teacher, day, slot);
        }
    }
    
    return false;
}


// Generate the timetable
console.log("Generating timetable using backtracking...");
const success = generateTimetable(0, 0, 0);
if (success) {
    console.log("✅ Timetable generated successfully!\n");
    
    // Display timetable for each class
    for (let c = 0; c < NUM_CLASSES; c++) {
        console.log(`\n${"=".repeat(80)}`);
        console.log(`CLASS ${c + 1} TIMETABLE`);
        console.log("=".repeat(80));
        
        // Header
        console.log("\nSlot".padEnd(8) + DAYS.map(d => d.padEnd(20)).join(""));
        console.log("-".repeat(108));
        
        // Each lecture slot
        for (let slot = 0; slot < LECTURE_SLOTS; slot++) {
            let row = `${slot + 1}`.padEnd(8);
            for (let day = 0; day < DAYS.length; day++) {
                const lecture = timetable[c][day][slot];
                if (lecture) {
                    row += `${lecture.name}`.padEnd(20);
                } else {
                    row += "FREE".padEnd(20);
                }
            }
            console.log(row);
        }
        
        // Subject summary
        console.log("\n" + "-".repeat(108));
        console.log("Subject Distribution:");
        for (let subject of subjects) {
            const count = subjectCount[c][subject.name];
            if (count > 0) {
                console.log(`  ${subject.name}: ${count} lectures (${subject.teacher})`);
            }
        }
    }
    
    // Teacher schedule summary
    console.log("\n" + "=".repeat(80));
    console.log("TEACHER WORKLOAD SUMMARY");
    console.log("=".repeat(80));
    
    for (let subject of subjects) {
        let totalLectures = 0;
        for (let c = 0; c < NUM_CLASSES; c++) {
            totalLectures += subjectCount[c][subject.name];
        }
        console.log(`${subject.teacher.padEnd(20)} - ${totalLectures} lectures/week`);
    }
    
} else {
    console.log("❌ Could not generate timetable with current constraints.");
    console.log("Try adjusting:");
    console.log("- Number of lectures per week for each subject");
    console.log("- Number of lecture slots per day");
    console.log("- Constraints in the isSafe() function");
}

const filteredTimetables = finalTimetables.filter(timetable => timetable[NUM_CLASSES - 1][3][4] !== null && timetable[NUM_CLASSES - 1][3][LECTURE_SLOTS - 1] !== undefined);
console.log("Filtered Timetables Length: " + filteredTimetables.length);
// console.log(filteredTimetables[17][3]);

const BestTimetable = []
// const BestTimetable = finalTimetables[finalTimetables.length - 1];
// for (let i = 0; i < 4; i++) {
//     BestTimetable.push(finalTimetables[finalTimetables.length - i - 1]);

//     for (let day = 0; day < DAYS.length; day++) {
//         for (let slot = 0; slot < LECTURE_SLOTS; slot++) {
//             console.log(BestTimetable[i][day][slot]);
//         }
//     }
// }

// console.log(BestTimetable[0][0]);
console.log(finalTimetables.length);
// console.log(finalTimetables)

