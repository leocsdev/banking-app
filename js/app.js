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

function listUsers() {
  users.forEach((user) => {
    console.log(user.user);
    // return user.user;
  });
}

// function listUsers() {
//   for (user of users) {
//     return Object.values(user);
//   }
// }

// User Constructor
let User = function (user, balance) {
  this.user = user;
  this.balance = balance;
};

// Create new user
function createUser(user, balance = 0) {
  let newUser = new User(user, balance);

  if (userExist(user)) {
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
function userExist(user) {
  if (users.length) {
    let i = 0;

    users.forEach((element) => {
      if (user.toUpperCase() == element.user.toUpperCase()) {
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

function getBalance(user) {
  if (userExist(user)) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toUpperCase() == user.toUpperCase()) {
        return users[i].balance;
      }
    }
  } else {
    return "No user found.";
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

function balanceFormatter(amount) {
  amount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Php${amount}`;
}
