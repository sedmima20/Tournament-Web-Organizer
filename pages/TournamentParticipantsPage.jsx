import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import ModalDialog from '/components/ModalDialog.jsx'
import closingX from '/images/closing-x.png'

export default function TournamentParticipantsPage({ tournamentData, triggerTournamentReload }) {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const [dialogAlertContent, setDialogAlertContent] = useState(undefined)
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false)
    const [addPlayerFormData, setAddPlayerFormData] = useState({playerName: ""})
    const addPlayerRequest = useTwoApiRequest()

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
                        setAlertContent({ msg: 'Hráč byl přidán 👍', severity: 'info' })
                        closeAddPlayerDialog()
                        triggerTournamentReload()
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, hráče se nám nepodařilo přidat.', severity: 'error' })
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
            <section>
                <h1>{tournamentData.tournament.name} - Účastníci</h1>
                {tournamentData.players && tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' &&
                    <>
                        <button onClick={handleAddPlayerClick} disabled={isOngoingRequest || tournamentData.players.length >= 200}>Přidat hráče nebo tým</button>
                        {tournamentData.players.length >= 200 && <p>(turnaj může hrát maximálně 200 hráčů nebo týmů)</p>}
                    </>
                }
                {tournamentData.players && tournamentData.players.length > 0 &&
                    <>
                        {tournamentData.hasTournamentWriteAccess && tournamentData.tournament.status !== 'ended' &&
                            <p>Dvojitým poklepáním na hráče/tým změň jeho jméno.</p>
                        }
                        <ol>
                            {tournamentData.players.map(player => (
                                <li key={player.id}>
                                    <span style={{ textDecoration: player.excluded === "0" ? 'none' : 'line-through' }}>{player.name}</span>
                                    <span> #{player.id}</span>
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
                {!tournamentData.players &&
                    <div className="error-box">Účastníky se nepodařilo načíst</div>
                }
            </section>
        </>
    )
}
