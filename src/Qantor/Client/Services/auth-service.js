import React from 'react';
import { Redirect } from 'react-router-dom'
import { isTokenExpired } from '../Helpers/jwt-decode'
import { fetchJson } from '../fetch';

const tokenName = 'token';
const userIdentifierName = 'userId';

export default class AuthService {

    endSession() {
        localStorage.removeItem(tokenName);
        localStorage.removeItem(userIdentifierName);
    }

    isAuthenticated() {
        const token = localStorage.getItem(tokenName);
        if (token) {
            if (isTokenExpired(token)) {
                this.endSession();
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    startSession(token, userId) {
        localStorage.setItem(tokenName, token);
        localStorage.setItem(userIdentifierName, userId);
    }

    getToken() {
        return localStorage.getItem(tokenName);
    }

    getUserId() {
        return localStorage.getItem(userIdentifierName);
    }

    async fetchAuthorizedJson(url, method, obj = null) {
        const headers = {
            'Authorization': `Bearer ${this.getToken()}`
        };

        return await fetchJson(url, method, obj, headers);
    }
}