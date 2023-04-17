import { Request, Response } from 'express';
import * as db from '../db';
import { validate } from './validation';

export const createCustomer = async (req: Request, res: Response) => {
    const { name, shippingAddress } = req.body;
    // Check input for forbidden characters
    const validName = await validate(name);
    const validAddress = await validate(shippingAddress);
    if (!validName || !validAddress){
        res.status(422).json({'status': 'Input contained forbidden characters'});
    }
    await db.createCustomer(name, shippingAddress);
    res.status(201).json({ 'status': 'success' });
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const { cid, address } = req.body;
    // Check input for forbidden characters
    const validAddress = await validate(address);
    if (!validAddress){
        res.status(422).json({'status': 'Input contained forbidden characters'});
    }
    await db.updateCustomerAddress(cid, address);
    res.status(200).json({ 'status': 'success' });
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const { cid } = req.body;
    // Check input for forbidden characters
    const validCid = await validate(cid);
    if (!validCid){
        res.status(422).json({'status': 'Input contained forbidden characters'});
    }
    const balance = await db.customerBalance(cid);
    res.status(200).json({ balance });
}