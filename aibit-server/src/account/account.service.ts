import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
    private accounts = [];

    createAccount(username: string, password: string) {
        const newAccount = { username, password };
        this.accounts.push(newAccount);
        return newAccount;
    }

    findAccount(username: string) {
        return this.accounts.find(account => account.username === username);
    }

    validateAccount(username: string, password: string) {
        const account = this.findAccount(username);
        return account && account.password === password;
    }
}