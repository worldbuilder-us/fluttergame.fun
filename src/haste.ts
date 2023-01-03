
require('dotenv').config()
import { Haste } from "@hastearcade/server";

export async function getHaste() {
    // see Testing for more details
    const environment = "nonproduction";
    const haste = await Haste.build(
        // Retrieve from Developer Portal
        process.env.haste_game_server_client_id,
        // Retrieve from Developer Portal
        process.env.haste_game_server_secret_key,
        environment
    );


    return haste
}
