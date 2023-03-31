
/* Add store class for localstorage*/
class Store{
    static getBook(){
        let books;
        if (localStorage.getItem('books')===null){
            books=[];
        }else{
            books=JSON.parse (localStorage.getItem('books'));
        }
        return books
    }

    static addBook(book){
        const books=Store.getBook()
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books=Store.getBook();
        books.forEach((book,index)=>{
            if (book.isbn===isbn){
                books.splice(index,1);
            }
        })
        localStorage.setItem('books',JSON.stringify(books))
    }
}


/*book class*/
class Book{
    constructor(title, author, isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    };

}

/*UI class*/
 
class UI{
    static displayBooks(){
    
        const books=Store.getBook();
        books.forEach((book)=>UI.addBookToList(book));
    }
    static addBookToList(book){
        const list=document.querySelector('#book-list');
        const tableRow=document.createElement('tr');
        tableRow.className="book-info";
        tableRow.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;
        list.appendChild(tableRow);
    };

    static addAlert(message, className){
        const div=document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');
        const form=document.querySelector('#book-form');
        container.insertBefore(div,form);

        /*set timeout for Alert*/
        setTimeout(()=>document.querySelector('.alert').remove(), 3000)
    }

    static deleteBooks(element){
        if (element.classList.contains('delete')){
            element.parentElement.parentElement.remove();
        }
    }

    static clearFields(book){
        document.querySelector('#title').value="";
        document.querySelector('#author').value="";
        document.querySelector('#isbn').value="";
    }
}




/*display books and the page*/
document.addEventListener('DOMContentLoaded', UI.displayBooks)


/*Adding books to the list (event)*/

document.querySelector("#book-form").addEventListener('submit',(e)=>{
    e.preventDefault();
    /*get form values*/
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    if (title===''|| author===''||isbn===''){
        UI.addAlert('Please field all fields', 'danger');
    }else{
        const book=new Book(title, author, isbn);

        /*add book to UI*/
        UI.addBookToList(book);

        /*add books to localstorage*/
        Store.addBook(book)

        /*show alert successed message*/
        UI.addAlert('Book Added', 'success')
    
        /*clear the form fields*/
        UI.clearFields(book);   
    }
})


/*Removing books from list*/
document.querySelector('#book-list').addEventListener('click',(e)=>{
    /*remove books from table*/
   UI.deleteBooks(e.target);

   /*remove books form localstorage*/
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

   /*show alert successed message*/
   UI.addAlert('Book Removed', 'success')
});



