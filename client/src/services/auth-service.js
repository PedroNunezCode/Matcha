import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

class AuthService{
    tokenKey = 'auth_token';

    //retrives the auth token from local storage.
    getToken(){
        return localStorage.getItem(this.tokenKey);
    }

    //Decodes the jwt token to access its contents.
    decode(token){
        return jwt.decode(token);
    }

    //saves token to local storage.
    saveToken(token){
        localStorage.setItem(this.tokenKey, token);
    }

    //removes the jwt-token from local storage
    invalidateUser(){
        localStorage.removeItem(this.tokenKey);
    }

    //gets the expiration of the user.
    getExpiration(token){
        const exp = this.decode(token).exp;

        return moment.unix(exp);
    }

    //gets the username of the use signed into the local storage
    getUsername(){
        return this.decode(this.getToken()).username;
    }

    // gets the user id of the corresponding jwt token in local storage
    getUserId(){
        return this.decode(this.getToken()).userId;
    }

    //Checks to see if the token is still valid. compares the current time
    // witht the getExpiration time of the jwt token.
    isValid(token){
        return moment().isBefore(this.getExpiration(token));
    }

    //Checks to see if the user is id'd.
    isAuthenticated(){
        const token = this.getToken();

        return (token && this.isValid(token) ? true : false)
    }
}

export default new AuthService();