import express, { Request, Response } from 'express';
import cors from 'cors'
import { User } from './user';
import Utils from './utils';
import { db } from './server';
import { users } from './db/schema';
import { eq, and, ne } from 'drizzle-orm';

const app = express();

app.use(express.json(), cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.post("/users", async (req: Request, res: Response) => {
    try{
        const params: User = new User(req.body);
        if(!Utils.verifyEmail(params.email)) return res.status(400).send({data: { status: 400, code: "invalid-email", message: "Invalid email format" }});
        if(!Utils.verifyPassword(params.password)) return res.status(400).send({ data: { status: 400, code: "invalid-password", message: "Invalid password format. It must contains characters, number and at least 6 digits" }}); 
        if(params.user.length <= 0) return res.status(400).send({ data: { status: 400, code: "invalid-user", message: "Invalid user name. This field cannot be empty" }});
        const isUserNameExistQuery = Utils.getUserQuery().where(eq(users.user, params.user)).limit(1);
        const [hashPwd, isUserNameExist] = await Promise.all([Utils.hashPassword(params.password!), isUserNameExistQuery]); 
        if(isUserNameExist.length > 0) return res.status(409).send({ data: { status: 409, code: "existing-user", message: "This user name is in use" }});
        await  db.insert(users).values({
            name: params.name,
            email: params.email,
            user: params.user,
            password: hashPwd,
        });
        return res.status(201).send({message: "User created with successfully"});
    }catch(error){
        return res.status(500).send({ data: { status: 500, code: "internal-server-error", message: "Internal Server Error" }});
    }
});

app.get("/users", async (req: Request, res: Response) => {
    try{
        const query = await Utils.getUserQuery();
        if(query.length <= 0) return res.status(204).send({data: {}});
        const result: User[] = query.map((e) => Utils.userDto(e));
        return res.status(200).send({data: result});
    }catch(error){
        return res.status(500).send({ data: { status: 500, code: "internal-server-error", message: "Internal Server Error" }});        
    }
});

app.get("/users/:id", async (req: Request, res: Response) => {
    try{
        const params = Number(req.params["id"] as string | undefined);
        if(isNaN(params)) return res.status(422).send({ data: { status: 422, code: "unprocessable-entity", messgae: "User id must be a number" }});
        const query = await Utils.getUserQuery().where(eq(users.id, params)).limit(1);
        if(query.length <= 0 || query[0] === undefined) return res.status(404).send({ data: { status: 404, code: "user-not-found", message: "User not found"}});
        const result = Utils.userDto(query[0]);
        return res.status(200).send({data: result});
    }catch(error){
        return res.status(500).send({ data: { status: 500, code: "internal-server-error", message: "Internal Server Error" }});  
    }

});

app.put("/users/:id", async (req: Request, res: Response) => {
    try{
        const currentPassword = req.body["currentPassword"] ?? "";
        const userId =  Number(req.params["id"] as string);
        if(isNaN(userId)) return res.status(422).send({ data: { status: 422, code: "unprocessable-entity", messgae: "User id must be a number" }});
        const params: User = new User({id: userId, ...req.body});
        const isUserExist = await Utils.getUserQuery().where(eq(users.id, params.id!)).limit(1);
        if(isUserExist[0] === undefined || isUserExist.length <= 0 ) return res.status(404).send({ data: { status: 404, code: "user-not-found", message: "User not found"}});
        const existUser = Utils.userDto(isUserExist[0]!)
        if(!Utils.verifyEmail(params.email)) return res.status(400).send({data: { status: 400, code: "invalid-email", message: "Invalid email format" }});
        if(!Utils.verifyPassword(params.password)) return res.status(400).send({ data: { status: 400, code: "invalid-password", message: "Invalid password format. It must contains characters, number and at least 6 digits" }}); 
        if(params.user.length <= 0) return res.status(400).send({ data: { status: 400, code: "invalid-user", message: "Invalid user name. This field cannot be empty" }});
        const userPwd = await Utils.getCurrentPwd(params.id!);
        const [isUserNameExistQuery, isValidPwd, newPwd] = await Promise.all([
            Utils.getUserQuery().where(and(eq(users.user, params.user), ne(users.id!, existUser.id!))).limit(1),
            Utils.verifyHashPassword(currentPassword, userPwd),
            Utils.hashPassword(params.password!)
        ])
        if(!isValidPwd) return res.status(403).send({data: {status: 401, code: "unauthorized", message: "Unauthorized, wrong password"}});
        if(isUserNameExistQuery.length > 0) return res.status(409).send({ data: { status: 409, code: "existing-user", message: "This user name is in use" }});
        await db.update(users).set({
            name: params.name,
            email: params.email,
            user: params.user,
            password: newPwd,
        }).where(eq(users.id!, params.id!));
        return res.status(200).send({message: "User updated with successfully"});
    }catch(error){
        return res.status(500).send({ data: { status: 500, code: "internal-server-error", message: "Internal Server Error" }});
    }
}); 

app.delete("/users/:id", (req: Request, res: Response) => {
    
});


export default app;




