import { prisma } from "./client";

const generateSeed = async () => {
    await prisma.$transaction(async (tx) => {
        await tx.triggerTypes.create({
            data: {
                id: 'cm4kyw8rf0002xvkv0hrztn6k',
                name: "webhooks",
                image: "https://res.cloudinary.com/hevo/image/upload/v1650869026/hevo-learn/webhook.png"
            }
        })

        await tx.actionTypes.create({
            data: {
                id: "cm4kyw2fm0000xvkveiyj009d",
                name: "email",
                image: "https://media.istockphoto.com/id/826567080/vector/e-mail-icon-simple-vector-illustration-red-color.jpg?s=612x612&w=0&k=20&c=ysxmzarWz_6a2oyi1ue9p6OUBXAw8W1LQPsyorc_5hY="
            }
        })

        await tx.actionTypes.create({
            data: {
                id: "cm4kyw2fn0001xvkvvd7m9ew6",
                name: "solana",
                image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
            }
        })

        await tx.user.create({
            data: {
                id: "cm56xoakz00006lg4jtiktmgh",
                name: 'test-user',
                email: 'test@gmail.com',
                password: '$2a$10$4iXRooCe1noKIz56QoTeVOg0vK2iLfVKmRCqP29nYC6ASSz.JDDdO',
                emailVerified: true
            }
        })

        await tx.zap.create({
            data: {
                id: "cm4qfiry50001xvk9t7pa25xz",
                userId: "cm56xoakz00006lg4jtiktmgh"
            }
        })

        await tx.action.create({
            data: {
                actionTypeId: "cm4kyw2fn0001xvkvvd7m9ew6",
                zapId: "cm4qfiry50001xvk9t7pa25xz"
            }
        })

        await tx.trigger.create({
            data: {
                triggerTypeId: 'cm4kyw8rf0002xvkv0hrztn6k',
                zapId: "cm4qfiry50001xvk9t7pa25xz"
            }
        })
    })
}

generateSeed();