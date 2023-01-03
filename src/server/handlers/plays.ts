

import { getHaste } from "../../haste";

import { badRequest } from 'boom'

import { Haste, Player, Leaderboard } from '@hastearcade/server'

export async function create(req, h) {

    try {

        const { leaderboard_id, handcash_token } = req.payload

        const haste = await getHaste()

        const playerId = await Haste.validatePlayerAccess(handcash_token);

        const play = await haste.game.play(
            new Player(playerId),
            new Leaderboard(leaderboard_id)
        );

        return { play }
    

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}
