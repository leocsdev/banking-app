// Users Lists
const users = [
  // {
  //   user: "Leo",
  //   balance: 0,
  // },
  // {
  //   user: "Elijah",
  //   balance: 100,
  // },
];

const user_already_exists = "User already exists.";
const user_does_not_exists = "User does not exist.";
const not_enough_money = "User's balance is insufficient.";
const sender_does_not_exists = "Sender does not exists.";
const receiver_does_not_exists = "Receiver does not exists.";

function listUsers() {
  if (!users.length) {
    return `No users exist.`;
  }

  users.forEach((user) => {
    console.log(
      `User: ${user.user}, Balance: ${balanceFormatter(user.balance)}`
    );
  });
}

// User Constructor
let User = function (user, balance) {
  this.user = user;
  this.balance = balance;
};

// Create new user
function createUser(user, balance = 0) {
  if (userExist(user)) {
    // return `User already exists`;
    return user_already_exists;
  }

  if (!lettersOnly(user)) {
    return `Only letters are allowed in user.`;
  }

  if (!numbersOnly(balance)) {
    return `Only numbers are allowed in amount.`;
  }

  if (balance >= 0) {
    let newUser = new User(user, balance);

    users.push(newUser);

    return `User ${user} added.`;
  } else {
    return `Amount cannot be negative.`;
  }
}

function deposit(user = "", amount = 0) {
  if (!userExist(user)) {
    // return `User does not exist.`;
    return user_does_not_exists;
  }

  if (!numbersOnly(amount)) {
    return `Only numbers are allowed in amount.`;
  }

  if (amount >= 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toLowerCase() == user.toLowerCase()) {
        users[i].balance += amount;
        console.log(
          `New balance for ${users[i].user} is ${balanceFormatter(
            users[i].balance
          )} after deposit.`
        );
        return users[i].balance;
      }
    }
  } else {
    return `Amount cannot be negative.`;
  }
}

function withdraw(user = "", amount = 0) {
  if (!userExist(user)) {
    return `User does not exist.`;
  }

  if (!numbersOnly(amount)) {
    return `Only numbers are allowed in amount.`;
  }

  if (amount >= 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].user.toLowerCase() == user.toLowerCase()) {
        // check balance if enough to make a withdrawal
        if (users[i].balance > amount) {
          users[i].balance -= amount;
          console.log(
            `New balance for ${users[i].user} is ${balanceFormatter(
              users[i].balance
            )} after withdrawal.`
          );
          return users[i].balance;
        } else {
          // return `Sorry, ${users[i].user}'s balance is insufficient to process the withdrawal.`;
          return not_enough_money;
        }
      }
    }
  } else {
    return `Amount cannot be negative.`;
  }
}

function send(from = "", to = "", amount = 0) {
  if (!userExist(from)) {
    // return `Sender does not exists`;
    return sender_does_not_exists;
  }

  if (!userExist(to)) {
    // return `Receiver does not exists`;
    return receiver_does_not_exists;
  }

  if (!numbersOnly(amount)) {
    return `Only numbers are allowed in amount.`;
  }

  if (amount >= 0) {
    if (getBalance(from) >= amount) {
      let balanceFrom = withdraw(from, amount);
      let balanceTo = deposit(to, amount);
      // return `Balance for ${from} is ${balanceFormatter(
      //   balanceFrom
      // )}, balance for ${to} is ${balanceFormatter(balanceTo)}`;
      return listUsers();
    } else {
      return `Balance for ${from} is insufficient.`;
    }
  } else {
    return `Amount cannot be negative.`;
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
  return `Php${amount}`;
}

// -----------------------------------------------------------------------------

// // Create new user
// function createUser(user, balance = 0) {
//   // If new user
//   if (!userExist(user)) {
//     // Check if new user contains letters only
//     if (lettersOnly(user)) {
//       // Allow numbers only in balance
//       if (numbersOnly(balance)) {
//         // Allow 0 and positive number only in balance
//         if (balance >= 0) {
//           let newUser = new User(user, balance);

//           users.push(newUser);

//           return `User ${user} added.`;
//         } else {
//           return `Amount cannot be negative.`;
//         }
//       } else {
//         return `Only numbers are allowed in amount.`;
//       }
//     } else {
//       return `Only letters are allowed in user.`;
//     }
//   } else {
//     return `User already exists`;
//   }
// }

// function deposit(user = "", amount = 0) {
//   // Check if user exists
//   if (userExist(user)) {
//     // Check if amount is a number
//     if (numbersOnly(amount)) {
//       if (amount >= 0) {
//         for (let i = 0; i < users.length; i++) {
//           if (users[i].user.toLowerCase() == user.toLowerCase()) {
//             users[i].balance += amount;
//             console.log(
//               `New balance for ${users[i].user} is ${users[i].balance} after deposit.`
//             );
//             return users[i].balance;
//           }
//         }
//       } else {
//         return `Amount cannot be negative.`;
//       }
//     } else {
//       return `Only numbers are allowed in amount.`;
//     }
//   } else {
//     return `User does not exist.`;
//   }
// }

// function withdraw(user = "", amount = 0) {
//   // Check if user exists
//   if (userExist(user)) {
//     // Check if amount is a number
//     if (numbersOnly(amount)) {
//       if (amount >= 0) {
//         for (let i = 0; i < users.length; i++) {
//           if (users[i].user.toLowerCase() == user.toLowerCase()) {
//             // check balance if enough to make a withdrawal

//             if (users[i].balance > amount) {
//               users[i].balance -= amount;
//               console.log(
//                 `New balance for ${users[i].user} is ${users[i].balance} after withdrawal.`
//               );
//               return users[i].balance;
//             } else {
//               return `Sorry, ${users[i].user}'s balance is insufficient to process the withdrawal.`;
//             }
//           }
//         }
//       } else {
//         return `Amount cannot be negative.`;
//       }
//     } else {
//       return `Only numbers are allowed in amount.`;
//     }
//   } else {
//     return `User does not exist.`;
//   }
// }

// function send(from = "", to = "", amount = 0) {
//   if (userExist(from)) {
//     if (userExist(to)) {
//       if (numbersOnly(amount)) {
//         if (amount >= 0) {
//           if (getBalance(from) >= amount) {
//             let balanceFrom = withdraw(from, amount);
//             let balanceTo = deposit(to, amount);
//             return `Balance for ${from} is ${balanceFormatter(
//               balanceFrom
//             )}, balance for ${to} is ${balanceFormatter(balanceTo)}`;
//           } else {
//             return `Balance for ${from} is insufficient.`;
//           }
//         } else {
//           return `Amount cannot be negative.`;
//         }
//       } else {
//         return `Only numbers are allowed in amount.`;
//       }
//     } else {
//       return `Receiver does not exists.`;
//     }
//   } else {
//     return `Sender does not exists.`;
//   }
// }
