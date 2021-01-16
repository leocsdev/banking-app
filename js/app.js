// alert('Hello from app.js');

// Array of user objects
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

let User = function (user, balance) {
  this.user = user;
  this.balance = balance;
};

// create user
function createUser(user, balance = 0) {
  let newUser = new User(user, balance);

  users.push(newUser);
}

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
