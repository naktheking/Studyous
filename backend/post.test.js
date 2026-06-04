import request from "supertest";
import app from "./app.js"


describe("Posting", () => {

    test("Creating a post", async () => {

        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Ethan",
                password: "Jackson"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Ethan");

        const resultPost = await request(app)
            .post("/post/create-post")
            .send({
                person: "Ethan", 
                title: "Testing", 
                location: "Hedrick", 
                date: "06-02-2026", 
                startTime: "5:07", 
                endTime: "5:09"
            })

        expect(resultPost.status).toBe(200);

        const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Ethan"
            })

        expect(resultRem.status).toBe(201); 
    });

    test("Get Post", async () => {

        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Max",
                password: "Jackson"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Max");

        const resultGetPost = await request(app)
            .get("/post/get-post")
            .query({
                username: "Max"
            })

        expect(resultGetPost.status).toBe(200);

        const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Max"
            })

        expect(resultRem.status).toBe(201); 
    });

});  