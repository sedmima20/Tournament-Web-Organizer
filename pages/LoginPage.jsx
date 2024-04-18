import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
    return (
        <>
            <section>
                <h1>Přihlášení</h1>
                <p>Vítej zpět!</p>
                <p>Lorem ipsum</p>
                <p>Ještě nemáš účet? Neváhej, <Link to="/signup">zaregistruj se</Link> a připoj se k ostatním organizátorům, kteří používají TWO.</p>
            </section>
        </>
    )
}
