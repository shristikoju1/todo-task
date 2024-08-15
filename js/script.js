//Toggle switch
$(document).ready(function() {
    $("#toggle-button2").addClass("active");
    $("body").addClass("default-mode");
    document.body.style.background = "linear-gradient(135deg, #5AA9AD, #bda5ff)";

    $(".tri-state-toggle-button").click(function() {

        // Remove the active class from all buttons
        $(".tri-state-toggle-button").removeClass("active");

        // Add the active class to the clicked button
        $(this).addClass("active");

        const buttonId = $(this).attr('id');

        document.body.style.background = "";
        document.body.style.color = ""; 
        $('li').css('color', ''); 

        if (buttonId === "toggle-button1") {
            $("body").addClass("light-mode");
            document.body.style.background = "linear-gradient(135deg, #e0d9f5, #ffffff)";
            document.body.style.color = "black";

        } else if (buttonId === "toggle-button2") {
            document.body.style.background = "linear-gradient(135deg, #6ac1c5, #bda5ff)";


        } else if (buttonId === "toggle-button3") {
            document.body.style.background = "linear-gradient(135deg, #2c003e, #0d0d0d)";
            document.body.style.color = "white";
            // $('li').css('color', 'white');
        }
    });
});


// Calendar setup
const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

let selectedDate = `${currYear}-${currMonth + 1}-${date.getDate()}`; 

let tasks = {};

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";
  

//to create days of the previous month
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    //to create days of the current month
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";

      // Check if the current date has tasks
      let currentDateStr = `${currYear}-${currMonth + 1}-${i}`;

      let hasTasks = tasks[currentDateStr] && tasks[selectedDate].length > 0 ? "task-marked" : "";
      liTag += `<li class="${isToday} ${hasTasks}" data-date="${currentDateStr}">${i}</li>`;
      if(liTag === ''){
        liTag += `<li class="${isToday} "data-date="${currentDateStr}">${i}</li>`;

      }
      console.log(tasks[currentDateStr]);
      console.log(hasTasks)


        // liTag += `<li class="${isToday}" data-date="${currYear}-${currMonth + 1}-${i}">${i}</li>`;
       
    }


    //to create days of the next month
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    // Add click event to all days to select the date
    const allDays = daysTag.querySelectorAll("li");
    allDays.forEach(day => {
        day.addEventListener("click", () => {
            if (!day.classList.contains('inactive')) {
                selectedDate = day.dataset.date;
                renderCalendar();
                loadTasksForSelectedDate();
            }
        });
    });
};

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

// To-do list setup

// tasks = {};

const taskInput = document.getElementById('taskInput');
const newTaskBtn = document.getElementById('newTask');
const taskList = document.getElementById('tasks');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('numbers');

const addTask = () => {
    const text = taskInput.value.trim();

    if (text) {
        if (!tasks[selectedDate]) {
            tasks[selectedDate] = [];
        }

        // const currentDate = new Date();
        // const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        // const formattedDate = currentDate.toLocaleDateString(); 

        tasks[selectedDate].push({
             text: text, 
             completed: false,  
             date: selectedDate
        });
        taskInput.value = '';
        updateTaskList();
        updateProgress();
        renderCalendar();
        // console.log(tasks[selectedDate]);
    }
};

const updateTaskList = () => {
    taskList.innerHTML = '';

    if (tasks[selectedDate]) {
        tasks[selectedDate].forEach((task, index) => {
            const listItem = document.createElement('li');

            listItem.innerHTML = `
            <div class='taskItem'>
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type='checkbox' class='checkbox' ${task.completed ? "checked" : ''}>
                    <p>${task.text}</p>
                </div>
                <div class='icons'>
                    <i class='delete fas fa-trash' onClick='deleteTask(${index})'></i>
                    <i class='edit fas fa-pencil-alt' onClick='editTask(${index})'></i>
                </div>
            </div>
            `;

            listItem.querySelector('.checkbox').addEventListener('change', () => {
                toggleTaskComplete(index);
            });

            taskList.append(listItem);
        });
    }
};

const toggleTaskComplete = (index) => {
    tasks[selectedDate][index].completed = !tasks[selectedDate][index].completed;
    updateTaskList();
    updateProgress();
};

const deleteTask = (index) => {
    tasks[selectedDate].splice(index, 1);
    updateTaskList();
    updateProgress();
};

const updateProgress = () => {
    const totalTasks = tasks[selectedDate] ? tasks[selectedDate].length : 0;
    const completedTasks = tasks[selectedDate] ? tasks[selectedDate].filter(task => task.completed).length : 0;
    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${completedTasks} / ${totalTasks}`;
};

newTaskBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

const editTask = (index) => {
    const newTaskText = prompt("Edit your task:", tasks[selectedDate][index].text);

    if (newTaskText !== null && newTaskText.trim() !== "") {
        tasks[selectedDate][index].text = newTaskText.trim();
        updateTaskList();
        updateProgress();
    }
};

// Load tasks for the selected date
const loadTasksForSelectedDate = () => {
    updateTaskList();
    updateProgress();
};

// Initially load tasks for the default selected date
loadTasksForSelectedDate();
