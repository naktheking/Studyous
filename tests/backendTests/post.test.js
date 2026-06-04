import request from "supertest";
import app from "../../backend/app.js"


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

    test("Cleaning up an old post", async () => {

        const result = await request(app)
            .post("/account/create-account")
            .send({
                username: "Sam",
                password: "Ro"
            })

        expect(result.status).toBe(201);
        expect(result.body.username).toBe("Sam");

        const resultPost = await request(app)
            .post("/post/create-post")
            .send({
                person: "Sam", 
                title: "Testing Cleaning", 
                location: "Hedrick", 
                date: "03-02-2026", 
                startTime: "5:07", 
                endTime: "5:09"
            })

        expect(resultPost.status).toBe(200);

        const resultClean = await request(app)
            .post("/post/cleanup-old-posts") //Gen AI for debugging?
            .send({
                username: "Sam"
            })

        expect(resultClean.status).toBe(200); 
        expect(resultClean.body.success).toBe(true); 
        expect(resultClean.body.removedPosts).toBeGreaterThan(0); 

        const resultRem = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Sam"
            })

        expect(resultRem.status).toBe(201); 
    });

});  