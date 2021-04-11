export class User {
    constructor (public email: string, private _token: string, private expiry: number) { }

    get token() {
        if (this.expiry && new Date().getTime() <= this.expiry) {
            return this._token;
        } else {
            return null;
        }
    }
}