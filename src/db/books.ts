import { connect } from './db';
import { writeToLog } from '../logging';

export const createBook = async (title: string, author: string, price: number): Promise<number> => {
    const db = await connect();
    // Check for existing book with same title and author
    const bookExists =  await db.get(`SELECT * FROM Books WHERE title = ? AND author = ?`, [title, author]);
    if (bookExists) {
        throw new Error('Cannot insert book which already exists');
    }
    await db.run(`INSERT INTO Books (title, author, price) VALUES (?, ?, ?)`, [title, author, price]);
    writeToLog("Book created: " + title + " by " + author);
    return getBookId(title, author)
}

export const getBookId = async (title: string, author: string): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Books WHERE title = ? AND author = ?`, [title, author]);
    writeToLog("Book with id: " + result.id + " was fetched");
    return result.id;
}

export const getBookPrice = async (bid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT price FROM Books WHERE id = ?`, [bid]);
    writeToLog("Book price with id: " + result.id + " was fetched");
    return result.price;
}