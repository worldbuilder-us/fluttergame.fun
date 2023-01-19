

import { getHaste } from "../../haste";

import { badRequest } from 'boom'

import { Haste, Player, Leaderboard } from '@hastearcade/server'

import { publish } from 'rabbi'

import { log } from '../../log'

import * as models from '../../models'

export async function create(req, h) {

    try {

        const { leaderboard_id, handcash_token } = req.payload

        const haste = await getHaste()

        const playerId = await Haste.validatePlayerAccess(handcash_token);

        log.info('haste.playerId.validated', {playerId, handcash_token})

        log.info('haste.game.play', { playerId, leaderboard_id, handcash_token })

        const play = await haste.game.play(
            new Player(playerId),
            new Leaderboard(leaderboard_id)
        );

        log.info('haste.play.created', play)

        publish('immutable.games', 'haste.play.created', play)

        const record = await models.Play.create({
            guid: play.id,
            gameId: play.gameId,
            leaderboardId: play.leaderboard.id,
            playerId: play.playerId,
            data: play
        })        

        return { play, record: record.toJSON() }
    

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}

export async function index(req, h) {

    try {

        /* List User Plays From Database */

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}

export async function show(req, h) {

    try {

        const { play_id } = req.params

        const play = await models.Play.findOne({
            where: { guid: play_id }
        })

        if (!play) return badRequest('Play not found')

        return { play: play.toJSON() }

        /* Load a Single Play From Database */        

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}
