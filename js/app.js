// alert('Hello from app.js');

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

// User Constructor
let User = function (user, balance) {
  this.user = user;
  this.balance = balance;
};

// Create new user
function createUser(user, balance = 0) {
  let newUser = new User(user, balance);

  if (ifUserExist(user)) {
    console.log("User already exists.");
  } else {
    users.push(newUser);
    console.log("New user added.");
  }

  users.forEach((user) => {
    console.log(`User: ${user.user}, Balance: ${user.balance}`);
  });
}

// Check if user exists
function ifUserExist(user) {
  if (users.length) {
    let i = 0;

    users.forEach((element) => {
      if (user == element.user) {
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
}

/*
Here are the required functions.

• create_user(user, balance)
• function creates new user in the system
• New user has zero balance (or an optional initial balance)
• user (argument) is any string value
• deposit(user, amount)
• increases user's balance by amount value
• returns new_balance of the user
• withdraw(user, amount)
• decreases user's balance by amount value
• returns new_balance of the user

*/
