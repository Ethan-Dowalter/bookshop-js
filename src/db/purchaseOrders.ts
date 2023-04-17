import { chargeCustomerForPO } from "./customers";
import { connect } from "./db";
import { writeToLog } from '../logging';
import { write } from "fs";

export const createPurchaseOrder = async (bid: number, cid: number): Promise<number> => {
    const db = await connect();
    // Check for existing purchase order with same bid and cid
    const orderExists =  await db.get(`SELECT * FROM PurchaseOrders WHERE bookId = ? AND customerId = ?`, [bid, cid]);
    if (orderExists) {
        throw new Error('Cannot insert purchase order which already exists');
    }
    await db.run(`INSERT INTO PurchaseOrders (bookId, customerId, shipped) VALUES (?, ?, ?)`, [bid, cid, 0]);
    writeToLog("Purchase order created for book id: " + bid + " for customer id: " + cid);
    return getPOIdByContents(bid, cid);
}

export const getPOIdByContents = async (bid: number, cid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM PurchaseOrders WHERE bookId = ? AND customerId = ?`, [bid, cid]);
    writeToLog("Purchase order with id: " + result.id + " was fetched");
    return result.id;
}

export const isPoShipped = async (pid: number): Promise<boolean> => {
    const db = await connect();
    const result = await db.get(`SELECT shipped FROM PurchaseOrders WHERE id = ?`, [pid]);
    writeToLog("Purchase order with id: " + result.id + " was fetched for shipping status");
    return result.shipped === 1;
}

export const shipPo = async (pid: number): Promise<void> => {
    const db = await connect();
    await chargeCustomerForPO(pid);
    await db.run(`UPDATE PurchaseOrders SET shipped = 1 WHERE id = ?`, [pid]);
    writeToLog("Purchase order with id: " + pid + " was shipped");
}