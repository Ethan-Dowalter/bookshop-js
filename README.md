# bookshop-js

A simple book store API in need of input validation/sanitization.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:

- [Go](https://github.com/andey-robins/bookshop-go)
- [Rust](https://github.com/andey-robins/bookshop-rs)

## Versioning

`bookshop-js` is built with:

- node version v16.19.0
- npm version 9.6.2
- nvm version 0.39.3

## Usage

Start the api using `npm run dev`

I recommend using [`httpie`](https://httpie.io) for testing of HTTP endpoints on the terminal. Tutorials are available elsewhere online, and you're free to use whatever tools you deem appropriate for testing your code.

## Analysis of Existing Code

The first security concern with this application that I identified was the lack of logging. By logging the actions to the database and the http requests, we can keep track of the sequence of events in the case of an attack in order to identify what occured.

Another security concern is that sensitive user information, namely the user's name and shipping address, is being stored unencrypted in the database. Because most people use their home address as their shipping address, an attacker could gain access to this information and dox virtually every user in the database. Mitigating this would be as simple as encrypting these fields in the database and only decrypting them upon proper authentication.

Also, there are currently no checks in the system for the integrity of the data in the database. An attacker could change any number of fields in the database and there would be no way to detect that those changes occurred. To mitigate this threat a developer could add in MAC fields to each database table and use these MAC's as a check before any transaction occurs. 


As for any bugs the application has, I have identified three. The first is that the function `chargeCustomerForPO` in `/src/db/customers.ts` is simply not implemented, resulting in customers not getting charged for purchases. The second is in the function `createPurchaseOrder` in `/src/db/purchaseOrders.ts` and the bug is that it is missing a question mark at the end of the db.run statement because it is expecting three values, not two. Currently, the server crashes when this function is called at all without this fix. The third is that the server can easily be crashed just by sending a request to the database where the requested data does not exist. Ideally, an invalid database query would not crash the entire server, and would instead simply return an error saying something like, "Database query is not valid".

## Input Sanitization Methodology

Due to the scope of this assignment, I have chosen to implement only simple input sanitization methods that are by no means exhaustive. Namely, I created a method which contains a regular expression which contains a list of dissallowed characters that each input is tested against. If any input has any dissallowed characters, then an error 422 is thrown, which means that the input is syntactically correct but contains unreadable characters. The list of forbidden characters I chose should protect against any sort of injection attack, yet still allow users to input what they need to have proper functionality.

In addition to this, I added code which checks the database for existing purchase orders, customers, and books before inserting a new entry into the database, which ensures there can be no duplicate entries in the database.