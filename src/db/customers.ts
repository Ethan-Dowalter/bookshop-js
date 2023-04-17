import { connect } from './db';
import { writeToLog } from '../logging';

export const createCustomer = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    // Check for existing customer with same name and address
    const customerExists =  await db.get(`SELECT * FROM Customers WHERE name = ? AND shippingAddress = ?`, [name, address]);
    if (customerExists) {
        throw new Error('Cannot insert customer which already exists');
    }
    await db.run(`INSERT INTO Customers (name, shippingAddress) VALUES (?, ?)`, [name, address]);
    writeToLog("Customer created: " + name);
    return getCustomerId(name, address);
}

export const getCustomerId = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Customers WHERE name = ? AND shippingAddress = ?`, [name, address]);
    writeToLog("Customer with id: " + result.id + " was fetched");
    return result.id;
}

export const getCustomerAddress = async (cid: number): Promise<string> => {
    const db = await connect();
    const result = await db.get(`SELECT shippingAddress FROM Customers WHERE id = ?`, [cid]);
    writeToLog("Customer address with id: " + result.id + " was fetched");
    return result.shippingAddress;
}

export const updateCustomerAddress = async (cid: number, address: string): Promise<void> => {
    const db = await connect();
    await db.run(`UPDATE Customers SET shippingAddress = ? WHERE id = ?`, [address, cid]);
    writeToLog("Customer address with id: " + cid + " was modified");
}

export const customerBalance = async (cid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT accountBalance FROM Customers WHERE id = ?`, [cid]);
    writeToLog("Customer balance with id: " + result.id + " was fetched");
    return result.accountBalance;
}

export const chargeCustomerForPO = async (pid: number) => {
    // todo
    return;
}