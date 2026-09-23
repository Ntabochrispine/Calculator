// MATH FUNCTIONS

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "ERROR";
    }

    return a / b;
}


// OPERATE

function operate(operator, a, b) {

    a = Number(a);
    b = Number(b);

    switch (operator) {

        case "+":
            return add(a, b);

        case "-":
            return subtract(a, b);

        case "*":
            return multiply(a, b);

        case "/":
            return divide(a, b);

        default:
            return null;
    }
}


// VARIABLES

let firstNumber = "";
let secondNumber = "";
let currentOperator = null;

let waitingForSecondNumber = false;
let shouldResetDisplay = false;


// DISPLAY

const previousDisplay =
    document.querySelector("#previous-display");

const currentDisplay =
    document.querySelector("#current-display");


// BUTTONS

const numberButtons =
    document.querySelectorAll(".number");

const operatorButtons =
    document.querySelectorAll(".operator");

const equalsButton =
    document.querySelector("#equals");

const clearButton =
    document.querySelector("#clear");

const decimalButton =
    document.querySelector("#decimal");

const backspaceButton =
    document.querySelector("#backspace");


// DISPLAY FUNCTIONS

function updateCurrentDisplay(value) {
    currentDisplay.textContent = value;
}

function updatePreviousDisplay(value) {
    previousDisplay.textContent = value;
}


// OPERATOR SYMBOL

function getOperatorSymbol(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return "";
    }
}


// ROUND RESULT

function roundResult(number) {

    if (!Number.isFinite(number)) {
        return number;
    }

    return Math.round(
        (number + Number.EPSILON) * 10000000000
    ) / 10000000000;
}


// INPUT NUMBER

function inputNumber(number) {

    // If an operation has just been completed,
    // start a completely new calculation.
    if (shouldResetDisplay) {

        firstNumber = number;
        secondNumber = "";
        currentOperator = null;

        updatePreviousDisplay("");
        updateCurrentDisplay(number);

        shouldResetDisplay = false;
        waitingForSecondNumber = false;

        return;
    }


    // If an operator was just pressed,
    // start the SECOND number with this digit.
    if (waitingForSecondNumber) {

        secondNumber = number;

        updateCurrentDisplay(number);

        waitingForSecondNumber = false;

        return;
    }


    // Prevent more than 15 characters.
    if (currentDisplay.textContent.length >= 15) {
        return;
    }


    // Prevent the first number from becoming 00, 000, etc.
    if (currentDisplay.textContent === "0") {

        updateCurrentDisplay(number);

    } else {

        updateCurrentDisplay(
            currentDisplay.textContent + number
        );
    }


    // Store the number in the correct variable.
    if (currentOperator === null) {

        firstNumber =
            currentDisplay.textContent;

    } else {

        secondNumber =
            currentDisplay.textContent;
    }
}


// INPUT OPERATOR

function inputOperator(operator) {

    if (
        currentDisplay.textContent === "ERROR" ||
        currentDisplay.textContent === "Nice try!"
    ) {
        return;
    }


    // If an operator already exists and we already
    // have a second number, calculate first.
    if (
        currentOperator !== null &&
        secondNumber !== "" &&
        !waitingForSecondNumber
    ) {

        const result = calculate(false);

        if (result === "ERROR") {
            return;
        }

        firstNumber = result.toString();
    }


    // If there is no first number yet,
    // use the current display.
    if (firstNumber === "") {

        firstNumber =
            currentDisplay.textContent;
    }


    // Store the new operator.
    currentOperator = operator;

    // The next number typed starts a NEW number.
    waitingForSecondNumber = true;

    shouldResetDisplay = false;


    // Show the expression on the upper display.
    updatePreviousDisplay(
        `${firstNumber} ${getOperatorSymbol(currentOperator)}`
    );
}


// CALCULATE

function calculate(showResult = true) {

    // Do not calculate incomplete operations.
    if (
        firstNumber === "" ||
        secondNumber === "" ||
        currentOperator === null
    ) {
        return null;
    }


    const expression =
        `${firstNumber} ${getOperatorSymbol(currentOperator)} ${secondNumber}`;


    let result = operate(
        currentOperator,
        firstNumber,
        secondNumber
    );


    // Division by zero.
    if (result === "ERROR") {

        updatePreviousDisplay(expression);

        updateCurrentDisplay(
            "Nice try!"
        );

        firstNumber = "";
        secondNumber = "";
        currentOperator = null;

        waitingForSecondNumber = false;
        shouldResetDisplay = true;

        return "ERROR";
    }


    result = roundResult(result);


    // Show complete expression above.
    updatePreviousDisplay(expression);


    // Show result below.
    updateCurrentDisplay(result);


    // Store result as first number for chaining.
    firstNumber = result.toString();

    secondNumber = "";
    currentOperator = null;

    waitingForSecondNumber = false;
    shouldResetDisplay = true;


    return result;
}


// NUMBER BUTTONS

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        inputNumber(
            button.dataset.number
        );

    });

});


// OPERATOR BUTTONS

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        inputOperator(
            button.dataset.operator
        );

    });

});


// EQUALS

equalsButton.addEventListener("click", () => {

    calculate(true);

});


// CLEAR

clearButton.addEventListener("click", () => {

    firstNumber = "";
    secondNumber = "";
    currentOperator = null;

    waitingForSecondNumber = false;
    shouldResetDisplay = false;

    updatePreviousDisplay("");
    updateCurrentDisplay("0");

});


// DECIMAL

decimalButton.addEventListener("click", () => {

    // If starting a new calculation
    if (shouldResetDisplay) {

        firstNumber = "0.";
        secondNumber = "";
        currentOperator = null;

        updatePreviousDisplay("");
        updateCurrentDisplay("0.");

        shouldResetDisplay = false;
        waitingForSecondNumber = false;

        return;
    }


    // If an operator was just entered,
    // start the second number as 0.
    if (waitingForSecondNumber) {

        secondNumber = "0.";

        updateCurrentDisplay("0.");

        waitingForSecondNumber = false;

        return;
    }


    // Prevent multiple decimal points.
    if (
        currentDisplay.textContent.includes(".")
    ) {
        return;
    }


    // Add decimal.
    updateCurrentDisplay(
        currentDisplay.textContent + "."
    );


    // Store value.
    if (currentOperator === null) {

        firstNumber =
            currentDisplay.textContent;

    } else {

        secondNumber =
            currentDisplay.textContent;
    }

});


// BACKSPACE

backspaceButton.addEventListener("click", () => {

    if (
        currentDisplay.textContent === "Nice try! 😏" ||
        currentDisplay.textContent === "ERROR"
    ) {
        return;
    }

    if (
        waitingForSecondNumber ||
        shouldResetDisplay
    ) {
        return;
    }

    let currentValue =
        currentDisplay.textContent;

    currentValue =
        currentValue.slice(0, -1);

    if (currentValue === "") {
        currentValue = "0";
    }

    updateCurrentDisplay(currentValue);

    if (currentOperator === null) {

        firstNumber = currentValue;

    } else {

        secondNumber = currentValue;
    }

});

// KEYBOARD SUPPORT

document.addEventListener("keydown", (event) => {

    const key = event.key;


    // Numbers
    if (key >= "0" && key <= "9") {

        inputNumber(key);
        return;
    }


    // Decimal
    if (key === ".") {

        decimalButton.click();
        return;
    }


    // Operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        inputOperator(key);
        return;
    }


    // Equals
    if (
        key === "Enter" ||
        key === "="
    ) {

        calculate(true);
        return;
    }


    // Backspace
    if (key === "Backspace") {

        backspaceButton.click();
        return;
    }


    // Clear
    if (
        key === "Escape" ||
        key.toLowerCase() === "c"
    ) {

        clearButton.click();
    }

});