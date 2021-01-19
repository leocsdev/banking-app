// alert('Hello from app.js');

// -------------------------------------------------------
// TEST AREA

// -------------------------------------------------------

// Users Lists
const users = [
  {
    user: "Leo",
    balance: 0,
  },
  {
    user: "Elijah",
    balance: 100,
  },
];

function listUsers() {
  users.forEach((user) => {
    console.log(`${user.user}, ${user.balance}`);
    // return user.user;
  });
}

// User Constructor
let User = function (user, balance) {
  this.user = user;
  this.balance = balance;
};

// Create new user
function createUser(user, balance = 0) {
  // If new user
  if (!userExist(user)) {
    // Check if new user contains letters only
    if (lettersOnly(user)) {
      // Allow numbers only in balance
      if (numbersOnly(balance)) {
        // Allow 0 and positive number only in balance
        if (balance >= 0) {
          let newUser = new User(user, balance);
          users.push(newUser);

          return `User ${user} added.`;
        } else {
          return `Amount cannot be negative.`;
        }
      } else {
        return `Only numbers are allowed in amount.`;
      }
    } else {
      return `Only letters are allowed in user.`;
    }
  } else {
    return `User already exists`;
  }
}

function getBalance(user) {
  if (userExist(user)) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toUpperCase() == user.toUpperCase()) {
        return users[i].balance;
      }
    }
  } else {
    return "User does not exist.";
  }
}

function deposit(user, amount) {
  // Try to make the amount as accurate as possible (search for floating points)
  // check if amount is a valid number, CANNOT BE NEGATIVE NUMBER
  if (amount <= 0) {
    console.log("Please enter valid amount.");
  } else {
    // Get user information from users array
    if (userExist(user)) {
      // Once user is found, add the amount to the balance AND RETURN new balance
      for (let i = 0; i < users.length; i++) {
        // console.log(users[i].user);
        if (users[i].user.toUpperCase() == user.toUpperCase()) {
          // console.log(users[i].user);
          users[i].balance += amount;
          console.log(
            `New balance for ${users[i].user} is ${users[i].balance}`
          );

          return users[i].balance;
        }
      }
    } else {
      // If user not found, show message -> 'User does not exist.'
      console.log("User does not exist.");
    }
  }
}

function withdraw(user, amount) {
  // Try to make the amount as accurate as possible (search for floating points)
  // check if amount is a valid number, CANNOT BE NEGATIVE NUMBER
  if (amount <= 0) {
    let error = "Please enter valid amount.";
    return error;
  }

  // Get user information from users array
  if (userExist(user)) {
    // Once user is found, add the amount to the balance AND RETURN new balance
    for (let i = 0; i < users.length; i++) {
      // console.log(users[i].user);
      if (users[i].user.toUpperCase() == user.toUpperCase()) {
        // check balance if enough to make a withdrawal
        // console.log(users.toUpperCase().balance);
        if (users[i].balance < amount) {
          // console.log("Sorry, balance insufficient");
          return "Sorry, balance insufficient";
        } else {
          users[i].balance -= amount;
          console.log(
            `New balance for ${users[i].user} is ${users[i].balance}`
          );
          return users[i].balance;
        }
      }
    }
  } else {
    // If user not found, show message -> 'User does not exist.'
    // console.log("User does not exist.");
    return "User does not exist.";
  }
}

function send(from, to, amount) {
  // check both users if existing
  if (userExist(from) && userExist(to) && amount > 0) {
    // check balance from user
    if (getBalance(from) >= amount) {
      let balanceFrom = withdraw(from, amount);
      let balanceTo = deposit(to, amount);
      return `Balance of ${from} is ${balanceFormatter(
        balanceFrom
      )}, balance of ${to} is ${balanceFormatter(balanceTo)}`;
    } else {
      return `Balance from ${from} is insufficient.`;
    }

    // get the withdrawn amount and save the value to withdrawFrom
    // let withdrawFrom = withdraw(from, amount);
    // console.log(withdrawFrom);
    // deposit the withdrawn amount to the intended user
    // deposit(to, withdrawFrom);
  } else {
    // console.log(`One of the parameters are invalid.`);
    return "One of the parameters are invalid.";
  }
}

// Utility Functions
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

function balanceFormatter(amount) {
  amount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Php${amount}`;
}
