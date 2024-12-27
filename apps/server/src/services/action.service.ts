import { ApiError } from "../config/error.js";
import { prismaClient } from "../db/index.js";

const getAvailableActions = async() => {
    try {
        return await prismaClient.actionTypes.findMany({});
    } catch (error) {
        throw new ApiError(400, "Failed to fetch available actions")
    }
}

export default { getAvailableActions };