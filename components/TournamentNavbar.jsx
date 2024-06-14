import React from 'react'
import { Link } from 'react-router-dom'

export default function TournamentNavbar({ queryTournamentId, hasTournamentWriteAccess }) {
    return (
        <nav>
            <ul>
                <li>
                    <Link to={'/tournament/' + queryTournamentId}>Nástěnka turnaje</Link>
                </li>
                <li>
                    <Link to={'/tournament/' + queryTournamentId + '/participants'}>Účastníci</Link>
                </li>
                {hasTournamentWriteAccess &&
                    <li>
                        <Link to={'/tournament/' + queryTournamentId + '/settings'}>Nastavení</Link>
                    </li>
                }
            </ul>
        </nav>
    )
}
