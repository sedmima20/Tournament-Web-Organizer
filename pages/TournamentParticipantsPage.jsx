import React from 'react'
import { Link } from 'react-router-dom'

export default function TournamentParticipantsPage({ tournamentData, triggerTournamentReload }) {
    return (
        <>
            <section>
                <h1>{tournamentData.tournament.name} - Účastníci</h1>
                {tournamentData.players && tournamentData.players.length > 0 &&
                    <p>Seznam účastníků ------- placeholder</p>
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
