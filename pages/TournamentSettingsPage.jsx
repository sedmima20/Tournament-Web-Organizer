import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import ModalDialog from '/components/ModalDialog.jsx'
import closingX from '/images/closing-x.png'

export default function TournamentSettingsPage({ tournamentData, triggerTournamentReload }) {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)
    const [dialogAlertContent, setDialogAlertContent] = useState(undefined)
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const [isNumberOfRoundsHelpDialogOpen, setIsNumberOfRoundsHelpDialogOpen] = useState(false)
    const [isTournamentFormatInfoDialogOpen, setIsTournamentFormatInfoDialogOpen] = useState(false)
    const [isWipeAllPlayersDialogOpen, setIsWipeAllPlayersDialogOpen] = useState(false)
    const [isDeleteTournamentDialogOpen, setIsDeleteTournamentDialogOpen] = useState(false)
    const [deleteTournamentFormData, setDeleteTournamentFormData] = useState({tournamentName: ""})
    const navigate = useNavigate()
    const changeNumberOfRoundsRequest = useTwoApiRequest()
    const changeTournamentVisibilityRequest = useTwoApiRequest()
    const wipeAllPlayersRequest = useTwoApiRequest()
    const deleteTournamentRequest = useTwoApiRequest()

    function handleTournamentFormatInfoClick() {
        setIsTournamentFormatInfoDialogOpen(true)
    }

    function closeTournamentFormatInfoDialog() {
        setIsTournamentFormatInfoDialogOpen(false)
    }

    function handleChangeNumberOfRoundsFormSubmit(event) {
        if (event.target.name === 'numberOfRounds' && parseInt(event.target.value) >= parseInt(tournamentData.tournament.current_round || 1) && parseInt(event.target.value) <= 30 && event.target.value !== tournamentData.tournament.rounds && !isOngoingRequest) {
            setIsOngoingRequest(true)
            changeNumberOfRoundsRequest.fetchData({
                endpoint: 'update_tournament',
                tournament_id: tournamentData.tournament.id,
                new_rounds: event.target.value,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        setAlertContent({ msg: 'Počet kol nastaven 👍', severity: 'info' })
                        triggerTournamentReload()
                    } else {
                        setAlertContent({ msg: 'Něco se pokazilo, počet kol se nám nepodařilo nastavit.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function handleNumberOfRoundsHelpClick() {
        setIsNumberOfRoundsHelpDialogOpen(true)
    }

    function closeNumberOfRoundsHelpDialog() {
        setIsNumberOfRoundsHelpDialogOpen(false)
    }

    function handleChangeTournamentVisibilityFormSubmit(event) {
        if (event.target.name === 'visibility' && tournamentData.tournament.visibility !== event.target.value && !isOngoingRequest) {
            setIsOngoingRequest(true)
            changeTournamentVisibilityRequest.fetchData({
                endpoint: 'update_tournament',
                tournament_id: tournamentData.tournament.id,
                new_visibility: event.target.value,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        if (event.target.value === 'public') {
                            setAlertContent({ msg: 'Turnaj je nyní veřejně viditelný 👍', severity: 'info' })
                        } else {
                            setAlertContent({ msg: 'Turnaj je nyní soukromý 👍', severity: 'info' })
                        }
                        triggerTournamentReload()
                    } else {
                        if (event.target.value === 'public') {
                            setAlertContent({ msg: 'Něco se pokazilo, turnaj se nám nepodařilo zveřejnit.', severity: 'error' })
                        } else {
                            setAlertContent({ msg: 'Něco se pokazilo, turnaj se nám nepodařilo skrýt.', severity: 'error' })
                        }
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function handleWipeAllPlayersClick() {
        setIsWipeAllPlayersDialogOpen(true)
    }

    function handleWipeAllPlayersFormSubmit() {
        if (!isOngoingRequest) {
            setIsOngoingRequest(true)
            wipeAllPlayersRequest.fetchData({
                endpoint: 'wipe_all_players',
                tournament_id: tournamentData.tournament.id,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        setAlertContent({ msg: 'Seznam účastníků je nyní prázdný 👍', severity: 'info' })
                        closeWipeAllPlayersDialog()
                        triggerTournamentReload()
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, hráče/týmy se nám nepodařilo smazat.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function closeWipeAllPlayersDialog() {
        setIsWipeAllPlayersDialogOpen(false)
        setDialogAlertContent(undefined)
    }

    function handleDeleteTournamentClick() {
        setIsDeleteTournamentDialogOpen(true)
    }

    function handleDeleteTournamentFormDataChange(event) {
        setDeleteTournamentFormData(prevDeleteTournamentFormData => {
            return {
                ...prevDeleteTournamentFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleDeleteTournamentFormSubmit() {
        if (deleteTournamentFormData.tournamentName === tournamentData.tournament.name && !isOngoingRequest) {
            setIsOngoingRequest(true)
            deleteTournamentRequest.fetchData({
                endpoint: 'delete_tournament',
                tournament_id: tournamentData.tournament.id,
                token: token
            })
                .then((data) => {
                    if (data.statusCode === 204) {
                        setAlertContent({ msg: 'Turnaj byl odstraněn 👍', severity: 'info' })
                        closeDeleteTournamentDialog()
                        navigate(loggedUserData ? "/tournaments/" + loggedUserData.username : "/tournaments")
                    } else {
                        setDialogAlertContent({ msg: 'Něco se pokazilo, turnaj se nám nepodařilo odstranit.', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    function closeDeleteTournamentDialog() {
        setIsDeleteTournamentDialogOpen(false)
        setDeleteTournamentFormData({tournamentName: ""})
        setDialogAlertContent(undefined)
    }

    return (
        <>
            {isTournamentFormatInfoDialogOpen &&
                <ModalDialog onClose={closeTournamentFormatInfoDialog}>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeTournamentFormatInfoDialog}/>
                    <h2>Turnajové formáty</h2>
                    <h3>Zjednodušený švýcarský systém / Monrad</h3>
                    <p>Švýcarský systém je turnajový formát, ve kterém je počet kol turnaje stanoven předem a kde se proti sobě v každém kole utkávají hráči/týmy pokud možno stejné nebo podobné kvality. Algoritmus dle předem nastavených pravidel vytváří pro každé kolo dvojice hráčů/týmů, v rámci kterých pak (většinou paralelně) probíhají jednotlivé zápasy/utkání. Jeden zápas je vždy záležitost dvou hráčů/týmů, ne více, takže hráči/týmy proti sobě vždy hrají 1v1. Všichni hráči/týmy hrají až do konce turnaje a nikdo v průběhu nevypadává, pokud prohraje některé kolo (na rozdíl od vyřazovacího formátu "pavouk"). Dva hráči/týmy spolu mohou hrát v jednom turnaji pouze jednou, nemohou se setkat dvakrát ve dvou různých kolech.</p>
                    <p>Párování podobně silných/kvalitních hráčů/týmů probíhá především na základě výsledků z předchozích kol toho samého turnaje (průběžné pořadí). Před nalosováním následujícího kola jsou hráči/týmy nejprve rozděleni do skupin, v rámci kterých mají všichni stejné skóre (případně i stejné pomocné hodnocení), a poté jsou v jednotlivých skupinách seřazeni buď na základě pořadí účastníků na startovní listině / v seznamu účastníků (pro startovní listinu lze použít třeba nějaký rating systém, například FIDE ELO v šachu), nebo náhodně, pokud žádný rating není k dispozici (systém ligových turnajů dané hry rating nepoužívá, nebo se hraje neoficiální neligový turnaj, apod) a/nebo pokud ho turnajový software nepodporuje. Ve standardním švýcarském systému jsou poté vzniklé sežazené skupiny rozpůleny a první hráč/tým z první půlky je spárován s prvním hráčem/týmem z druhé půlky, druhý s druhým, atd, s případným provedením takových úprav, aby byla dodržena všechna další pravidla (dva hráči/týmy spolu mohou hrát v jednou turnaji jen jednou, apod).</p>
                    <p>Alternativním párovacím algoritmem, který používá Tournament Web-Organizer, je zjednodušený švýcarský systém, který kombinuje prvky švýcarského systému a prvky turnajového formátu Monrad. Hráči/týmy zde nejsou děleni do skupin. Místo toho jsou zde všichni před nalosováním každého kola seřazeni sestupně jako jeden celek a software se poté pokouší spárovat prvního s druhým, třetího s čtvrtým, atd, přičemž kontroluje, zda jsou dodržována všechna ostatní pravidla, a dělá nezbytné úpravy. Seřazní hráčů/týmů proběhne prioritně dle základního skóre hráčů/týmů a poté postupně podle všech úrovní pomocných hodnocení, pokud dojde ke shodnému počtu některých bodů. V případě, že má dva nebo více hráčů/týmů stejné skóre a zároveň stejný počet všech pomocných bodů na všech úrovních, tito hráči/týmy jsou seřazeni, respektive zamícháni, náhodně. Před prvním kolem jsou všichni účastníci zamícháni dohromady a spárováni úplně náhodně, protože všichni mají stejné skóre i stejný počet všech pomocných bodů. Tournament Web-Organizer nijak nezohledňuje pořadí hráčů/týmů v seznamu účastníků (ve startovací listině) nebo jakýkoli rating systém. Všichni hráči/týmy jsou si na začátku turnaje kvalitou rovni, z pohledu párovacího algoritmu. Tournament Web-Organizer také ve svém zjednodušeném algoritmu nepřikládá žádný význam tomu, zda je hráč/tým v rozpisu kola umístěný nalevo nebo napravo a kolikrát, narozdíl od standardního švýcarského systému, který toto zpravidla zohledňuje (určení, kdo hraje s bílými a kdo s černými kameny v šachu, apod).</p>
                    <p>Konečné pořadí hráčů/týmů je na konci turnaje určeno celkovým počtem získaných základních bodů (základního skóre). Hráč/tým za výhru jednoho zápasu v jednom kole získá jeden bod, za remízu půl bodu a za prohru nula bodů. V případě, že dva nebo více hráčů/týmů bude mít po odehrání všech kol stejné skóre, použije se pro určení konečného pořadí pomocné hodnocení. Hráči/týmy v průběhu hraní turnaje získávají kromě základního skóre i tzv. "zápasové body". V případě, že to hra/sport umožňuje, mohou si hráči/týmy v každém kole dát odvetu a odehrát více než jednu hru. Organizátor poté do výsledků může bez problémů zadat složitější výsledek, například 2-0 nebo 2-1, nejen 1-0, 0-1 nebo 1-1. Pokud proti sobě hrají týmy a hraje se například více partií na více stolech, výsledek je také možné odvodit třeba z počtů vyhraných partií na každé straně, nebo jakýmkoli jiným podobným systémem. Čísla na obou stranách jsou zápasové body, a celkový počet všech zápasových bodů, které hráč/tým za všechna kola získal, je rozhodující v případě, že nerozhodne základní skóre. Pokud nerozhodnou ani zápasové body, je rozhodující součet základních bodů všech soupeřů (Buchholz) daného hráče/týmu, a úplně nakonec se použije součet zápasových bodů všech soupeřů, pokud stále nebylo rozhodnuto. Pokud není rozhodnuto ani po této poslední úrovni, je dvěma nebo více hráčům/týmům přiznáno stejné umístění (například dvě první místa).</p>
                    <p>V případě, že je v turnaji v některém kole lichý počet hráčů/týmů, jeden z hráčů/týmů (zpravidla ten s nejnižším skóre nejníže v seznamu) se stane přebývajícím hráčem/týmem, který má v daném kole volno (proti nikomu nehraje) a získá jeden bod (základní skóre) zdarma. Hráč/tým, který má volno, nezíská v daném kole žádné pomocné hodnocení. Každý hráč/tým může mít v jednom turnaji volno pouze jednou, ne vícekrát.</p>
                    <p>Pro algoritmus švýcarského systému i pro jeho zjednodušenou verzi je zpravidla přijatelné, aby sem tam některý hráč/tým předčasně odešel z turnaje nebo přišel pozdě do turnaje. Tournament Web-Organizer podporuje přidávání i odebírání hráčů/týmů v průběhu turnaje. Je však doporučována opatrnost, obzvlášť při malém počtu hráčů, protože párovací algoritmus může oznámit chybu v případě, že dle stanovených pravidel už nebude možné vytvořit rozpis párů/zápasů na další kolo, kvůli nedostatku hráčů/týmů. Počet hráčů/týmů by vždy měl zhruba odpovídat doporučovanému počtu kol, viz nápověda v sekci nastavení počtu kol turnaje.</p>
                    <p>Tournament Web-Organizer podporuje změnu počtu kol i v průběhu turnaje, nejen před jeho začátkem, nicméně by toto v průběhu turnaje mělo být používáno pouze pro zvláštní situace, kdy například omylem došlo k zadání špatného počtu kol nebo kdy musel být turnaj z výjimečných důvodů předčasně ukončen.</p>
                    <p>Tournament Web-Organizer by neměl být používán pro oficiální šachové turnaje hrané podle "Pravidel FIDE pro švýcarský systém", protože těmto pravidlům zatím nevyhovuje. Je však možné ho používat pro ligové turnaje v jakékoli jiné hře nebo v jakémkoli jiném sportu, které(mu) vyhovovat bude, a také je možné ho bez jakýchkoli omezení používat pro jakoukoli hru v případě, že se jedná o neligový a neoficiální turnaj, včetně hry v šachy.</p>
                    <h3>Každý s každým (round-robin)</h3>
                    <p>Každý s každým je jedním z nejspravedlivějších turnajových formátů, které existují. V turnaji, který je hraný ve formátu každý s každým, si každý hráč/tým zahraje s každým hráčem/týmem jednou (nebo dvakrát, ale to Tournament Web-Organizer zatím nepodporuje). Tento turnajový formát je zpravidla časově náročnější než turnaje hrané švýcarským systémem, ale může být vhodnější především pro menší skupiny hráčů.</p>
                    <p>Tournament Web-Organizer zatím nemá přímo odlišný párovací algoritmus pro turnajový formát každý s každým, avšak při zadání správného počtu kol na správný počet hráčů/týmů bude po použití párovacího algoritmu zjednodušeného švýcarského systému výsledný rozpis tomuto formátu odpovídat, jakmile budou nalosována všechna kola.</p>
                    <p>Počet kol musí v tomto turnajovém formátu striktně odpovídat správnému počtu hráčů/týmů, aby nedocházelo k chybám algoritmu, viz nápověda v sekci nastavení počtu kol turnaje. Hrát je možné jak v sudém, tak v lichém počtu hráčů/týmů. Narozdíl od zjednodušeného švýcarského systému jsou zde však jinak řešené pozdní příchody i brzké odchody hráčů/týmů. Pokud některý hráč/tým přijde pozdě nebo odejde předčasně a vynechá některá kola, z turnaje ho doporučujeme nevyškrtnout a místo toho na něj jenom nahlížet tak, jako kdyby všechna kola, která vynechal, prohrál.</p>
                    <button onClick={closeTournamentFormatInfoDialog}>Rozumím 👍</button>
                </ModalDialog>
            }
            {isNumberOfRoundsHelpDialogOpen &&
                <ModalDialog onClose={closeNumberOfRoundsHelpDialog}>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeNumberOfRoundsHelpDialog}/>
                    <h2>Doporučený počet kol</h2>
                    <h3>Zjednodušený švýcarský systém / Monrad</h3>
                    <ul>
                        <li>1 až 6 hráčů - švýcarský systém nedoporučujeme</li>
                        <li>7 až 8 hráčů - 3 kola</li>
                        <li>9 až 16 hráčů - 4 kola</li>
                        <li>17 až 32 hráčů - 5 kol</li>
                        <li>33 až 64 hráčů - 6 kol</li>
                        <li>65 až 128 hráčů - 7 kol</li>
                    </ul>
                    <h3>Každý s každým (round-robin)</h3>
                    <ul>
                        <li>1 až 2 hráči - 1 kolo</li>
                        <li>3 až 4 hráči - 3 kola</li>
                        <li>5 až 6 hráčů - 5 kol</li>
                        <li>7 až 8 hráčů - 7 kol</li>
                        <li>9 až 10 hráčů - 9 kol</li>
                        <li>Atd...</li>
                    </ul>
                    <button onClick={closeNumberOfRoundsHelpDialog}>Rozumím 👍</button>
                </ModalDialog>
            }
            {isWipeAllPlayersDialogOpen &&
                <ModalDialog onClose={closeWipeAllPlayersDialog}>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeWipeAllPlayersDialog}/>
                    {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                    <h2>Smazat všechny hráče/týmy ze seznamu účastníků?</h2>
                    <p>Tuto akci nelze vrátit zpět! Všechny účastníky, kteří budou hrát turnaj, budeš muset znovu vložit po jednom.</p>
                    <button onClick={handleWipeAllPlayersFormSubmit} disabled={isOngoingRequest}>Smazat</button>
                    <button onClick={closeWipeAllPlayersDialog} disabled={isOngoingRequest}>Zrušit</button>
                </ModalDialog>
            }
            {isDeleteTournamentDialogOpen &&
                <ModalDialog onClose={closeDeleteTournamentDialog}>
                    <img src={closingX} alt="dialog-closing-x-icon" onClick={closeDeleteTournamentDialog}/>
                    {dialogAlertContent && <div className={dialogAlertContent.severity + "-box"}>{dialogAlertContent.msg}</div>}
                    <h2>Odstranit turnaj?</h2>
                    <p>Tuto akci nelze vrátit zpět! Pro jistotu opiš jméno turnaje:</p>
                    <input
                        type="text"
                        onChange={handleDeleteTournamentFormDataChange}
                        name="tournamentName"
                        value={deleteTournamentFormData.tournamentName}
                        maxLength="100"
                        disabled={isOngoingRequest}
                    />
                    <button onClick={handleDeleteTournamentFormSubmit} disabled={deleteTournamentFormData.tournamentName !== tournamentData.tournament.name || isOngoingRequest}>Vím, co dělám. Odstranit turnaj 🗑️</button>
                    <button onClick={closeDeleteTournamentDialog} disabled={isOngoingRequest}>Zrušit</button>
                </ModalDialog>
            }
            {tournamentData.tournament.status === 'ended' &&
                <div className="warning-box">Turnaj je ukončený a většina nastavení již není k dispozici. Pokud bys rád(a) něco přenastavil(a), <Link to={"/tournament/" + tournamentData.tournament.id}>znovuotevři ho</Link>.</div>
            }
            <section>
                <h1>{tournamentData.tournament.name} - Nastavení</h1>
                {!tournamentData.hasTournamentWriteAccess &&
                    <div className="error-box">Nemáš oprávnění ke správě tohoto turnaje 🚫</div>
                }
            </section>
            {tournamentData.hasTournamentWriteAccess &&
                <>
                    {tournamentData.tournament.status !== 'ended' &&
                        <>
                            <section>
                                <h2>Název a popis</h2>
                            </section>
                            <section>
                                <h2>Formát turnaje</h2>
                                <select name="tournamentFormat" value="simplified-swiss" disabled>
                                    <option value="simplified-swiss">Zjednodušený švýcarský systém / Monrad / každý s každým</option>
                                </select>
                                <a onClick={handleTournamentFormatInfoClick}>Více informací</a>
                                <p>(další turnajové formáty budou přidány v budoucnu)</p>
                            </section>
                            <section>
                                <h2>Počet kol turnaje</h2>
                                <select name="numberOfRounds" value={tournamentData.tournament.rounds} onChange={handleChangeNumberOfRoundsFormSubmit} disabled={isOngoingRequest || parseInt(tournamentData.tournament.current_round || 0) >= 30}>
                                    {Array.from({ length: 30 }, (_, i) => i + 1)
                                        .filter(round => round >= parseInt(tournamentData.tournament.current_round || 0))
                                        .map(round => (
                                            <option key={round} value={round}>{round}</option>
                                        ))}
                                </select>
                                {parseInt(tournamentData.tournament.current_round || 0) > 1 &&
                                    <p>(nelze nastavit počet kol, který je nižší než číslo aktuálního kola)</p>
                                }
                                <a onClick={handleNumberOfRoundsHelpClick}>Potřebuješ poradit?</a>
                            </section>
                            <section>
                                <h2>Viditelnost</h2>
                                {loggedUserData && loggedUserData.username === tournamentData.tournament.owner_username &&
                                    (tournamentData.tournament.visibility === 'private' ?
                                        <>
                                            <p>🔒 Turnaj je soukromý. Nikdo kromě tebe (a případně administrátorů systému) si ho nemůže zobrazit. Turnaj se nemůže objevit na <Link to="/tournaments">stránce nejnovějších veřejných turnajů</Link>. K nástěnce, rozpisům, průběžnému/konečnému pořadí a k seznamu hráčů/týmů se účastníci tvého turnaje dostanou pouze tehdy, když jim ukážeš screenshoty, promítneš obrazovku nebo vše vytiskneš.</p>
                                            <p>Pokud bys účastníkům rád(a) poslal(a) odkaz na nástěnku, kde mohou sami sledovat průběh turnaje live, přepni turnaj na veřejně viditelný.</p>
                                        </> :
                                        <>
                                            <p>👁️ Turnaj je veřejně viditelný. Kdokoliv, kdo zná <Link to={"/tournament/" + tournamentData.tournament.id}>odkaz</Link>, si ho může zobrazit a sledovat jeho průběh live. Turnaj se také může objevit na <Link to="/tournaments">stránce nejnovějších veřejných turnajů</Link>. Spravovat turnaj smíš stále jenom ty (a případně administrátoři systému), nikdo jiný.</p>
                                            <p>Pokud už nechceš, aby byl turnaj dohledatelný a aby ho účastníci a další lidé mohli sledovat, přepni ho na soukromý.</p>
                                        </>
                                    )
                                }
                                <label>
                                    <input type="radio" name="visibility" value="public" onChange={handleChangeTournamentVisibilityFormSubmit} checked={tournamentData.tournament.visibility === 'public'} disabled={isOngoingRequest} />
                                    Veřejně viditelný turnaj
                                </label>
                                <label>
                                    <input type="radio" name="visibility" value="private" onChange={handleChangeTournamentVisibilityFormSubmit} checked={tournamentData.tournament.visibility === 'private'} disabled={isOngoingRequest} />
                                    Soukromý turnaj
                                </label>
                            </section>
                        </>
                    }
                    <section>
                        <h2>Nebezpečná zóna</h2>
                        {tournamentData.tournament.status === 'preparation' && tournamentData.players &&
                            <>
                                <button onClick={handleWipeAllPlayersClick} disabled={isOngoingRequest || tournamentData.players.length === 0}>Smazat všechny hráče/týmy</button>
                                {tournamentData.players.length === 0 &&
                                    <p>(seznam účastníků je prázdný)</p>
                                }
                            </>
                        }
                        <button onClick={handleDeleteTournamentClick} disabled={isOngoingRequest}>Odstranit turnaj</button>
                    </section>
                </>
            }
        </>
    )
}
