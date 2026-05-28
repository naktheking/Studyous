import "../backend/route/account.js"
import request from 'request'
import assert from 'node:assert/strict'

describe("Login Interface", () => {

    test("Create account successfully", () => {
        request(app)
            .post("/create-account")
            .send({
                username: "Michael"
                password: "Jackson"
            })
    });

});