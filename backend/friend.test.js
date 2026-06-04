import request from "supertest";
import app from "./app.js"


describe("Friends Interaction", () => {

    test("Send, Get, and Accept Friend Request", async () => {

        const result1 = await request(app)
            .post("/account/create-account")
            .send({
                username: "Jermain",
                password: "Jackson"
            })

        expect(result1.status).toBe(201);
        expect(result1.body.username).toBe("Jermain");

        const result2 = await request(app)
            .post("/account/create-account")
            .send({
                username: "Jafaar",
                password: "Jackson"
            })

        expect(result2.status).toBe(201);
        expect(result2.body.username).toBe("Jafaar");

        const resultSendReq = await request(app)
            .post("/friend/send-request")
            .send({
                fromUsername: "Jermain",
                toUsername: "Jafaar"
            })

        expect(resultSendReq.body.success).toBe(true);

        const resultGetReq = await request(app)
            .get("/friend/get-requests/Jafaar")

        expect(resultGetReq.status).toBe(200);
        expect(resultGetReq.body.success).toBe(true);

        const resultAccReq = await request(app)
            .post("/friend/accept-request")
            .send({
                fromUsername: "Jermain",
                toUsername: "Jafaar"
            })

        expect(resultAccReq.body.success).toBe(true);

        const resultRem1 = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Jermain"
            })

        expect(resultRem1.status).toBe(201); 

        const resultRem2 = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Jafaar"
            })

        expect(resultRem2.status).toBe(201); 
    });

    test("Send and Reject Friend Request", async () => {

        const result1 = await request(app)
            .post("/account/create-account")
            .send({
                username: "Joseph",
                password: "Jackson"
            })

        expect(result1.status).toBe(201);
        expect(result1.body.username).toBe("Joseph");

        const result2 = await request(app)
            .post("/account/create-account")
            .send({
                username: "Tito",
                password: "Jackson"
            })

        expect(result2.status).toBe(201);
        expect(result2.body.username).toBe("Tito");

        const resultSendReq = await request(app)
            .post("/friend/send-request")
            .send({
                fromUsername: "Joseph",
                toUsername: "Tito"
            })

        expect(resultSendReq.body.success).toBe(true);

        const resultRejReq = await request(app)
            .post("/friend/reject-request")
            .send({
                fromUsername: "Joseph",
                toUsername: "Tito"
            })

        expect(resultRejReq.body.success).toBe(true);

        const resultRem1 = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Joseph"
            })

        expect(resultRem1.status).toBe(201); 

        const resultRem2 = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Tito"
            })

        expect(resultRem2.status).toBe(201); 
    });

        test("Get Friends List", async () => {

        const result1 = await request(app)
            .post("/account/create-account")
            .send({
                username: "Small",
                password: "Smallberg"
            })

        expect(result1.status).toBe(201);
        expect(result1.body.username).toBe("Small");

        const result2 = await request(app)
            .post("/account/create-account")
            .send({
                username: "Medium",
                password: "Smallberg"
            })

        expect(result2.status).toBe(201);
        expect(result2.body.username).toBe("Medium");

        const resultSendReq = await request(app)
            .post("/friend/send-request")
            .send({
                fromUsername: "Small",
                toUsername: "Medium"
            })

        expect(resultSendReq.body.success).toBe(true);

        const resultAccReq = await request(app)
            .post("/friend/accept-request")
            .send({
                fromUsername: "Small",
                toUsername: "Medium"
            })

        expect(resultAccReq.body.success).toBe(true);

        const resultGetF = await request(app)
            .get("/friend/get-friends/Medium")

        expect(resultGetF.status).toBe(200);
        expect(resultGetF.body.success).toBe(true);

        const resultRem1 = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Small"
            })

        expect(resultRem1.status).toBe(201); 

        const resultRem2 = await request(app)
            .post("/account/remove-account")
            .send({
                username: "Medium"
            })

        expect(resultRem2.status).toBe(201); 
    });

});  