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

        const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Michael"
            })

        expect(resultRem.status).toBe(201); 
    });

    test("Login successfully", async () => {
        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Michael",
                password: "Jackson"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Michael");

        const resultlin = await request(app)
            .get("/account/get-account")
            .send({
                username: "Michael"
            })

        expect(resultlin.status).toBe(200);

         const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Michael"
            })

         expect(resultRem.status).toBe(201);
    });

});