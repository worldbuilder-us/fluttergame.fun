
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
