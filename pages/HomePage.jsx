import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const navigate = useNavigate()

    function handleSignupClick() {
        navigate('/signup')
    }

    return (
        <>
            <section>
                <h1>Tournament Web-Organizer se představuje</h1>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
            </section>
            <section>
                <h2>Jak to funguje?</h2>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
            </section>
            <section>
                <h2>Features</h2>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
            </section>
            <section>
                <h2>Lorem ipsum</h2>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
            </section>
            <section>
                <h2>Lorem ipsum</h2>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
            </section>
            <section>
                <h2>Lorem ipsum</h2>
                <button onClick={handleSignupClick}>Vytvořit organizátorský účet</button>
            </section>
        </>
    )
}
