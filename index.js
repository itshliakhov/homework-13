function UsersTable({
  _form,
  _userInfo,
  _content,
  _addButton,
  _localStorageKeyName,
}) {
  this.userId = 1;
  this.init = function () {
    this.LoadUserToTable();
    this.openFormByButton();
    this.tableSubmit();
  };
  this.tableSubmit = function () {
    _form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (_form.elements["id"].value) {
        const user = {
          id: _form.elements["id"].value,
          name: _form.elements["name"].value,
          phone: _form.elements["phone"].value,
          age: _form.elements["age"].value,
        };
        this.updateUser(user);
      } else {
        const user = {
          id: this.userId,
          name: _form.elements["name"].value,
          phone: _form.elements["phone"].value,
          age: _form.elements["age"].value,
        };
        this.handleAppendUser(user);
        this.saveUsersArray(user);
        this.userId++;
      }
      _form.reset();
      _form.classList.remove("open");
    });
  };
  this.createUserTemplate = function (user) {
    return `
    <tr class="js--users" data-id="${user.id}">
       <td>${user.id}</td>
       <td>${user.name}</td>
       <td>${user.phone}</td>
       <td>${user.age}</td>
       <td>
           <button type="button" class="btn btn-primary js--view">View</button>
           <button type="button" class="btn btn-primary js--edit">Edit</button>
           <button type="button" class="btn btn-primary js--del">Delete</button>
       </td>
     </tr> 
     `;
  };
  this.handleAppendUser = function (user) {
    const newUser = this.createUserTemplate(user);
    _content.insertAdjacentHTML("beforeend", newUser);
    this.viewCurrentUser(user);
    this.updateForm(user);
    this.eventOnDeleteBtn(user);
  };
  this.saveUsersArray = function (user) {
    const users = JSON.parse(localStorage.getItem(_localStorageKeyName)) || [];
    users.push(user);
    localStorage.setItem(_localStorageKeyName, JSON.stringify(users));
  };
  this.deleteUser = function (event, user) {
    const currentItem = event.target.closest(".js--users");
    currentItem.remove();
    const users = JSON.parse(localStorage.getItem(_localStorageKeyName));
    const usersWithoutDeleted = users.filter((item) => item.id !== user.id);
    localStorage.setItem(
      _localStorageKeyName,
      JSON.stringify(usersWithoutDeleted)
    );
  };
  this.eventOnDeleteBtn = function (user) {
    const currentTr = document.querySelector(`[data-id="${user.id}"]`);
    const deleteButton = currentTr.querySelector(".js--del");
    deleteButton.addEventListener("click", (event) => {
      this.deleteUser(event, user);
    });
  };
  this.updateUser = function (user) {
    const users = JSON.parse(localStorage.getItem(_localStorageKeyName));
    const newUsers = users.map((item) => {
      if (+item.id === +user.id) {
        return user;
      }
      return item;
    });
    _content.innerHTML = "";
    newUsers.forEach((user) => this.handleAppendUser(user));
    localStorage.setItem(_localStorageKeyName, JSON.stringify(newUsers));
  };
  this.updateForm = function (user) {
    const currentTr = document.querySelector(`[data-id="${user.id}"]`);
    const editButton = currentTr.querySelector(".js--edit");
    editButton.addEventListener("click", () => {
      _form.reset();
      _form.classList.add("open");
      _form.elements["id"].value = user.id;
      _form.elements["name"].value = user.name;
      _form.elements["phone"].value = user.phone;
      _form.elements["age"].value = user.age;
    });
  };
  this.showUserInfo = function (user) {
    _userInfo.innerHTML = JSON.stringify(user, undefined, 2);
  };
  this.viewCurrentUser = function (user) {
    const currentTr = document.querySelector(`[data-id="${user.id}"]`);
    const viewButton = currentTr.querySelector(".js--view");
    viewButton.addEventListener("click", () => {
      this.showUserInfo(user);
    });
  };
  this.LoadUserToTable = function () {
    const users = JSON.parse(localStorage.getItem(_localStorageKeyName));
    if (users) {
      users.forEach((user) => {
        this.handleAppendUser(user);
        this.userId = +users[users.length - 1].id + 1;
      });
    }
  };
  this.openFormByButton = function () {
    _addButton.addEventListener("click", function () {
      _form.classList.add("open");
    });
  };
}
document.addEventListener("DOMContentLoaded", function () {
  const userData = new UsersTable({
    _localStorageKeyName: "users",
    _content: document.querySelector(".js--content"),
    _form: document.querySelector(".js--form"),
    _userInfo: document.querySelector(".js--user"),
    _addButton: document.querySelector(".js--addBtn"),
    _userInfo: document.querySelector(".js--user"),
  });
  userData.init();
});
