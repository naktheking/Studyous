import request from "supertest";
import app from "./server.js"


describe("Login Interface", () => {

    test("Create account successfully", async () => {
        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Michael",
                password: "Jackson"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Michael");
    });

});