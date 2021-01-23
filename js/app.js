// GLOBAL VARS
const user_already_exists = "User already exists.";
const user_does_not_exists = "User does not exist.";
const not_enough_money = "User's balance is insufficient.";
const sender_does_not_exists = "Sender does not exists.";
const receiver_does_not_exists = "Receiver does not exists.";
const only_letters_allowed = "Only letters are allowed in user.";
const only_numbers_allowed = "Only numbers are allowed in amount.";
const cannot_be_negative = "Amount cannot be negative.";

// Display DOMs
const userList = document.getElementById("userList");

// Create User DOMs
const modalErrorCreateUser = document.getElementById("modalErrorCreateUser");
const formCreateUser = document.getElementById("formCreateUser");
const inputCreateUser = document.getElementById("inputCreateUser");
const inputCreateUserAmount = document.getElementById("inputCreateUserAmount");

// Deposit DOMs
const modalErrorDeposit = document.getElementById("modalErrorDeposit");
const formDeposit = document.getElementById("formDeposit");
const inputDepositUser = document.getElementById("inputDepositUser");
const inputDepositAmount = document.getElementById("inputDepositAmount");

// Withdraw DOMs
const modalErrorWithdraw = document.getElementById("modalErrorWithdraw");
const formWithdraw = document.getElementById("formWithdraw");
const inputWithdrawUser = document.getElementById("inputWithdrawUser");
const inputWithdrawAmount = document.getElementById("inputWithdrawAmount");

// Send DOMs
const modalErrorSend = document.getElementById("modalErrorSend");
const formSend = document.getElementById("formSend");
const inputWithdrawFrom = document.getElementById("inputWithdrawFrom");
const inputDepositTo = document.getElementById("inputDepositTo");
const inputTransferAmount = document.getElementById("inputTransferAmount");

// LOAD ALL EVENT LISTENERS WHEN APP LOADS
loadEventListeners();

function loadEventListeners() {
  let users;

  document.addEventListener("DOMContentLoaded", getUsers);

  formCreateUser.addEventListener("submit", function (e) {
    let user = inputCreateUser.value;
    let amount = inputCreateUserAmount.value;
    createUser(user, amount, e);
  });

  formDeposit.addEventListener("submit", deposit);

  formWithdraw.addEventListener("submit", withdraw);

  formSend.addEventListener("submit", send);
}

// FUNCTIONS
// Create new user
function createUser(user, amount, e) {
  // let user = inputCreateUser.value;
  // let amount = inputCreateUserAmount.value;

  if (userExist(user)) {
    e.preventDefault();
    return showModalError(modalErrorCreateUser, user_already_exists);
  }

  if (!lettersOnly(user)) {
    e.preventDefault();
    return showModalError(modalErrorCreateUser, only_letters_allowed);
  }

  if (!numbersOnly(amount)) {
    e.preventDefault();
    return showModalError(modalErrorCreateUser, only_numbers_allowed);
  }
  if (amount >= 0) {
    amount = parseFloat(amount);

    let newUser = new User(user, amount);

    addNewUserInLocalStorage(newUser);

    listUsers();

    return alert(`User ${user} added.`);
  } else {
    e.preventDefault();
    return showModalError(modalErrorCreateUser, cannot_be_negative);
  }
}

// Deposit amount to user
function deposit(e) {
  let user = inputDepositUser.value;
  let amount = inputDepositAmount.value;

  if (!userExist(user)) {
    e.preventDefault();
    return showModalError(modalErrorDeposit, user_does_not_exists);
  }

  if (!numbersOnly(amount)) {
    e.preventDefault();
    return showModalError(modalErrorDeposit, only_numbers_allowed);
  }

  if (amount >= 0) {
    amount = parseFloat(amount);

    // ---------------------

    // check if there are users stored in local storage
    if (localStorage.getItem("users") === null) {
      // if none, set task to none
      users = [];
    } else {
      // if there are users, convert it to array
      users = JSON.parse(localStorage.getItem("users"));
    }
    // ---------------------

    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toLowerCase() == user.toLowerCase()) {
        users[i].balance += amount;

        console.log(
          `New balance for ${users[i].user} is ${balanceFormatter(
            users[i].balance
          )} after deposit.`
        );

        users[i].history.push(
          `Credited ${balanceFormatter(amount)} on ${getCurrentDateTime()}`
        );

        // ---------------------

        localStorage.setItem("users", JSON.stringify(users));

        // ---------------------
        listUsers();

        return users[i].balance;
      }
    }
  } else {
    e.preventDefault();
    return showModalError(modalErrorDeposit, cannot_be_negative);
  }
}

// Withdraw amount from user
function withdraw(e) {
  let user = inputWithdrawUser.value;
  let amount = inputWithdrawAmount.value;

  if (!userExist(user)) {
    // return `User does not exist.`;
    e.preventDefault();
    return showModalError(modalErrorWithdraw, user_does_not_exists);
  }

  if (!numbersOnly(amount)) {
    // return `Only numbers are allowed in amount.`;
    e.preventDefault();
    return showModalError(modalErrorWithdraw, only_numbers_allowed);
  }

  if (amount >= 0) {
    amount = parseFloat(amount);

    // ---------------------

    // check if there are users stored in local storage
    if (localStorage.getItem("users") === null) {
      // if none, set task to none
      users = [];
    } else {
      // if there are users, convert it to array
      users = JSON.parse(localStorage.getItem("users"));
    }
    // ---------------------

    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toLowerCase() == user.toLowerCase()) {
        // check balance if enough to make a withdrawal
        if (users[i].balance >= amount) {
          users[i].balance -= amount;
          console.log(
            `New balance for ${users[i].user} is ${balanceFormatter(
              users[i].balance
            )} after withdrawal.`
          );
          users[i].history.push(
            `Debited ${balanceFormatter(amount)} on ${getCurrentDateTime()}`
          );

          // ---------------------

          localStorage.setItem("users", JSON.stringify(users));

          // ---------------------

          return users[i].balance;
        } else {
          e.preventDefault();
          return showModalError(modalErrorWithdraw, not_enough_money);
        }
      }
    }
  } else {
    e.preventDefault();
    return showModalError(modalErrorWithdraw, cannot_be_negative);
  }
}

// function send(from = "", to = "", amount = 0) {
function send(e) {
  let from = inputWithdrawFrom.value;
  let to = inputDepositTo.value;
  let amount = inputTransferAmount.value;

  if (!userExist(from)) {
    // return `Sender does not exists`;
    // return sender_does_not_exists;
    e.preventDefault();
    return showModalError(modalErrorSend, sender_does_not_exists);
  }

  if (!userExist(to)) {
    // return `Receiver does not exists`;
    // return receiver_does_not_exists;
    e.preventDefault();
    return showModalError(modalErrorSend, receiver_does_not_exists);
  }

  if (from.toLowerCase() == to.toLowerCase()) {
    // return "Sender cannot be the same as receiver.";
    e.preventDefault();
    return showModalError(
      modalErrorSend,
      "Sender cannot be the same as receiver."
    );
  }

  // if (to.toLowerCase() == from.toLowerCase()) {
  //   return "Sender cannot be the same as receiver.";
  // }

  if (!numbersOnly(amount)) {
    // return `Only numbers are allowed in amount.`;
    e.preventDefault();
    return showModalError(modalErrorSend, only_numbers_allowed);
  }

  if (amount >= 0) {
    amount = parseFloat(amount);
    if (getBalance(from) >= amount) {
      let balanceFrom = withdraw(from, amount);
      let balanceTo = deposit(to, amount);
      // return `Balance for ${from} is ${balanceFormatter(
      //   balanceFrom
      // )}, balance for ${to} is ${balanceFormatter(balanceTo)}`;
      return listUsers();
    } else {
      // return `Balance for ${from} is insufficient.`;
      e.preventDefault();
      return showModalError(modalErrorSend, not_enough_money);
    }
  } else {
    // return `Amount cannot be negative.`;
    e.preventDefault();
    return showModalError(modalErrorSend, cannot_be_negative);
  }
}

// UTILITY FUNCTIONS

// Check if user exists
function userExist(user) {
  // Check if user contains only letters
  if (lettersOnly(user)) {
    // if users array is not empty
    if (users.length) {
      let i = 0;

      users.forEach((element) => {
        if (user.toLowerCase() == element.user.toLowerCase()) {
          i++;
        }
      });

      if (i > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function lettersOnly(word) {
  // Allow letters only
  let allowedLetters = /^[A-Za-z]+$/;

  let wordStr = word.toString();

  if (wordStr.match(allowedLetters)) {
    return true;
  } else {
    return false;
  }
}

function numbersOnly(number) {
  // Allow numbers and one dot only
  let allowedNumbers = /^(\-)?\d+(\.\d+)?$/;

  // Convert number to string
  let numberStr = number.toString();

  if (numberStr.match(allowedNumbers)) {
    return true;
  } else {
    return false;
  }
}

function getBalance(user = "") {
  // Check if user exists
  if (userExist(user)) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toUpperCase() == user.toUpperCase()) {
        return users[i].balance;
      }
    }
  } else {
    return `User does not exist.`;
  }
}

function balanceFormatter(amount) {
  amount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Php ${amount}`;
}

function search(input) {
  input = prompt("Find a user:");
  for (let i = 0; i < users.length; i++) {
    if (userExist(input)) {
      if (users[i].user.toLowerCase() == input.toLowerCase()) {
        return users[i];
      }
    } else {
      return user_does_not_exists;
    }
  }
}

// Error Message
function showModalError(modalErrorDOM, errorMsg) {
  modalErrorDOM.style.display = "block";

  modalErrorDOM.innerHTML = `
  <p class="text-danger text-center mt-3 mb-0">${errorMsg}</p>
  `;

  setTimeout(function () {
    modalErrorDOM.style.display = "none";
  }, 3000);
}

// Load tasks once the page is loaded
function getUsers() {
  // let users;
  // check if there are users stored in local storage
  if (localStorage.getItem("users") === null) {
    // if none, set task to none
    users = [];
  } else {
    // if there are users, convert it to array
    users = JSON.parse(localStorage.getItem("users"));
  }

  listUsers();
}

// Store Users array in Local Storage
function addNewUserInLocalStorage(newUser) {
  // let users;
  // check if there are users stored in local storage
  if (localStorage.getItem("users") === null) {
    // if none, set task to none
    users = [];
  } else {
    // if there are users, convert it to array
    users = JSON.parse(localStorage.getItem("users"));
  }

  // and add the new task
  users.push(newUser);
  // convert users to string and set it back to localStorage
  localStorage.setItem("users", JSON.stringify(users));
}

// for timestamp
function getCurrentDateTime() {
  let now = new Date();

  let dateStr = now.toDateString();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  // append 0 before minute and second vars, if their digit is 0 to 9
  minute = (minute < 10 ? "0" : "") + minute;
  second = (second < 10 ? "0" : "") + second;

  return `${dateStr}, ${hour}:${minute}:${second}`;
}

function listUsers() {
  // check if there are users stored in local storage
  if (localStorage.getItem("users") === null) {
    // if none, set task to none
    users = [];
  } else {
    // if there are users, convert it to array
    users = JSON.parse(localStorage.getItem("users"));
  }

  if (!users.length) {
    return `No users exist.`;
  }

  users.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="pl-5">${user.user}</td>
      <td>${balanceFormatter(user.balance)}</td>
    `;

    userList.appendChild(tr);

    console.log(
      `User: ${user.user}, Balance: ${balanceFormatter(user.balance)}`
    );
  });
}

// User Constructor
let User = function (user, balance, history = undefined) {
  this.user = user;
  this.balance = balance;
  this.history = [];
};

// set empty array in each user object to store the logs
// each of the 3 main functions (withdraw, deposit, send) should have a push to the array that records the action and the computer timestamp
// for send, both to and from account should get a log
// push the log at the end of array, but when displaying, show the last one first by looping through it

// create search users function
// loop through all objects and return user name values then match it with the user's input
