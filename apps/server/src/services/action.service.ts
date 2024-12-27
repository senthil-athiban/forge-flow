import { ApiError } from "../config/error";
import { prismaClient } from "../db";

const getAvailableActions = async() => {
    try {
        return await prismaClient.actionTypes.findMany({});
    } catch (error) {
        throw new ApiError(400, "Failed to fetch available actions")
    }
}

export default { getAvailableActions };