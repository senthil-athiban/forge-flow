import { Request, Response, Router } from "express";
import { SignInSchema, SignUpSchema } from "../schema";
import {prismaClient} from "../db/index";
import bcyprtjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { authMiddleware } from "../middlware";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    
    const body = req.body;
    
    const parsedData = SignUpSchema.safeParse(body);
    
    if( !parsedData.success ) return { message: "Invalid Inputs"};
    const { email, password, name } = parsedData.data;
    const existingUser = await prismaClient.user.findFirst({
        where: {
            email: email
        }
    });
    console.log("existingUser: ", existingUser);
    if(existingUser) return { message : "User Already Exists"};
    
    const hashedPassword = await bcyprtjs.hash(password, 10);

    const user = await prismaClient.user.create({
        data: {
            email,
            password: hashedPassword, 
            name
        }
    });

    return res.status(200).json({
        message: "User Created Successfully",
        user
    })
})

router.post("/signin", async (req: Request, res: Response) => {
    const body = req.body;
    const parsedData = SignInSchema.safeParse(body);
    if( !parsedData.success ) return { message: "Invalid Inputs"};

    const { email, password } = parsedData.data;
    
    const user = await prismaClient.user.findFirst({
        where: {
            email
        },
        select: {
            id: true,
            email: true,
            password: true
        }
    });
    if(!user) return res.status(404).json({ message: "No Account Exists"});
    const confirmPassword = await bcyprtjs.compare(password, user?.password);
    if(!confirmPassword) return res.status(401).json({message: "Invalid credentials"});
    // sign the jwt
    
    const token = jwt.sign({
        userId: user.id
    }, JWT_PASSWORD!);
    
    res.json({
        token
    })

});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId;
    const user = await prismaClient.user.findFirst({
        where: {
            id: userId
        },
        select: {
            email: true,
            name: true
        }
    });

    return res.status(200).json({
        user
    });
});

export const userRouter = router;