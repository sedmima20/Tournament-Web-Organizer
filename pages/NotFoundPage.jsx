import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
    const navigate = useNavigate()

    function handleHomeClick() {
        navigate('/')
    }

    return (
        <>
            <section>
                <h1>404 Not Found - Stránka nebyla nalezena</h1>
                <p>Je možné, že byla přesunuta nebo odstraněna. Zkontrolujte, zda nemáte překlep v URL.</p>
                <button onClick={handleHomeClick}>Přejít na domovskou stránku Tournament Web-Organizera</button>
            </section>
        </>
    )
}
