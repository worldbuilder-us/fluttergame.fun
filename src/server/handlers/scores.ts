

import { getHaste } from "../../haste";

import { badRequest, unauthorized } from 'boom'

import { Haste, Leaderboard } from '@hastearcade/server'

import { log } from "../../log";
import * as  models from "../../models";

export async function create(req, h) {

    try {

        log.info('haste.score.create', req.payload)

        const { handcash_token, play, score } = req.payload

        const existingScore = await models.Score.findOne({
            where: {
                play_id: play.id
            }
        })

        if (existingScore) {
            throw new Error(`Score already submitted for play ${play.id}`)
        }

        const haste = await getHaste()

        const playerId = await Haste.validatePlayerAccess(handcash_token);

        log.info('haste.playId', { playerId })

        if (playerId === req.payload.play.playerId) {

            const result = await haste.game.score(play, score);

            console.log({result});

            const record = await models.Score.create({
              play_id: req.payload.play.id,
              playerId: req.payload.play.playerId,
              leaderboardId: req.payload.play.leaderboardId,
              result
            })

            console.log('score.record.created', record.toJSON())
            
            return { result }

        } else {

            return unauthorized('Invalid token')
        }
    

    } catch(error) {
            
            console.log({error})

            return badRequest(error)
    }

}
