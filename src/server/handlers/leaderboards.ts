
import { getHaste } from "../../haste";

import { badRequest } from 'boom'

export async function index(req, h) {

    try {

        const haste = await getHaste()

        const leaderboards = await haste.game.leaderboards();
    
        return { leaderboards }
    

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}

export async function show(req, h) {

    try {

        const haste = await getHaste()

        const leaderboards = await haste.game.leaderboards();

        const [leaderboard] = leaderboards.filter(leaderboard => leaderboard.id === req.params.leaderboardId)

        if (!leaderboard) { throw new Error(`Leaderboard ${req.params.leaderboardId} not found`)}

        const leaders = await haste.game.leaders(leaderboard);
    
        return { leaders, leaderboard }
    

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}
