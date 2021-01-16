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
    console.log("Please enter valid amount.");
  } else {
    // Get user information from users array
    if (userExist(user)) {
      // Once user is found, add the amount to the balance AND RETURN new balance
      for (let i = 0; i < users.length; i++) {
        // console.log(users[i].user);
        if (
          users[i].user.toUpperCase() == user.toUpperCase() &&
          users[i].balance > amount
        ) {
          // console.log(users[i].user);
          users[i].balance -= amount;
          console.log(
            `New balance for ${users[i].user} is ${users[i].balance}`
          );
        }
      }
    } else {
      // If user not found, show message -> 'User does not exist.'
      console.log("User does not exist.");
    }
  }
}
