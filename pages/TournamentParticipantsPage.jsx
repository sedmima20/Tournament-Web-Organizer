import React from 'react'

export default function TournamentParticipantsPage({ tournamentData, triggerTournamentReload }) {
    return (
        <>
            <section>
                <h1>{tournamentData.tournament.name} - účastníci</h1>
                <pre>{JSON.stringify(tournamentData, null, 2)}</pre>
            </section>
        </>
    )
}
