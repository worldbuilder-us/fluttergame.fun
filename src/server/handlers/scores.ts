

import { getHaste } from "../../haste";

import { badRequest, unauthorized } from 'boom'

import { Haste, Leaderboard } from '@hastearcade/server'

export async function create(req, h) {

    try {

        const { leaderboard_id, handcash_token, play, score } = req.payload

        const haste = await getHaste()

        const playerId = await Haste.validatePlayerAccess(handcash_token);

        if (playerId === req.payload.play.playerId) {

            const result = await haste.game.score(play, score);

            console.log({result});
            
            const leaders = await haste.game.leaders(new Leaderboard(leaderboard_id));
            
            console.log({leaders});

            return { result, leaders }

        } else {

            return unauthorized('Invalid token')
        }
    

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}
