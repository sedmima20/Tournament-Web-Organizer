import React from 'react'

export default function TournamentDashboardPage({ tournamentData, triggerTournamentReload }) {
    return (
        <>
            <section>
                <h1>{tournamentData.tournament.name}</h1>
                <pre>{JSON.stringify(tournamentData, null, 2)}</pre>
            </section>
        </>
    )
}
