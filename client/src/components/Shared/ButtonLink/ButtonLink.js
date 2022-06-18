import './ButtonLink.scss';
import { Link } from 'react-router-dom';

function Button(props) {
    let buttonClasses;

    switch (props.buttonType) {
        case 'Primary':
            buttonClasses = 'link-button link-button-primary';
            break;

        case 'Secondary':
            buttonClasses = 'link-button link-button-secondary';
            break;

        case 'Link':
            buttonClasses = 'link-plain';
            break;

        default:
            buttonClasses = 'link-plain';
    }

    if (props.buttonMarginTop) {
        buttonClasses += ' link-margin-top';
    }

    if (props.buttonMarginLeft) {
        buttonClasses += ' link-margin-left';
    }

    return (
        <Link className={buttonClasses} to={props.buttonLink}>{props.buttonText}</Link>
    );
}

export default Button;