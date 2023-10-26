const bookArr = [];
const RENDER_EVENT = "render-books";

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    submitForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const finishedBook = document.getElementById("selesai-dibaca");
  finishedBook.innerHTML = "";

  const unFinishedBook = document.getElementById("belum-selesai-dibaca");
  unFinishedBook.innerHTML = "";
  for (const bookItem of bookArr) {
    const bookElement = createBook(bookItem);
    if (!bookItem.isCompleted) {
      finishedBook.append(bookElement);
    } else {
      unFinishedBook.append(bookElement);
    }
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const yearPublished = parseInt(document.getElementById("inputBookYear").value);
  const isCompleted = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, yearPublished, isCompleted);
  bookArr.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function createBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const yearPublished = document.createElement("p");
  yearPublished.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(bookTitle, bookAuthor, yearPublished);

  const container = document.createElement("div");
  container.classList.add("item-container");
  container.append(textContainer);
  container.setAttribute("id", `book - ${bookObject.id}`);

  if (bookObject.isCompleted) {
    const bookDone = document.createElement("button");
    bookDone.innerText = "Selesai Dibaca";
    bookDone.classList.add("selesai-dibaca");

    bookDone.addEventListener("click", function () {
      moveUnfinishedBook(bookObject.id);
    });

    const bookEdit = document.createElement("button");
    bookEdit.classList.add("edit-buku");
    bookEdit.addEventListener("click", function () {
      const newTitle = prompt("Masukkan judul baru:", bookObject.title);
      const newAuthor = prompt("Masukkan penulis baru:", bookObject.author);
      const newYear = prompt("Masukkan tahun baru:", bookObject.year);
      editBook(bookObject.id, newAuthor, newTitle, newYear);
    });

    const bookDelete = document.createElement("button");
    bookDelete.innerText = "Hapus Buku";
    bookDelete.classList.add("hapus-buku");

    bookDelete.addEventListener("click", function () {
      removeFinishedBook(bookObject.id);
    });

    container.append(bookDone, bookEdit, bookDelete);
  } else {
    const bookOnRead = document.createElement("button");
    bookOnRead.innerText = "Belum Selesai Dibaca";
    bookOnRead.classList.add("belum-selesai-dibaca");

    bookOnRead.addEventListener("click", function () {
      moveFinishedBook(bookObject.id);
    });

    const bookEdit = document.createElement("button");
    bookEdit.classList.add("edit-buku");
    const bookEditIcon = document.createElement("i");
    bookEditIcon.classList.add("fas", "fa-pen");

    bookEdit.appendChild(bookEditIcon);
    bookEdit.addEventListener("click", function () {
      const newTitle = prompt("Masukkan judul baru:", bookObject.title);
      const newAuthor = prompt("Masukkan penulis baru:", bookObject.author);
      const newYear = prompt("Masukkan tahun baru:", bookObject.year);
      editBook(bookObject.id, newAuthor, newTitle, newYear);
    });

    const bookDelete = document.createElement("button");
    bookDelete.innerText = "Hapus Buku";
    bookDelete.classList.add("hapus-buku");

    bookDelete.addEventListener("click", function () {
      removeUnfinishedBook(bookObject.id);
    });

    container.append(bookOnRead, bookEdit, bookDelete);
  }

  return container;
}

function findBook(bookId) {
  for (const bookItem of bookArr) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookArr) {
    if (bookArr[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function moveFinishedBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  if (saveData() !== false) {
    alert("Berhasil Memindahkan Buku ke Rak 'Telah Selesai Dibaca' !");
  }
}

function moveUnfinishedBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  if (saveData() !== false) {
    alert("Berhasil Memindahkan Buku ke Rak 'Belum Selesai Dibaca' !");
  }
}

function editBook(bookId, newAuthor, newTitle, newYear) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  if (newAuthor === null || newTitle === null || newYear === null) {
    alert("Edit Buku Dibatalkan");
    return;
  }

  bookTarget.author = newAuthor;
  bookTarget.title = newTitle;
  bookTarget.year = newYear;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  if (saveData() !== false) {
    alert("Berhasil Edit Buku !");
  }
}

function removeFinishedBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookArr.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  if (saveData() !== false) {
    alert("Berhasil menghapus Buku dari Rak 'Selesai Dibaca ' !");
  }
}
function removeUnfinishedBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookArr.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  if (saveData() !== false) {
    alert("Berhasil menghapus Buku dari Rak 'Belum Selesai Dibaca ' !");
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookArr);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      bookArr.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function search() {
  var input, filter;
  input = document.getElementById("searchBookTitle");
  filter = input.value.toUpperCase();
  books = document.getElementsByClassName("item-container");
  titles = document.getElementsByTagName("h3");
  for (i = 0; i < books.length; i++) {
    a = titles[i];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      books[i].style.display = "block";
    } else {
      books[i].style.display = "none";
    }
  }
}

function validateInputForm() {
  let x = document.forms["inputBookForm"].elements;
  let filledFieldRequired = true;

  for (let i = 0; i < x.length; i++) {
    if (x[i].value.length == 0) filledFieldRequired = false;
  }

  if (filledFieldRequired.length != 0) {
    document.getElementById("bookSubmit").disabled = false;
  } else {
    document.getElementById("bookSubmit").disabled = true;
  }
}
