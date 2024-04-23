import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'
import { TokenContext } from '/contexts/TokenContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'

export default function TournamentsPage() {
    const { token, setToken } = useContext(TokenContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)
    const [tournamentsData, setTournamentsData] = useState(undefined)
    const { queryUsername } = useParams()
    const getTournamentsRequest = useTwoApiRequest()
    const getPublicTournamentsRequest = useTwoApiRequest({
        endpoint: 'get_latest_public_tournaments'
    })

    useEffect(() => {
        if (queryUsername) {
            getTournamentsRequest.fetchData({
                endpoint: 'get_user_tournaments',
                username: queryUsername,
                token: token
            })
                .then((data) => {
                    setTournamentsData(data.responseData)
                })
        } else {
            getPublicTournamentsRequest.fetchData()
                .then((data) => {
                    setTournamentsData(data.responseData)
                })
        }
    }, [token, queryUsername])

    return (
        <>
            <section>
                <h1>
                    {queryUsername ?
                        (loggedUserData && loggedUserData.username === queryUsername ?
                            "Moje turnaje" :
                            "Turnaje uživatele „" + queryUsername + "“"
                        ) :
                        "Nejnovější turnaje"
                    }
                </h1>
                {tournamentsData ?
                    (tournamentsData.length !== 0 ?
                        // Provizorní tabulka vygenerovaná umělou inteligencí - upravit a doladit
                        <table>
                            <tbody>
                            {tournamentsData.map((tournament) => (
                                <tr key={tournament.id}>
                                    <td>
                                        {tournament.name} #{tournament.id}
                                        {tournament.description && <><br/>{tournament.description}</>}
                                    </td>
                                    <td>Organizuje: {tournament.owner_username}</td>
                                    <td>
                                        Viditelnost: {tournament.visibility === 'public' ? "Veřejný" : "Soukromý"}<br/>
                                        {tournament.status === 'preparation' && "Příprava"}
                                        {tournament.status === 'running' && "Probíhá"}
                                        {tournament.status === 'ended' && "Ukončen"}
                                    </td>
                                    <td>
                                        {tournament.current_round ?
                                            `Kolo ${tournament.current_round}/${tournament.rounds}` :
                                            `Počet kol: ${tournament.rounds}`
                                        }
                                    </td>
                                    <td>
                                        Hráči: {tournament.player_count}<br/>
                                        Zápasy: {tournament.match_count}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table> :
                        (queryUsername ?
                            (loggedUserData && loggedUserData.username === queryUsername ?
                                <p>Zatím žádné turnaje. Vytvoř první!</p> :
                                <p>Uživatel zatím nemá žádné turnaje.</p>
                            ) :
                            <p>Momentálně nejsou naplánovány žádné veřejné turnaje.</p>
                        )
                    ) :
                    <div className="error-box">Turnaje se nepodařilo načíst</div>
                }
            </section>
        </>
    )
}
