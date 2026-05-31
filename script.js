const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const historyPanel = document.getElementById("historyPanel");
const calculator = document.querySelector(".calculator");
const themeButton = document.querySelector(".toggle");

// Load saved data
loadHistory();
loadTheme();

//BASIC FUNCTIONS


function appendValue(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}


//SCIENTIFIC MODE


function toggleScientific() {
    document
        .getElementById("scientificPanel")
        .classList.toggle("hidden");

    calculator.classList.toggle("scientific");
}

function appendFunction(func) {
    switch (func) {
        case "sin(":
            display.value += "sin(";
            break;

        case "cos(":
            display.value += "cos(";
            break;

        case "tan(":
            display.value += "tan(";
            break;

        case "log(":
            display.value += "log(";
            break;

        case "ln(":
            display.value += "ln(";
            break;

        case "sqrt(":
            display.value += "sqrt(";
            break;

        case "square(":
            display.value += "^2";
            break;

        case "power(":
            display.value += "^";
            break;
    }
}

//CALCULATE


function calculate() {

    try {

        let expression = display.value;

        // Constants
        expression = expression.replace(/π/g, Math.PI);
        expression = expression.replace(/\be\b/g, Math.E);

        // Percentage
        expression = expression.replace(
            /(\d+)%/g,
            (_, n) => Number(n) / 100
        );

        // Square Root
        expression = expression.replace(
            /sqrt\(([^)]+)\)/g,
            (_, n) => Math.sqrt(Number(n))
        );

        // Square
        expression = expression.replace(
            /(\d+)\^2/g,
            (_, n) => Math.pow(Number(n), 2)
        );

        // Power
        expression = expression.replace(
            /(\d+)\^(\d+)/g,
            (_, a, b) => Math.pow(Number(a), Number(b))
        );

        // Trigonometric Functions
        expression = expression.replace(
            /sin\(([^)]+)\)/g,
            (_, n) =>
                Math.sin(Number(n) * Math.PI / 180)
        );

        expression = expression.replace(
            /cos\(([^)]+)\)/g,
            (_, n) =>
                Math.cos(Number(n) * Math.PI / 180)
        );

        expression = expression.replace(
            /tan\(([^)]+)\)/g,
            (_, n) =>
                Math.tan(Number(n) * Math.PI / 180)
        );

        // Logs
        expression = expression.replace(
            /log\(([^)]+)\)/g,
            (_, n) => Math.log10(Number(n))
        );

        expression = expression.replace(
            /ln\(([^)]+)\)/g,
            (_, n) => Math.log(Number(n))
        );

        // Final Calculation
        const result = Function(
            '"use strict"; return (' +
            expression +
            ')'
        )();

        display.value = Number(result.toFixed(10));

        saveHistory(
            `${display.value} ← ${expression}`
        );

    } catch (error) {
        display.value = "Error";
    }
}


//HISTORY


function saveHistory(item) {

    let history =
        JSON.parse(
            localStorage.getItem("calcHistory")
        ) || [];

    history.unshift(item);

    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem(
        "calcHistory",
        JSON.stringify(history)
    );

    loadHistory();
}

function loadHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("calcHistory")
        ) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            "<div class='history-item'>No history available</div>";

        return;
    }

    history.forEach(item => {

        const div =
            document.createElement("div");

        div.classList.add("history-item");

        div.textContent = item;

        historyList.appendChild(div);
    });
}

function clearHistory() {

    if (confirm("Clear all history?")) {

        localStorage.removeItem(
            "calcHistory"
        );

        loadHistory();
    }
}

function toggleHistory() {
    historyPanel.classList.toggle("hidden");
}

//COPY RESULT


function copyResult() {

    if (!display.value) {
        alert("Nothing to copy");
        return;
    }

    navigator.clipboard
        .writeText(display.value)
        .then(() => {
            alert("Result copied!");
        });
}

//THEME


function toggleTheme() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
    );

    themeButton.textContent =
        dark ? "☀️" : "🌙";
}

function loadTheme() {

    const theme =
        localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeButton.textContent = "☀️";

    } else {

        themeButton.textContent = "🌙";
    }
}


//KEYBOARD SUPPORT


document.addEventListener(
    "keydown",
    (event) => {

        const key = event.key;

        if (
            "0123456789+-*/().%"
            .includes(key)
        ) {
            appendValue(key);
        }

        if (key === "Enter") {
            event.preventDefault();
            calculate();
        }

        if (key === "Backspace") {
            deleteLast();
        }

        if (key === "Escape") {
            clearDisplay();
        }
    }
);


//CLOSE HISTORY


document.addEventListener(
    "click",
    (event) => {

        const historyClick =
            historyPanel.contains(
                event.target
            );

        const historyBtn =
            event.target.closest(
                ".history-btn"
            );

        if (
            !historyClick &&
            !historyBtn &&
            !historyPanel.classList.contains(
                "hidden"
            )
        ) {
            historyPanel.classList.add(
                "hidden"
            );
        }
    }
);