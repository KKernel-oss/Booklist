// Book class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI class: Handle UI class
class UI {
  constructor() {}
  static DisplayBooks() {
    const storedBooks = Store.GetBooks();
    const books = storedBooks;

    books.forEach((item) => {
      UI.AddBookToList(item);
    });
  }

  static AddBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Remove</a></td>`;
    list.appendChild(row);
  }

  static DeleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static ShowAlert(message, type) {
    const div = document.createElement("div");
    div.className = `alert alert-${type}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("form#book-form");
    container.insertBefore(div, form);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }
}
//Store class: Handles storage (Browser local storage)
class Store {
  static GetBooks() {
    let books;
    const storage = localStorage.getItem("books");
    if (storage === null) {
      books = [];
    } else {
      books = JSON.parse(storage);
    }

    return books;
  }

  static AddBook(book) {
    const books = Store.GetBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static RemoveBook(isbn) {
    const books = Store.GetBooks();

    Array.from(books).forEach((item, index) => {
      if (item.isbn === isbn) {
        Array.from(books).splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Event: Display books
document.addEventListener("DOMContentLoaded", UI.DisplayBooks());

//Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("input#title").value;
  const author = document.querySelector("input#author").value;
  const isbn = document.querySelector("input#isbn").value;

  //Validaton

  if (title == "" || author == "" || isbn == "") {
    UI.ShowAlert("All fields required", "danger");
  } else {
    var book = new Book(title, author, isbn);
    UI.AddBookToList(book);
    Store.AddBook(book);
    UI.ShowAlert("Successfully added book to repo", "success");
    document.querySelector("#book-form").reset();
  }
});

//Event: Remove a book
const booklist = document.querySelector("#book-list");
booklist.addEventListener("click", (e) => {
  UI.DeleteBook(e.target);
  Store.RemoveBook(e.target.parentElement.previousElementSibling.textContent);
  UI.ShowAlert("Successfully removed book from repo", "success");
});
