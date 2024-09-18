import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import ModalDialog from '/components/ModalDialog.jsx'
import closingX from '/images/closing-x.png'
import playerReactivateIcon from '/images/player-reactivate-icon.svg'

export default function TournamentParticipantsPage({ tournamentData, triggerTournamentReload }) {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const [dialogAlertContent, setDialogAlertContent] = useState(undefined)
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false)
    const [addPlayerFormData, setAddPlayerFormData] = useState({playerName: ""})
    const [changePlayerNameFormData, setChangePlayerNameFormData] = useState({playerName: ""})
    const [deletePlayerFormData, setDeletePlayerFormData] = useState({deletionType: ""})
    const [selectedChangePlayerNameId, setSelectedChangePlayerNameId] = useState(undefined)
    const [selectedReactivatePlayerId, setSelectedReactivatePlayerId] = useState(undefined)
    const [selectedDeletePlayerId, setSelectedDeletePlayerId] = useState(undefined)
    const addPlayerRequest = useTwoApiRequest()
    const updatePlayerRequest = useTwoApiRequest()
    const softDeletePlayerRequest = useTwoApiRequest()
    const hardDeletePlayerRequest = useTwoApiRequest()
    const reactivatePlayerRequest = useTwoApiRequest()

    function handleAddPlayerClick() {
        setIsAddPlayerDialogOpen(true)
    }

    function handleAddPlayerFormDataChange(event) {
        setAddPlayerFormData(prevAddPlayerFormData => {
            return {
                ...prevAddPlayerFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleAddPlayerFormSubmit() {
        if (addPlayerFormData.playerName && !isOngoingRequest) {
            setIsOngoingRequest(true)
            addPlayerRequest.fetchData({
                endpoint: 'add_player',
                name: addPlayerFormData.playerName,
                tournament_id: tournamentData.tournament.id,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 201) {
                        setAlertContent({ msg: 'Hráč/tým byl přidán 👍', severity: 'info' })
                        closeAddPlayerDialog()
                        triggerTournamentReload()
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, hráče/tým se nám nepodařilo přidat.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function closeAddPlayerDialog() {
        setIsAddPlayerDialogOpen(false)
        setAddPlayerFormData({playerName: ""})
        setDialogAlertContent(undefined)
    }

    function handleChangePlayerNameDoubleClick(event) {
        if (tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' && !isOngoingRequest) {
            setSelectedChangePlayerNameId(parseInt(event.target.getAttribute('data-player-id')))
            setChangePlayerNameFormData({playerName: event.target.getAttribute('data-player-name')})
        }
    }

    function handleChangePlayerNameFormDataChange(event) {
        setChangePlayerNameFormData(prevChangePlayerNameFormData => {
            return {
                ...prevChangePlayerNameFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleChangePlayerNameFormSubmit(event) {
        if (changePlayerNameFormData.playerName && changePlayerNameFormData.playerName !== event.target.getAttribute('data-player-prev-name') && !isOngoingRequest && selectedChangePlayerNameId !== undefined) {
            setIsOngoingRequest(true)
            updatePlayerRequest.fetchData({
                endpoint: 'update_player',
                new_name: changePlayerNameFormData.playerName,
                player_id: selectedChangePlayerNameId,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        setAlertContent({ msg: 'Hráč/tým byl přejmenován 👍', severity: 'info' })
                        deselectChangePlayerNameId()
                        triggerTournamentReload()
                    } else {
                        setAlertContent({ msg: 'Něco se pokazilo, hráče/tým se nám nepodařilo přejmenovat.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        } else {
            deselectChangePlayerNameId()
        }
    }

    function deselectChangePlayerNameId() {
        setSelectedChangePlayerNameId(undefined)
        setChangePlayerNameFormData({playerName: ""})
    }

    function handleDeletePlayerClick(event) {
        setSelectedDeletePlayerId(parseInt(event.target.getAttribute('data-player-id')))
    }

    function handleDeletePlayerFormDataChange(event) {
        setDeletePlayerFormData(prevDeletePlayerFormData => {
            return {
                ...prevDeletePlayerFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSoftDeletePlayerFormSubmit() {
        if (!isOngoingRequest && selectedDeletePlayerId !== undefined) {
            setIsOngoingRequest(true)
            softDeletePlayerRequest.fetchData({
                endpoint: 'update_player',
                player_id: selectedDeletePlayerId,
                new_excluded: 1,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        setAlertContent({ msg: 'Hráč/tým byl deaktivován 👍', severity: 'info' })
                        closeDeletePlayerDialog()
                        triggerTournamentReload()
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, hráče/tým se nám nepodařilo deaktivovat.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function handleHardDeletePlayerFormSubmit() {
        if (!isOngoingRequest && selectedDeletePlayerId !== undefined) {
            setIsOngoingRequest(true)
            hardDeletePlayerRequest.fetchData({
                endpoint: 'delete_player',
                player_id: selectedDeletePlayerId,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        if (tournamentData.tournament.status === 'preparation') {
                            setAlertContent({ msg: 'Hráč/tým byl smazán 👍', severity: 'info' })
                        } else {
                            setAlertContent({ msg: 'Hráč/tým byl odstraněn 👍', severity: 'info' })
                        }
                        closeDeletePlayerDialog()
                        triggerTournamentReload()
                    } else {
                        if (tournamentData.tournament.status === 'preparation') {
                            setDialogAlertContent({ msg: 'Něco se pokazilo, hráče/tým se nám nepodařilo smazat.', severity: 'error' })
                        } else {
                            setDialogAlertContent({ msg: 'Něco se pokazilo, hráče/tým se nám nepodařilo odstranit.', severity: 'error' })
                        }
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function closeDeletePlayerDialog() {
        setSelectedDeletePlayerId(undefined)
        setDeletePlayerFormData({deletionType: ""})
        setDialogAlertContent(undefined)
    }

    function handleReactivatePlayerClick(event) {
        setSelectedReactivatePlayerId(parseInt(event.target.getAttribute('data-player-id')))
    }

    function handleReactivatePlayerFormSubmit() {
        if (!isOngoingRequest && selectedReactivatePlayerId !== undefined) {
            setIsOngoingRequest(true)
            reactivatePlayerRequest.fetchData({
                endpoint: 'update_player',
                player_id: selectedReactivatePlayerId,
                new_excluded: 0,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        setAlertContent({ msg: 'Hráč/tým byl znovuaktivován 👍', severity: 'info' })
                        closeReactivatePlayerDialog()
                        triggerTournamentReload()
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, hráče/tým se nám nepodařilo znovuaktivovat.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function closeReactivatePlayerDialog() {
        setSelectedReactivatePlayerId(undefined)
        setDialogAlertContent(undefined)
    }

    return (
        <>
            {isAddPlayerDialogOpen &&
                <ModalDialog onClose={closeAddPlayerDialog}>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeAddPlayerDialog}/>
                    {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                    <h2>Přidat hráče</h2>
                    <input
                        type="text"
                        placeholder="Jméno hráče nebo název týmu"
                        onChange={handleAddPlayerFormDataChange}
                        name="playerName"
                        value={addPlayerFormData.playerName}
                        maxLength="50"
                        disabled={isOngoingRequest}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAddPlayerFormSubmit()
                            }
                        }}
                    />
                    <button onClick={handleAddPlayerFormSubmit} disabled={!addPlayerFormData.playerName || isOngoingRequest}>Přidat</button>
                </ModalDialog>
            }
            {selectedDeletePlayerId !== undefined &&
                (tournamentData.tournament.status === 'preparation' ?
                    <ModalDialog onClose={closeDeletePlayerDialog}>
                        <img src={closingX} alt="dialog-closing-x-icon" onClick={closeDeletePlayerDialog}/>
                        {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                        <h2>Smazat hráče/tým ze seznamu účastníků?</h2>
                        <button onClick={handleHardDeletePlayerFormSubmit} disabled={isOngoingRequest}>Smazat</button>
                        <button onClick={closeDeletePlayerDialog} disabled={isOngoingRequest}>Zrušit</button>
                    </ModalDialog> :
                    (tournamentData.players.find(player => player.id === selectedDeletePlayerId.toString())?.excluded === "1" ?
                        <ModalDialog onClose={closeDeletePlayerDialog}>
                            <img src={closingX} alt="dialog-closing-x-icon" onClick={closeDeletePlayerDialog}/>
                            {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                            <h2>Odstranit hráče/tým z turnaje?</h2>
                            <p>Hráč/tým bude odstraněn ze seznamu účastníků, z výsledkové tabulky i ze všech zápasů, které odehrál. Toto je destruktivní akce, kterou nelze vrátit zpět.</p>
                            <button onClick={handleHardDeletePlayerFormSubmit} disabled={isOngoingRequest}>Odstranit</button>
                            <button onClick={closeDeletePlayerDialog} disabled={isOngoingRequest}>Zrušit</button>
                        </ModalDialog> :
                        <ModalDialog onClose={closeDeletePlayerDialog}>
                            <img src={closingX} alt="dialog-closing-x-icon" onClick={closeDeletePlayerDialog}/>
                            {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                            <h2>Vyber jednu z možností</h2>
                            <label>
                                <input type="radio" name="deletionType" value="soft" onChange={handleDeletePlayerFormDataChange} checked={deletePlayerFormData.deletionType === "soft"} disabled={isOngoingRequest} />
                                Nezahrnovat hráče/tým do losování nadcházejících kol
                            </label>
                            <p>Hráč/tým odešel z turnaje předčasně a dalších kol se už nezúčastní. Bude však ponechán v seznamu účastníků, ve výsledkové tabulce i ve všech zápasech, které stihl odehrát, a neztratí své získané skóre a pomocné hodnocení. Hráče/tým lze do turnaje kdykoli v průběhu vrátit, pokud vynechá jen některá kola.</p>
                            <label>
                                <input type="radio" name="deletionType" value="hard" onChange={handleDeletePlayerFormDataChange} checked={deletePlayerFormData.deletionType === "hard"} disabled={isOngoingRequest} />
                                Úplně odstranit hráče/tým z turnaje
                            </label>
                            <p>Hráč/tým byl diskvalifikován a bude odstraněn ze seznamu účastníků, z výsledkové tabulky i ze všech zápasů, které odehrál. Toto je destruktivní akce, kterou nelze vrátit zpět.</p>
                            <button onClick={deletePlayerFormData.deletionType === "hard" ? handleHardDeletePlayerFormSubmit : handleSoftDeletePlayerFormSubmit} disabled={!deletePlayerFormData.deletionType || isOngoingRequest}>Potvrdit</button>
                            <button onClick={closeDeletePlayerDialog} disabled={isOngoingRequest}>Zrušit</button>
                        </ModalDialog>
                    )
                )
            }
            {selectedReactivatePlayerId !== undefined &&
                <ModalDialog onClose={closeReactivatePlayerDialog}>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeReactivatePlayerDialog}/>
                    {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                    <h2>Vrátit hráče/tým do turnaje?</h2>
                    <p>Hráč/tým bude opět zahrnut do losování a zúčastní se nadcházejících  kol turnaje. Již nalosovaná kola, kterých se hráč/tým nezúčastnil, to nijak neovlivní.</p>
                    <button onClick={handleReactivatePlayerFormSubmit} disabled={isOngoingRequest}>Znovuaktivovat</button>
                    <button onClick={closeReactivatePlayerDialog} disabled={isOngoingRequest}>Zrušit</button>
                </ModalDialog>
            }
            <section>
                <h1>{tournamentData.tournament.name} - Účastníci</h1>
                {tournamentData.players && tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' && selectedChangePlayerNameId === undefined &&
                    <>
                        <button onClick={handleAddPlayerClick} disabled={isOngoingRequest || tournamentData.players.length >= 200}>Přidat hráče nebo tým</button>
                        {tournamentData.players.length >= 200 && <p>(turnaj může hrát maximálně 200 hráčů nebo týmů)</p>}
                    </>
                }
                {tournamentData.players && tournamentData.players.length > 0 &&
                    <>
                        {tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' &&
                            (selectedChangePlayerNameId === undefined ?
                                <p>Dvojitým poklepáním na hráče/tým změň jeho jméno.</p> :
                                <button disabled={!changePlayerNameFormData.playerName || isOngoingRequest}>Uložit změny</button>
                            )
                        }
                        <ol>
                            {tournamentData.players.map(player => (
                                <li key={player.id}>
                                    {parseInt(player.id) !== selectedChangePlayerNameId ?
                                        <span style={{ textDecoration: player.excluded === "0" ? 'none' : 'line-through' }} onDoubleClick={handleChangePlayerNameDoubleClick} data-player-id={player.id} data-player-name={player.name}>{player.name}</span> :
                                        <input
                                            type="text"
                                            placeholder={player.name}
                                            onChange={handleChangePlayerNameFormDataChange}
                                            name="playerName"
                                            value={changePlayerNameFormData.playerName}
                                            maxLength="50"
                                            disabled={isOngoingRequest}
                                            onBlur={handleChangePlayerNameFormSubmit}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    handleChangePlayerNameFormSubmit(event)
                                                } else if (event.key === 'Escape' || event.key === 'Esc') {
                                                    deselectChangePlayerNameId()
                                                }
                                            }}
                                            autoFocus
                                            data-player-prev-name={player.name}
                                        />
                                    }
                                    <small> #{player.id}</small>
                                    {tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' &&
                                        <>
                                            {player.excluded === "1" &&
                                                <button onClick={handleReactivatePlayerClick} disabled={isOngoingRequest || selectedChangePlayerNameId !== undefined} data-player-id={player.id}>️<img src={playerReactivateIcon} alt="player-reactivate-icon" data-player-id={player.id}/></button>
                                            }
                                            <button onClick={handleDeletePlayerClick} disabled={isOngoingRequest || selectedChangePlayerNameId !== undefined} data-player-id={player.id}>🗑️</button>
                                        </>
                                    }
                                </li>
                            ))}
                        </ol>
                    </>
                }
                {tournamentData.players && tournamentData.players.length === 0 &&
                    (tournamentData.tournament.status === 'ended' ?
                        <p>Turnaje se nikdo nezúčastnil.</p> :
                        (tournamentData.hasTournamentWriteAccess ?
                            <>
                                <p>Seznam účastníků je zatím prázdný. Přidej prvního hráče! 🙂</p>
                                <p>Pokud hrají jednotlivci, můžeš vložit jméno nebo přezdívku tohoto hráče. Pokud hrají týmy, můžeš vložit název týmu.</p>
                                <p>Chtěl(a) bys hráčům/týmům umožnit registrace? Nezapomeň turnaj <Link to={"/tournament/" + tournamentData.tournament.id + "/settings"}>zveřejnit</Link> a do popisu <Link to={"/tournament/" + tournamentData.tournament.id + "/settings"}>vložit kontakt na tebe nebo odkaz vedoucí na tvůj externí kalendář akcí</Link>. Pokud jsi programátor, (nejen) pro automatizované přidávání hráčů svou externí aplikací můžeš použít <a href="https://github.com/sedmima20/Tournament-Web-Organizer/wiki/Dokumentace-k-ve%C5%99ejn%C3%A9mu-API-turnajov%C3%A9ho-softwaru-Tournament-Web-Organizer" target="_blank" title="Dokumentace k veřejnému API turnajového softwaru Tournament Web-Organizer">naše API</a>.</p>
                            </> :
                            <p>Seznam účastníků je zatím prázdný. Počkej na organizátora, určitě ho dá dohromady 🙂</p>
                        )
                    )
                }
                {tournamentData.players && tournamentData.tournament.status === 'preparation' && !tournamentData.hasTournamentWriteAccess && tournamentData.tournament.description &&
                    <p>Možná se do turnaje lze přihlásit. <Link to={"/tournament/" + tournamentData.tournament.id}>Koukni do popisu</Link>, jestli tam organizátor nenechal nějaké další informace.</p>
                }
                {tournamentData.players && tournamentData.players.length >= 5 && tournamentData.tournament.status === 'preparation' && tournamentData.hasTournamentWriteAccess && selectedChangePlayerNameId === undefined &&
                    <p>Potřebuješ <Link to={"/tournament/" + tournamentData.tournament.id + "/settings"}>smazat všechny účastníky</Link> a začít znovu?</p>
                }
                {!tournamentData.players &&
                    <div className="error-box">Účastníky se nepodařilo načíst</div>
                }
            </section>
        </>
    )
}
