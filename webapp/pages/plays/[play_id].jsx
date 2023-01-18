import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ShowPlay() {

    const { query } = useRouter()

    const { play_id } = query

    const [play, setPlay] = useState(null)

    const [leaderboards, setLeaderboards] = useState(null)

    const [hasteClient, setHasteClient] = useState();

    useEffect(() => {

        axios.get(`http://localhost:5200/api/plays/${play_id}`).then(({data}) => {

            setPlay(data.play)
        })

        axios.get(`http://localhost:5200/api/v1/haste/leaderboards`).then(({data}) => {

            setLeaderboards(data.leaderboards)
        })

    }, [])

    if (!hasteClient) {

        setHasteClient(HasteClient.build());

    } 

    const details = hasteClient.getTokenDetails();

    if (!details.isAuthenticated) {
            
            hasteClient.login();
            return
    }

    return (
        <>{play_id}</>
    )

}