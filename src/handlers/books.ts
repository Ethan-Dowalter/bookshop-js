import { Request, Response } from 'express';
import * as db from '../db';
import { validate } from './validation';

export const createBook = async (req: Request, res: Response) => {
    const { title, author, price } = req.body;
    // Check input for forbidden characters
    const validTitle = await validate(title);
    const validAuthor = await validate(author);
    const validPrice = await validate(price);
    if (!validTitle || !validAuthor || !validPrice){
        res.status(422).json({'status': 'Input contained forbidden characters'});
    }
    await db.createBook(title, author, price);
    res.status(201).json({ 'status': 'success' });
}

export const getPrice = async (req: Request, res: Response) => {
    const { title, author } = req.body;
    // Check input for forbidden characters
    const validTitle = await validate(title);
    const validAuthor = await validate(author);
    if (!validTitle || !validAuthor){
        res.status(422).json({'status': 'Input contained forbidden characters'});
    }
    const bid = await db.getBookId(title, author);
    const price = await db.getBookPrice(bid);
    res.status(200).json({ price });
}