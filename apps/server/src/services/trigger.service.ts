import { ApiError } from "../config/error";
import { prismaClient } from "../db";

const getAvailableTriggers = async () => {
    try {
        return await prismaClient.triggerTypes.findMany({});
    } catch (error) {
        throw new ApiError(400, "Failed to fetch available triggers")
    }
}

export default { getAvailableTriggers };