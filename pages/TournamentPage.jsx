import React, { useContext, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import TournamentNavbar from '/components/TournamentNavbar.jsx'
import TournamentDashboardPage from '/pages/TournamentDashboardPage.jsx'
import TournamentParticipantsPage from '/pages/TournamentParticipantsPage.jsx'
import TournamentSettingsPage from '/pages/TournamentSettingsPage.jsx'

export default function TournamentPage() {
    const { token, setToken } = useContext(TokenContext)
    const [tournamentData, setTournamentData] = useState({
        tournament: undefined,
        players: undefined,
        playersRanking: undefined,
        matches: undefined,
        hasTournamentWriteAccess: undefined,
        accessDenied: undefined
    })
    const [triggerTournamentReloadValue, setTriggerTournamentReloadValue] = useState(0)
    const { queryTournamentId, querySubpage } = useParams()
    const loadTournamentDataIntervalRef = useRef(undefined)
    const getTournamentRequest = useTwoApiRequest()
    const getTournamentPlayersRequest = useTwoApiRequest()
    const getTournamentPlayersRankingRequest = useTwoApiRequest()
    const getTournamentMatchesRequest = useTwoApiRequest()
    const checkTournamentWriteAccessRequest = useTwoApiRequest()

    // Načtení všech dat turnaje při prvním vyrenderování komponety a poté každých 30 sekund. Spustí se také po případné změně tokenu nebo ID turnaje v query. Manuálně lze spustit (a resetovat interval) libovolnou aktualizací stavové proměnné triggerTournamentReloadValue například poté, co organizátor provede nějakou akci.
    useEffect(() => {
        loadTournamentData()

        loadTournamentDataIntervalRef.current = setInterval(loadTournamentData, 30000)

        return () => {
            clearInterval(loadTournamentDataIntervalRef.current)
        }
    }, [token, queryTournamentId, triggerTournamentReloadValue])

    // Funkce pro načtení/aktualizaci všech dat turnaje do stavové proměnné. Spouští se automaticky useEffectem.
    function loadTournamentData() {
        // tournament
        getTournamentRequest.fetchData({
            endpoint: 'get_tournament',
            tournament_id: queryTournamentId,
            token: token
        })
            .then((data) => {
                if (data.statusCode === 200) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            tournament: data.responseData,
                            accessDenied: false
                        }
                    })
                } else if (data.statusCode === 403) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            tournament: data.responseData,
                            accessDenied: true
                        }
                    })
                }
            })

        // players
        getTournamentPlayersRequest.fetchData({
            endpoint: 'get_tournament_players',
            tournament_id: queryTournamentId,
            token: token,
            order: 'normal'
        })
            .then((data) => {
                if (data.statusCode === 200) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            players: data.responseData,
                            accessDenied: false
                        }
                    })
                } else if (data.statusCode === 403) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            players: data.responseData,
                            accessDenied: true
                        }
                    })
                }
            })

        // playersRanking
        getTournamentPlayersRankingRequest.fetchData({
            endpoint: 'get_tournament_players',
            tournament_id: queryTournamentId,
            token: token,
            order: 'ranking'
        })
            .then((data) => {
                if (data.statusCode === 200) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            playersRanking: data.responseData,
                            accessDenied: false
                        }
                    })
                } else if (data.statusCode === 403) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            playersRanking: data.responseData,
                            accessDenied: true
                        }
                    })
                }
            })

        // matches
        getTournamentMatchesRequest.fetchData({
            endpoint: 'get_tournament_matches',
            tournament_id: queryTournamentId,
            token: token
        })
            .then((data) => {
                if (data.statusCode === 200) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            matches: data.responseData,
                            accessDenied: false
                        }
                    })
                } else if (data.statusCode === 403) {
                    setTournamentData(prevTournamentData => {
                        return {
                            ...prevTournamentData,
                            matches: data.responseData,
                            accessDenied: true
                        }
                    })
                }
            })

        // hasTournamentWriteAccess
        if (token) {
            checkTournamentWriteAccessRequest.fetchData({
                endpoint: 'can_write_tournament',
                tournament_id: queryTournamentId,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 200) {
                        setTournamentData(prevTournamentData => {
                            return {
                                ...prevTournamentData,
                                hasTournamentWriteAccess: data.responseData
                            }
                        })
                    }
                })
        } else {
            setTournamentData(prevTournamentData => {
                return {
                    ...prevTournamentData,
                    hasTournamentWriteAccess: false
                }
            })
        }
    }

    function triggerTournamentReload() {
        setTriggerTournamentReloadValue(prevTriggerTournamentReloadValue => prevTriggerTournamentReloadValue + 1)
    }

    if (tournamentData.accessDenied) return <div className="error-box">Turnaj neexistuje nebo je soukromý 🔒</div>
    if (!tournamentData.tournament) return <div className="error-box">Turnaj se nám nepodařilo načíst</div>

    switch (querySubpage) {
        case 'participants':
            return (
                <>
                    <TournamentNavbar queryTournamentId={queryTournamentId} hasTournamentWriteAccess={tournamentData.hasTournamentWriteAccess} />
                    <TournamentParticipantsPage tournamentData={tournamentData} triggerTournamentReload={triggerTournamentReload} />
                </>
            )
        case 'settings':
            return (
                <>
                    <TournamentNavbar queryTournamentId={queryTournamentId} hasTournamentWriteAccess={tournamentData.hasTournamentWriteAccess} />
                    <TournamentSettingsPage tournamentData={tournamentData} triggerTournamentReload={triggerTournamentReload} />
                </>
            )
        default:
            return (
                <>
                    <TournamentNavbar queryTournamentId={queryTournamentId} hasTournamentWriteAccess={tournamentData.hasTournamentWriteAccess} />
                    <TournamentDashboardPage tournamentData={tournamentData} triggerTournamentReload={triggerTournamentReload} />
                </>
            )
    }
}
