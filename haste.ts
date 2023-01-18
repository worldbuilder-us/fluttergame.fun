
require('dotenv').config()


export async function main() {

    const haste = await getHaste()

    //console.log(haste)

    const leaderBoardsWithOutParties = await haste.game.leaderboards();
    //const leaderBoardsWithParties = await haste.game.leaderboards(playerId);

    //console.log(leaderBoardsWithOutParties);
    //console.log(leaderBoardsWithParties);

    const leaderboard = leaderBoardsWithOutParties[1]

    console.log('leaderboard', leaderboard)

    const playerId = await Haste.validatePlayerAccess(handcash_token);

    console.log({playerId})

    const play = await haste.game.play(
        new Player(playerId),
        new Leaderboard(leaderboard.id)
    );

    console.log({play});    

    const score = await haste.game.score(play, 1);

    console.log({score});

    const leaders = await haste.game.leaders(new Leaderboard(leaderboard.id));

    console.log({leaders});

}

if (require.main === module) {

    main()

}