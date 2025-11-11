// Extract teacher workload data from your timetable generator
function extractTeacherWorkload() {
    const workloadData = {};
    
    // Iterate through all classes and subjects
    for (let c = 0; c < NUM_CLASSES; c++) {
        for (let subject of subjects) {
            const teacherName = subject.teacher;
            const lectureCount = subjectCount[c][subject.name];
            
            if (!workloadData[teacherName]) {
                workloadData[teacherName] = 0;
            }
            workloadData[teacherName] += lectureCount;
        }
    }
    
    return workloadData;
}

// Initialize and render the chart
function initializeWorkloadChart() {
    const workloadData = extractTeacherWorkload();
    const teachers = Object.keys(workloadData);
    const lectures = Object.values(workloadData);
    
    // Define colors for visual appeal
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#30cfd0', '#330867'
    ];
    
    const ctx = document.getElementById('workloadChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teachers,
            datasets: [{
                label: 'Lectures per Week',
                data: lectures,
                backgroundColor: colors.slice(0, teachers.length),
                borderColor: colors.slice(0, teachers.length),
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(0, 0, 0, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 11 },
                        stepSize: 2
                    },
                    title: {
                        display: true,
                        text: 'Number of Lectures',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 }
                    }
                }
            }
        }
    });
    
    return chart;
}

// Display statistics cards
function displayStatistics() {
    const workloadData = extractTeacherWorkload();
    const lectures = Object.values(workloadData);
    
    const maxLectures = Math.max(...lectures);
    const minLectures = Math.min(...lectures);
    const avgLectures = (lectures.reduce((a, b) => a + b, 0) / lectures.length).toFixed(1);
    const totalLectures = lectures.reduce((a, b) => a + b, 0);
    
    const maxTeacher = Object.keys(workloadData).find(t => workloadData[t] === maxLectures);
    const minTeacher = Object.keys(workloadData).find(t => workloadData[t] === minLectures);
    
    const statsHTML = `
        <div class="stat-card">
            <div class="stat-label">Highest Workload</div>
            <div class="stat-value">${maxLectures}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${maxTeacher}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Lowest Workload</div>
            <div class="stat-value">${minLectures}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${minTeacher}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Average Workload</div>
            <div class="stat-value">${avgLectures}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">lectures/week</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Total Lectures</div>
            <div class="stat-value">${totalLectures}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">all classes combined</div>
        </div>
    `;
    
    document.getElementById('statsContainer').innerHTML = statsHTML;
}

// Run after your timetable is generated
function renderWorkloadVisualization() {
    initializeWorkloadChart();
    displayStatistics();
}

// Call this after your generateTimetable() completes
if (success) {
    renderWorkloadVisualization();
}
