// GLOBAL VARS

// ----------------------------------------------------------

const user_already_exists = "Username already exists.";
const user_does_not_exists = "Username does not exist.";
const not_enough_money = "User's balance is insufficient.";
const sender_does_not_exists = "Sender does not exist.";
const receiver_does_not_exists = "Receiver does not exist.";
const only_letters_allowed = "Only letters are allowed in username.";
const only_numbers_allowed = "Only numbers are allowed in amount.";
const cannot_be_negative = "Amount cannot be negative.";

// Display DOMs
const userslist = document.getElementById("userslist");
const userList = document.getElementById("userList");
const displayUserHistory = document.getElementById("displayUserHistory");
const displayUserHistoryData = document.getElementById(
  "displayUserHistoryData"
);

// Create User DOMs
const modalErrorCreateUser = document.getElementById("modalErrorCreateUser");
const formCreateUser = document.getElementById("formCreateUser");
const inputCreateUsername = document.getElementById("inputCreateUsername");

const inputCreateUserFullName = document.getElementById(
  "inputCreateUserFullName"
);

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

// Search By User DOMs
const modalErrorSearchByUser = document.getElementById(
  "modalErrorSearchByUser"
);
const formSearchByUser = document.getElementById("formSearchByUser");
const inputSearchByUser = document.getElementById("inputSearchByUser");

// Search By Full Name DOMs
const modalErrorSearchByFullName = document.getElementById(
  "modalErrorSearchByFullName"
);
const formSearchByFullName = document.getElementById("formSearchByFullName");
const inputSearchByFullName = document.getElementById("inputSearchByFullName");

// LOAD ALL EVENT LISTENERS WHEN APP LOADS
loadEventListeners();

function loadEventListeners() {
  let users;

  // create array for users found
  let fullNames;

  document.addEventListener("DOMContentLoaded", listUsers);

  formCreateUser.addEventListener("submit", function (e) {
    let username = inputCreateUsername.value;
    let fullName = inputCreateUserFullName.value;
    let amount = inputCreateUserAmount.value;

    createUser(username, fullName, amount, e);
  });

  formDeposit.addEventListener("submit", function (e) {
    let user = inputDepositUser.value;
    let amount = inputDepositAmount.value;

    deposit(user, amount, e);
  });

  formWithdraw.addEventListener("submit", function (e) {
    let user = inputWithdrawUser.value;
    let amount = inputWithdrawAmount.value;

    withdraw(user, amount, e);
  });

  formSend.addEventListener("submit", function (e) {
    let from = inputWithdrawFrom.value;
    let to = inputDepositTo.value;
    let amount = inputTransferAmount.value;

    send(from, to, amount, e);
  });

  formSearchByUser.addEventListener("submit", function (e) {
    let user = inputSearchByUser.value;

    search(user, e);
  });

  formSearchByFullName.addEventListener("submit", function (e) {
    let fullName = inputSearchByFullName.value;

    searchFullName(fullName, e);
  });
}

// FUNCTIONS

// Create new user
function createUser(user, fullName, amount, e) {
  if (userExist(user)) {
    e.preventDefault();

    inputCreateUsername.value = "";
    inputCreateUserAmount.value = "";

    return showModalError(modalErrorCreateUser, user_already_exists);
  }

  if (!lettersOnly(user)) {
    e.preventDefault();

    inputCreateUsername.value = "";
    inputCreateUserAmount.value = "";

    return showModalError(modalErrorCreateUser, only_letters_allowed);
  }

  if (!lettersSpaceOnly(fullName)) {
    e.preventDefault();

    inputCreateUserFullName.value = "";
    inputCreateUserAmount.value = "";

    return showModalError(
      modalErrorCreateUser,
      `Only letters allowed in Full Name.`
    );
  }

  if (!numbersOnly(amount)) {
    e.preventDefault();

    inputCreateUserAmount.value = "";

    return showModalError(modalErrorCreateUser, only_numbers_allowed);
  }
  if (amount >= 0) {
    amount = parseFloat(amount);

    let newUser = new User(user, fullName, amount);

    addNewUserInLocalStorage(newUser);

    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toLowerCase() == user.toLowerCase()) {
        users[i].history.push(
          `Account created with initial balance of ${balanceFormatter(
            amount
          )} on ${getCurrentDateTime()}`
        );
      }
    }

    localStorage.setItem("users", JSON.stringify(users));

    // e.preventDefault();
    console.log(`User ${fullName} added.`);
    alert(`User ${fullName} added.`);
  } else {
    e.preventDefault();

    inputCreateUserAmount.value = "";

    return showModalError(modalErrorCreateUser, cannot_be_negative);
  }
}

// Deposit amount to user
function deposit(user, amount, e) {
  if (!userExist(user)) {
    e.preventDefault();

    inputDepositUser.value = "";
    inputDepositAmount.value = "";

    return showModalError(modalErrorDeposit, user_does_not_exists);
  }

  if (!numbersOnly(amount)) {
    e.preventDefault();

    inputDepositAmount.value = "";

    return showModalError(modalErrorDeposit, only_numbers_allowed);
  }

  if (amount >= 0) {
    amount = parseFloat(amount);

    // check if there are users stored in local storage
    if (localStorage.getItem("users") === null) {
      // if none, set task to none
      users = [];
    } else {
      // if there are users, convert it to array
      users = JSON.parse(localStorage.getItem("users"));
    }

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

        // convert users array to string before displaying users list in DOM
        localStorage.setItem("users", JSON.stringify(users));

        // e.preventDefault();

        alert(
          `New balance for ${users[i].user} is ${balanceFormatter(
            users[i].balance
          )} after deposit.`
        );

        return users[i].balance;
      }
    }
  } else {
    e.preventDefault();

    inputDepositAmount.value = "";

    return showModalError(modalErrorDeposit, cannot_be_negative);
  }
}

// Withdraw amount from user
function withdraw(user, amount, e) {
  if (!userExist(user)) {
    e.preventDefault();

    inputWithdrawUser.value = "";
    inputWithdrawAmount.value = "";

    return showModalError(modalErrorWithdraw, user_does_not_exists);
  }

  if (!numbersOnly(amount)) {
    e.preventDefault();

    inputWithdrawAmount.value = "";

    return showModalError(modalErrorWithdraw, only_numbers_allowed);
  }

  if (amount >= 0) {
    amount = parseFloat(amount);

    // check if there are users stored in local storage
    if (localStorage.getItem("users") === null) {
      // if none, set task to none
      users = [];
    } else {
      // if there are users, convert it to array
      users = JSON.parse(localStorage.getItem("users"));
    }

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

          // convert users array to string before displaying users list in DOM
          localStorage.setItem("users", JSON.stringify(users));

          // e.preventDefault();

          alert(
            `New balance for ${users[i].user} is ${balanceFormatter(
              users[i].balance
            )} after withdrawal.`
          );

          return users[i].balance;
        } else {
          e.preventDefault();

          inputWithdrawAmount.value = "";

          return showModalError(modalErrorWithdraw, not_enough_money);
        }
      }
    }
  } else {
    e.preventDefault();

    inputWithdrawAmount.value = "";

    return showModalError(modalErrorWithdraw, cannot_be_negative);
  }
}

function send(from, to, amount, e) {
  if (!userExist(from)) {
    e.preventDefault();

    inputWithdrawFrom.value = "";
    inputDepositTo.value = "";
    inputTransferAmount.value = "";

    return showModalError(modalErrorSend, sender_does_not_exists);
  }

  if (!userExist(to)) {
    e.preventDefault();

    inputWithdrawFrom.value = "";
    inputDepositTo.value = "";
    inputTransferAmount.value = "";

    return showModalError(modalErrorSend, receiver_does_not_exists);
  }

  if (from.toLowerCase() == to.toLowerCase()) {
    e.preventDefault();

    inputWithdrawFrom.value = "";
    inputDepositTo.value = "";
    inputTransferAmount.value = "";

    return showModalError(
      modalErrorSend,
      "Sender cannot be the same as receiver."
    );
  }

  if (!numbersOnly(amount)) {
    e.preventDefault();

    inputTransferAmount.value = "";

    return showModalError(modalErrorSend, only_numbers_allowed);
  }

  if (amount >= 0) {
    amount = parseFloat(amount);
    if (getBalance(from) >= amount) {
      let balanceFrom = withdraw(from, amount);
      let balanceTo = deposit(to, amount);

      // return listUsers();
      return;
    } else {
      e.preventDefault();

      inputTransferAmount.value = "";

      return showModalError(modalErrorSend, not_enough_money);
    }
  } else {
    e.preventDefault();

    inputTransferAmount.value = "";

    return showModalError(modalErrorSend, cannot_be_negative);
  }
}

// UTILITY FUNCTIONS

// User Constructor
let User = function (user, fullName, balance, history = undefined) {
  this.user = user;
  this.fullName = fullName;
  this.balance = balance;
  this.history = [];
};

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

// Allow letters only
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

// Allow letters, spaces, and dots
function lettersSpaceOnly(word) {
  // Allow letters only
  let allowedLetters = /^[A-Za-z .]+$/;

  let wordStr = word.toString();

  if (wordStr.match(allowedLetters)) {
    return true;
  } else {
    return false;
  }
}

// Allow numbers only
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
    return user_does_not_exists;
  }
}

function balanceFormatter(amount) {
  amount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Php ${amount}`;
}

function search(user, e) {
  for (let i = 0; i < users.length; i++) {
    if (userExist(user)) {
      if (users[i].user.toLowerCase() == user.toLowerCase()) {
        $("#searchByUserModal").modal("hide");
        e.preventDefault();

        inputSearchByUser.value = "";
        return listUserHistory(users, i);
      }
    } else {
      // return user_does_not_exists;
      e.preventDefault();

      return showModalError(modalErrorSearchByUser, user_does_not_exists);
    }
  }
}

function listUserHistory(usersArr, index) {
  let userFullName = usersArr[index].fullName;
  let userHistory = usersArr[index].history;

  userslist.style.display = "none";
  displayUserHistory.style.display = "block";

  // grab displayUserTableList
  const displayUserTableList = document.getElementById("displayUserTableList");
  // create h2 element
  const h2 = document.createElement("h2");

  // add classes to h2
  h2.className = "text-center my-4";

  // Append User's fullname to h2
  h2.appendChild(document.createTextNode(`${userFullName}'s Account`));

  // insert h2 after displayUserHistory
  displayUserHistory.insertBefore(h2, displayUserTableList);

  userHistory.forEach((history) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="pl-5">${history}</td>
    `;

    displayUserHistoryData.appendChild(tr);

    console.log(history);
  });
}

function searchFullName(fullName, e) {
  // initialize fullNames Array
  fullNames = [];

  for (let i = 0; i < users.length; i++) {
    // if there's a match, add the user to fullNames array
    if (users[i].fullName.toLowerCase() == fullName.toLowerCase()) {
      fullNames.push(users[i]);
    }
  }

  if (!fullNames.length) {
    e.preventDefault();
    return showModalError(modalErrorSearchByFullName, `No names matched.`);
  } else {
    $("#searchByFullNameModal").modal("hide");
    e.preventDefault();
    inputSearchByFullName.value = "";
    return listUsersMatched(fullNames);
  }
}

function listUsersMatched(fullNamesArray) {
  userList.innerHTML = "";

  for (let i = 0; i < fullNamesArray.length; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="pl-5">${fullNamesArray[i].user}</td>
      <td>${fullNamesArray[i].fullName}</td>
      <td class="pr-5 text-right">${balanceFormatter(
        fullNamesArray[i].balance
      )}</td>
    `;

    userList.appendChild(tr);
  }

  fullNames = [];
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

// Store Users array in Local Storage
function addNewUserInLocalStorage(newUser) {
  // check if there are users stored in local storage
  if (localStorage.getItem("users") === null) {
    // if none, set task to empty array
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
    // if none, set task to empty array
    users = [];
  } else {
    // if there are users, convert it to array
    users = JSON.parse(localStorage.getItem("users"));
  }

  if (!users.length) {
    console.log(`No users exist.`);
    // return `No users exist.`;
  }

  users.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="pl-5">${user.user}</td>
      <td>${user.fullName}</td>
      <td class="pr-5 text-right">${balanceFormatter(user.balance)}</td>
    `;

    userList.appendChild(tr);

    console.log(
      `Username: ${user.user}, Full Name: ${
        user.fullName
      }, Balance: ${balanceFormatter(user.balance)}`
    );
  });
}
