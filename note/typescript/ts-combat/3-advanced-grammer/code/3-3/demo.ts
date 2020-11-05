// Enum 枚举类型

// const Status = {
//   OFFLINE: 0,
//   ONLINE: 1,
//   DELETED: 2
// }

enum Status {
  // OFFLINE = 1,
  OFFLINE,
  ONLINE,
  DELETED
}

console.log(Status.OFFLINE);
console.log(Status.ONLINE);
console.log(Status.DELETED);
console.log(Status[0]); // OFFLINE

function getResult(status) {
  if (status === Status.OFFLINE) {
    return 'offline';
  } else if (status === Status.ONLINE) {
    return 'online';
  } else if (status === Status.DELETED) {
    return 'deleted';
  }
  return 'error';
}

// const result = getResult(Status.OFFLINE);
const result = getResult(1); // online
console.log(result);
