import request from "supertest";
import app from "./app.js"


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

    test("Create and get account successfully", async () => {

        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Carey",
                password: "Nachenberg"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Carey");

        const resGet = await request(app)
            .get("/account/get-account")
            .query({
                username: "Carey"
            })
        expect(resGet.status).toBe(200);

        const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Carey"
            })
        expect(resultRem.status).toBe(201);  
    });

    test("Login successfully", async () => {
        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Janet",
                password: "Jackson"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Janet");

        const resultlin = await request(app)
            .get("/account/get-account")
            .send({
                username: "Janet"
            })

        expect(resultlin.status).toBe(200);

         const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Janet"
            })

         expect(resultRem.status).toBe(201);
    }); 

}); 