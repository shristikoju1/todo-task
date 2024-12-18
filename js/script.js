//Toggle switch
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle-button2").classList.add("active");
  document.body.classList.add("default-mode");
  document.body.style.background =
    "linear-gradient(90deg, #87ceeb, #9dd6ee, #9dd6ee, #87ceeb)";

  document.querySelectorAll(".tri-state-toggle-button").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".tri-state-toggle-button")
        .forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const buttonId = button.id;

      document.body.style.background = "";
      document.body.style.color = "";
      document.querySelectorAll("li").forEach((li) => (li.style.color = ""));

      if (buttonId === "toggle-button1") {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        document.body.classList.remove("default-mode");
        document.body.style.background =
          "linear-gradient(135deg, #e0d9f5, #ffffff)";
        document.body.style.color = "black";
      } else if (buttonId === "toggle-button2") {
        document.body.style.background =
          "linear-gradient(90deg, #87ceeb, #9dd6ee, #9dd6ee, #87ceeb)";
        document.body.classList.add("default-mode");
        document.body.classList.remove("light-mode");
        document.body.classList.remove("dark-mode");
      } else if (buttonId === "toggle-button3") {
        document.body.style.background = "#1B1B1B";
        document.body.style.color = "white";
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        document.body.classList.remove("default-mode");
        document.querySelector("nav").style.color = "white";
      }
    });
  });
});

// Calendar setup
const daysTag = document.querySelector(".days"),
  currentDate = document.querySelector(".current-date"),
  prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");
  return `${year}-${formattedMonth}-${formattedDay}`;
};

let todaysDate = formatDate(`${currYear}-${currMonth + 1}-${date.getDate()}`);
// console.log("selected date", todaysDate)

document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks) {
    Object.assign(tasks, storedTasks);
    updateTaskList();
    updateProgress();
    renderCalendar();
  }
});

let tasks = {};

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

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
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "today-date"
        : "";

    let currentDateStr = `${currYear}-${currMonth + 1}-${i}`;

    let hasTasks =
      tasks[currentDateStr]
        ? "task-marked"
        : "";

    liTag += `<li class="${isToday} ${hasTasks}" data-date="${currentDateStr}">${i}</li>`;
  }

  //to create days of the next month
  for (let i = lastDayofMonth; i < 6; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;

  // Add click event to all days to select the date
  addDateSelectionListeners();
};

// Function to add event listeners to calendar days
const addDateSelectionListeners = () => {
  const items = document.querySelectorAll(".days li");

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      items.forEach(function (item) {
        item.classList.remove("active");
      });
      this.classList.add("active");
      todaysDate = this.dataset.date; // Update the selected date
      loadTasksForTodaysDatetodaysDate(); // Load tasks for the selected date
    });
  });
};

prevNextIcon.forEach((icon) => {
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


const calendarIcon = document.querySelector(".date i");
const todayDate = document.querySelector(".todays-date");

const today = new Date();

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const formattedDate = today.toLocaleDateString("en-US", options);

todayDate.innerHTML = formattedDate;

// To-do list setup

// tasks = {};

const taskInput = document.getElementById("taskInput");
const newTaskBtn = document.getElementById("newTask");
const taskList = document.getElementById("tasks");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("numbers");

const addTask = () => {
  const text = taskInput.value.trim();

  if (text) {
    if (!tasks[todaysDate]) {
      tasks[todaysDate] = [];
    }

    tasks[todaysDate].push({
      text: text,
      completed: false,
      date: todaysDate,
    });
    taskInput.value = "";
    updateTaskList();
    updateProgress();
    renderCalendar();
    saveTasks();
  }
};

const updateTaskList = () => {
  taskList.innerHTML = "";

  if (tasks[todaysDate]) {
    tasks[todaysDate].forEach((task, index) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
            <div class='taskItem'>
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type='checkbox' class='checkbox' ${
                      task.completed ? "checked" : ""
                    }>
                    <p id = 'list'>${task.text}</p>
                </div>
                <div class='icons'>
                    <i class='delete fas fa-trash' onClick='deleteTask(${index})'></i>
                    <i class='edit fas fa-pencil-alt' onClick='editTask(${index})'></i>
                </div>
            </div>
            `;

      listItem.querySelector(".checkbox").addEventListener("change", () => {
        toggleTaskComplete(index);
      });

      taskList.append(listItem);
    });
  }
};

const toggleTaskComplete = (index) => {
  tasks[todaysDate][index].completed = !tasks[todaysDate][index].completed;
  updateTaskList();
  updateProgress();
  saveTasks();
};

const deleteTask = (index) => {
  tasks[todaysDate].splice(index, 1);

  // If there are no tasks left for the selected date, delete the date key
  if (tasks[todaysDate].length === 0) {
    delete tasks[todaysDate];

    // Find the date element and remove the "task-marked" class
    const dateElement = document.querySelector(`[data-date="${todaysDate}"]`);
    console.log('Date element',dateElement);
    if (dateElement) {
      dateElement.classList.remove("task-marked");
    }
  }

  // Update the UI and save changes
  updateTaskList();
  updateProgress();
  saveTasks();
  renderCalendar();
};

const updateProgress = () => {
  const totalTasks = tasks[todaysDate] ? tasks[todaysDate].length : 0;
  const completedTasks = tasks[todaysDate]
    ? tasks[todaysDate].filter((task) => task.completed).length
    : 0;
  const progressPercentage =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `${completedTasks} / ${totalTasks}`;

  if (progressPercentage === 100) {
    blaskConfetti();
  }
};

newTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

const editTask = (index) => {
  taskInput.value = tasks[todaysDate][index].text;
  tasks[todaysDate].splice(index, 1);
  updateTaskList();
  updateProgress();
  saveTasks();
};

// Load tasks for the selected date
const loadTasksForTodaysDatetodaysDate = () => {
  updateTaskList();
  updateProgress();
  saveTasks();
  // renderCalendar();
};

// Initially load tasks for the default selected date
// loadTasksForTodaysDatetodaysDate();

//Confetti
const blaskConfetti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Fetch and display today's info from JSON
const updateTodayInfo = (todaysDate) => {
  const nepaliDate = document.querySelector(".nepali-date");
  const tithiElement = document.querySelector(".tithi");
  const eventsElement = document.querySelector(".events");
  const holidayElement = document.querySelector(".holiday");

  fetch("../calendar.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const currentDateData = data.find((item) => item.date === todaysDate);
      // console.log(currentDateData);
      // console.log(currentDateData.date);
      // console.log(currentDateData.tithi);
      // console.log("Dates in Data: ", data.map(item => item.date)); // e.g., ["2024-08-01", ...]

      if (currentDateData) {
        nepaliDate.innerHTML = currentDateData.nepali_date;
        tithiElement.innerHTML = currentDateData.tithi || "N/A";
        eventsElement.innerHTML = currentDateData.events || "No events";
        holidayElement.innerHTML = currentDateData.holiday ? "Yes" : "No";
      } else {
        tithiElement.innerHTML = "N/A";
        eventsElement.innerHTML = "No events";
        holidayElement.innerHTML = "No";
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};

updateTodayInfo(formatDate(`${currYear}-${currMonth + 1}-${today.getDate()}`));

//GET CURRENT TIME
const currentTime = document.querySelector(".current-time");

function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  // let seconds = now.getSeconds();
  let ampm = "AM";

  if (hours >= 12) {
    ampm = "PM";
    if (hours > 12) hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  minutes = minutes < 10 ? "0" + minutes : minutes;
  // seconds = seconds < 10 ? '0' + seconds : seconds;

  const timeString = `${hours}:${minutes} ${ampm}`;

  currentTime.innerHTML = timeString;
}

setInterval(updateTime, 1000);

updateTime();
renderCalendar();


