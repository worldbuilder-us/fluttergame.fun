
require('dotenv').config()

const axios = require('axios')

export async function main() {

    const { data: { leaderboards }} = await axios.get(`https://fluttergame.fun/api/v1/haste/leaderboards`)

    console.log({leaderboards})

    const params = {
        handcash_token: process.env.handcash_token,
        leaderboard_id: leaderboards[1].id
    }

    console.log('PARAMS', params)

    const { data } = await axios.post(`https://fluttergame.fun/api/v1/haste/plays`, params)

    console.log({data})

    const scoreParams = {
        handcash_token: process.env.handcash_token,
        leaderboard_id: leaderboards[0].id,
        play: data.play,
        score: 100
    }

    console.log('SCORE PARAMS', scoreParams)

    const { data: scoresResult } = await axios.post(`https://fluttergame.fun/api/v1/haste/scores`, scoreParams)

    console.log({scoresResult})

}

main()
