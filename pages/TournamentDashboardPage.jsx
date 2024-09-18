import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function TournamentDashboardPage({ tournamentData, triggerTournamentReload }) {
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const navigate = useNavigate()

    function handleAddTournamentDescriptionClick() {
        navigate('/tournament/' + tournamentData.tournament.id + '/settings')
    }

    return (
        <>
            <section>
                <h1>{tournamentData.tournament.name}<small> #{tournamentData.tournament.id}</small></h1>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <small>
                                    {tournamentData.tournament.visibility === 'public' ? "👁️ Veřejně viditelný" : "🔒 Soukromý"}
                                    {tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' &&
                                        <> (<Link to={"/tournament/" + tournamentData.tournament.id + "/settings"}>změnit</Link>)</>
                                    }
                                </small>
                            </td>
                            <td>
                                <small>
                                    🙋 {tournamentData.tournament.status !== 'ended' ? "Organizuje" : "Organizoval(a)"} <Link to={"/tournaments/" + tournamentData.tournament.owner_username}>{tournamentData.tournament.owner_username}</Link>
                                </small>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {tournamentData.tournament.status === 'preparation' &&
                    <p>
                        🟢 Turnaj ještě nezačal. {tournamentData.tournament.rounds >= 2 && tournamentData.tournament.rounds <= 4 ? 'Budou' : 'Bude'} se hrát {tournamentData.tournament.rounds} {tournamentData.tournament.rounds === '1' ? 'kolo' : (tournamentData.tournament.rounds >= 2 && tournamentData.tournament.rounds <= 4) ? 'kola' : 'kol'}.
                        {tournamentData.hasTournamentWriteAccess &&
                            <> (<Link to={"/tournament/" + tournamentData.tournament.id + "/settings"}>upravit</Link>)</>
                        }
                    </p>
                }
                {tournamentData.tournament.status === 'running' &&
                    <p>🟡 Právě probíhá {tournamentData.tournament.current_round}.{tournamentData.tournament.current_round === tournamentData.tournament.rounds && " (poslední)"} kolo.</p>
                }
                {tournamentData.tournament.status === 'ended' &&
                    <p>🔴 Turnaj již skončil. Gratulujeme vítězům! 🏆</p>
                }

                {tournamentData.tournament.description &&
                    <p style={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}>{tournamentData.tournament.description}</p>
                }
                {!tournamentData.tournament.description && tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' &&
                    <button onClick={handleAddTournamentDescriptionClick} disabled={isOngoingRequest}>Přidat popis turnaje ✏️</button>
                }
                <table>
                    <tbody>
                        <tr>
                            <td>
                                👥 {tournamentData.tournament.status === 'preparation' && (tournamentData.tournament.player_count === '1' ? 'Přihlášen ' : (tournamentData.tournament.player_count >= 2 && tournamentData.tournament.player_count <= 4) ? 'Přihlášeni ' : 'Přihlášeno ')}{tournamentData.tournament.player_count} {tournamentData.tournament.player_count === '1' ? 'hráč' : (tournamentData.tournament.player_count >= 2 && tournamentData.tournament.player_count <= 4) ? 'hráči' : 'hráčů'}
                                {tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' ?
                                    <> (<Link to={"/tournament/" + tournamentData.tournament.id + "/participants"}>spravovat</Link>)</> :
                                    <> (<Link to={"/tournament/" + tournamentData.tournament.id + "/participants"}>zobrazit</Link>)</>
                                }
                            </td>
                            {tournamentData.tournament.current_round || tournamentData.tournament.status === 'running' ?
                                <td>⚪ Kolo {tournamentData.tournament.current_round}/{tournamentData.tournament.rounds}</td> :
                                (tournamentData.tournament.status === 'preparation' ?
                                    <td>
                                        ⚪ {tournamentData.tournament.rounds >= 2 && tournamentData.tournament.rounds <= 4 ? 'Naplánována' : 'Naplánováno'} {tournamentData.tournament.rounds} {parseInt(tournamentData.tournament.rounds, 10) === 1 ? 'kolo' : (tournamentData.tournament.rounds >= 2 && tournamentData.tournament.rounds <= 4) ? 'kola' : 'kol'}
                                        {tournamentData.hasTournamentWriteAccess &&
                                            <> (<Link to={"/tournament/" + tournamentData.tournament.id + "/settings"}>upravit</Link>)</>
                                        }
                                    </td> :
                                    <td>⚪ {tournamentData.tournament.rounds >= 2 && tournamentData.tournament.rounds <= 4 ? 'Odehrána' : 'Odehráno'} {tournamentData.tournament.rounds} {parseInt(tournamentData.tournament.rounds, 10) === 1 ? 'kolo' : (tournamentData.tournament.rounds >= 2 && tournamentData.tournament.rounds <= 4) ? 'kola' : 'kol'}</td>
                                )
                            }
                        </tr>
                    </tbody>
                </table>
            </section>
            {tournamentData.hasTournamentWriteAccess &&
                <section>
                    <h2>Akce</h2>
                    <p>🔒 Soukromá sekce organizátora. Tlačítka pro ovládání turnaje již brzy, prozatím použij API.</p>
                </section>
            }
            {tournamentData.tournament.current_round && tournamentData.tournament.status === 'running' &&
                <section>
                    <h2>Právě se hraje: {tournamentData.tournament.current_round}. kolo</h2>
                    {tournamentData.players && tournamentData.matches && tournamentData.matches.some((match) => match.round === tournamentData.tournament.current_round) ?
                        <table>
                            <thead>
                                <tr>
                                    <th><small>#</small></th>
                                    <th>Hráč 1</th>
                                    <th colSpan="2">Skóre</th>
                                    <th>Hráč 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournamentData.matches.filter((match) => match.round === tournamentData.tournament.current_round).map(match => (
                                    <tr key={match.id}>
                                        <td><small>#{match.id}</small></td>
                                        <td style={{backgroundColor: match.player1_wins > match.player2_wins ? 'gold' : 'transparent'}}>{match.player1_id === null ? <span style={{ fontStyle: 'italic' }}>Hráč byl odstraněn.</span> : (tournamentData.players.find(player => player.id === match.player1_id)?.name || <span style={{ fontStyle: 'italic' }}>Hráče se nepodařilo načíst.</span>)}</td>
                                        <td>{match.player1_wins}</td>
                                        <td>{match.player2_wins}</td>
                                        <td style={{backgroundColor: match.player2_wins > match.player1_wins ? 'gold' : 'transparent'}}>{match.player2_id === null ? <span style={{ fontStyle: 'italic' }}>Hráč byl odstraněn.</span> : (tournamentData.players.find(player => player.id === match.player2_id)?.name || <span style={{ fontStyle: 'italic' }}>Hráče se nepodařilo načíst.</span>)}</td>
                                    </tr>
                                ))}
                                {(() => {
                                    const byePlayer = tournamentData.players.find(player => player.bye_round === tournamentData.tournament.current_round)
                                    return byePlayer ?
                                    (
                                        <tr>
                                            <td><small>-</small></td>
                                            <td style={{backgroundColor: 'gold'}}>{byePlayer.name}</td>
                                            <td>–</td>
                                            <td>–</td>
                                            <td><span style={{ fontStyle: 'italic' }}>bye</span></td>
                                        </tr>
                                    ) :
                                    null
                                })()}
                            </tbody>
                        </table> :
                        <div className="error-box">Rozpis zápasů se nepodařilo načíst</div>
                    }
                </section>
            }
            {tournamentData.tournament.status !== 'preparation' &&
                <section>
                    <h2>{tournamentData.tournament.status === 'running' ? "Průběžné" : "Konečné"} pořadí</h2>
                    {tournamentData.playersRanking && tournamentData.playersRanking.length > 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Pořadí</th>
                                    <th>Účastník</th>
                                    <th>1. Základní body<br/><small>(výhra: 1, remíza: 0.5, bye: 1)</small></th>
                                    <th>2. Celkové skóre<br/><small>(branky)</small></th>
                                    <th>3. Buchholz<br/><small>(součet bodů soupeřů)</small></th>
                                    <th>4. Sekundární Buchholz<br/><small>(součet branek soupeřů)</small></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournamentData.playersRanking.map(player => (
                                    <tr
                                        key={player.id}
                                        style={{
                                            backgroundColor:
                                                player.rank === 1 ?
                                                    'gold' :
                                                    player.rank === 2 ?
                                                        'silver' :
                                                        player.rank === 3 ?
                                                            '#fca956' :
                                                            'transparent'
                                        }}
                                    >
                                        <td>{player.rank}</td>
                                        <td>{player.name}</td>
                                        <td>{parseFloat(player.score).toFixed(1)}</td>
                                        <td>{player.points}</td>
                                        <td>{parseFloat(player.buchholz).toFixed(1)}</td>
                                        <td>{player.buchholz2}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> :
                        <div className="error-box">Hráče se nepodařilo načíst</div>
                    }
                </section>
            }
            {tournamentData.tournament.status !== 'preparation' && tournamentData.players && tournamentData.matches && tournamentData.matches.some((match) => match.round !== tournamentData.tournament.current_round) &&
                <section>
                    <h2>Odehraná kola</h2>
                    {Array.from({ length: tournamentData.tournament.rounds }, (_, i) => tournamentData.tournament.rounds - i).filter((roundNumber) => roundNumber.toString() !== tournamentData.tournament.current_round && tournamentData.matches.some((match) => match.round === roundNumber.toString())).map((roundNumber) => (
                        <section key={`${tournamentData.tournament.id}-${roundNumber}`}>
                            <h3>{roundNumber}. kolo</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th><small>#</small></th>
                                        <th>Hráč 1</th>
                                        <th colSpan="2">Skóre</th>
                                        <th>Hráč 2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tournamentData.matches.filter((match) => match.round === roundNumber.toString()).map(match => (
                                        <tr key={match.id}>
                                            <td><small>#{match.id}</small></td>
                                            <td style={{backgroundColor: match.player1_wins > match.player2_wins ? 'gold' : 'transparent'}}>{match.player1_id === null ? <span style={{ fontStyle: 'italic' }}>Hráč byl odstraněn.</span> : (tournamentData.players.find(player => player.id === match.player1_id)?.name || <span style={{ fontStyle: 'italic' }}>Hráče se nepodařilo načíst.</span>)}</td>
                                            <td>{match.player1_wins}</td>
                                            <td>{match.player2_wins}</td>
                                            <td style={{backgroundColor: match.player2_wins > match.player1_wins ? 'gold' : 'transparent'}}>{match.player2_id === null ? <span style={{ fontStyle: 'italic' }}>Hráč byl odstraněn.</span> : (tournamentData.players.find(player => player.id === match.player2_id)?.name || <span style={{ fontStyle: 'italic' }}>Hráče se nepodařilo načíst.</span>)}</td>
                                        </tr>
                                    ))}
                                    {(() => {
                                        const byePlayer = tournamentData.players.find(player => player.bye_round === roundNumber.toString())
                                        return byePlayer ?
                                            (
                                                <tr>
                                                    <td><small>-</small></td>
                                                    <td style={{backgroundColor: 'gold'}}>{byePlayer.name}</td>
                                                    <td>–</td>
                                                    <td>–</td>
                                                    <td><span style={{ fontStyle: 'italic' }}>bye</span></td>
                                                </tr>
                                            ) :
                                            null
                                    })()}
                                </tbody>
                            </table>
                        </section>
                    ))}
                </section>
            }
            {/*<section>
                <h2>Debug</h2>
                <pre>{JSON.stringify(tournamentData, null, 2)}</pre>
            </section>*/}
        </>
    )
}
