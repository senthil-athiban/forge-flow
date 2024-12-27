import { ApiError } from "../config/error.js";
import { prismaClient } from "../db/index.js";

const getAvailableTriggers = async () => {
    try {
        return await prismaClient.triggerTypes.findMany({});
    } catch (error) {
        throw new ApiError(400, "Failed to fetch available triggers")
    }
}

export default { getAvailableTriggers };