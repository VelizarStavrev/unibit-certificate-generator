import './Contacts.css';

function Contacts() {
    return (
        <div className='contacts-container'>
            <form>
                <h1>CONTACT</h1>

                <label>E-mail</label>
                <input type='text' name='email' />
                <p className='contacts-error'>Invalid e-mail!</p>

                <label>Names</label>
                <input type='text' name='names' />
                <p className='contacts-error'>Invalid names!</p>

                <label>Message</label>
                <textarea name='message' />
                <p className='contacts-error'>Invalid message!</p>

                <button className='contacts-button' type='button'>Send</button>
            </form>

            <div className='contacts-text'>
                <p>Feel free to contact us if you have any questions, if issues occur or if you have any suggestions to make our service better.</p>
                <p>You can use the provided contact form or you can use the contact data below:</p>
                <p>E-mail: example@email.com</p>
                <p>Phone: +359 XXX XX XX XX</p>
                <p>Linkedin: linkedin.com/example</p>
            </div>
        </div>
    );
}

export default Contacts;