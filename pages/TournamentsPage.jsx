import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import ModalDialog from '/components/ModalDialog.jsx'
import closingX from '/images/closing-x.png'

export default function TournamentsPage() {
    const { token, setToken } = useContext(TokenContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const [dialogAlertContent, setDialogAlertContent] = useState(undefined)
    const [tournamentsData, setTournamentsData] = useState(undefined)
    const [hasUserWriteAccess, setHasUserWriteAccess] = useState(undefined)
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const [isCreateTournamentDialogOpen, setIsCreateTournamentDialogOpen] = useState(false)
    const [createTournamentFormData, setCreateTournamentFormData] = useState({tournamentName: ""})
    const { queryUsername } = useParams()
    const getTournamentsRequest = useTwoApiRequest()
    const getPublicTournamentsRequest = useTwoApiRequest({
        endpoint: 'get_latest_public_tournaments'
    })
    const checkUserWriteAccessRequest = useTwoApiRequest()
    const createTournamentRequest = useTwoApiRequest()

    useEffect(() => {
        loadTournaments()
    }, [token, queryUsername])

    // Ověření, zda má přihlášený uživatel právo na zápis zobrazeného uživatele a jeho turnajů
    useEffect(() => {
        if (token && queryUsername) {
            checkUserWriteAccessRequest.fetchData({
                endpoint: 'can_write_user',
                username: queryUsername,
                token: token
            })
                .then((data) => {
                    setHasUserWriteAccess(data.responseData)
                })
        } else {
            setHasUserWriteAccess(undefined)
        }
    }, [token, queryUsername])

    // Funkce pro načítání seznamu turnajů. Spouští se useEffectem hned po načtení stránky, při změně tokenu a při případné změně username v query. Spustí se také hned po vytvoření nového turnaje.
    // V případě, že v query chybí username, jsou načteny nejnovější veřejné turnaje, nikoli turnaje konkrétního uživatele.
    function loadTournaments() {
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
    }

    function handleCreateTournamentClick() {
        setIsCreateTournamentDialogOpen(true)
    }

    function handleCreateTournamentFormDataChange(event) {
        setCreateTournamentFormData(prevCreateTournamentFormData => {
            return {
                ...prevCreateTournamentFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleCreateTournamentFormSubmit() {
        if (createTournamentFormData.tournamentName && !isOngoingRequest) {
            setIsOngoingRequest(true)
            createTournamentRequest.fetchData({
                endpoint: 'create_tournament',
                name: createTournamentFormData.tournamentName,
                username: queryUsername,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 201) {
                        setAlertContent({ msg: 'Turnaj byl vytvořen 👍', severity: 'info' })
                        closeCreateTournamentDialog()
                        loadTournaments()
                        // přesměrovat na nástěnku? jak to udělat? API zatím nevrací ID vytvořeného turnaje
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, turnaj se nám nepodařilo vytvořit.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function closeCreateTournamentDialog() {
        setIsCreateTournamentDialogOpen(false)
        setCreateTournamentFormData({tournamentName: ""})
        setDialogAlertContent(undefined)
    }

    return (
        <>
            {isCreateTournamentDialogOpen &&
                <ModalDialog>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeCreateTournamentDialog}/>
                    {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                    <h2>Vytvořit nový turnaj</h2>
                    <input
                        type="text"
                        placeholder="Název turnaje"
                        onChange={handleCreateTournamentFormDataChange}
                        name="tournamentName"
                        value={createTournamentFormData.tournamentName}
                        maxLength="100"
                        disabled={isOngoingRequest}
                    />
                    <button onClick={handleCreateTournamentFormSubmit} disabled={!createTournamentFormData.tournamentName || isOngoingRequest}>Vytvořit!</button>
                </ModalDialog>
            }
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
                {hasUserWriteAccess && <button onClick={handleCreateTournamentClick}>Vytvořit turnaj</button>}
                {tournamentsData ?
                    (tournamentsData.length !== 0 ?
                        <table>
                            <tbody>
                            {tournamentsData.map((tournament) => (
                                <tr key={tournament.id}>
                                    <td>
                                        <Link to={'/tournament/' + tournament.id}>{tournament.name}</Link> #{tournament.id}
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
