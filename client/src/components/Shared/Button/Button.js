import './Button.scss';

function Button(props) {
    let buttonClasses;

    switch (props.buttonType) {
        case 'Primary':
            buttonClasses = 'button-base button-primary';
            break;

        case 'Secondary':
            buttonClasses = 'button-base button-secondary';
            break;

        case 'Error':
            buttonClasses = 'button-base button-error';
            break;

        default:
            buttonClasses = 'button-base button-primary';
    }

    if (props.buttonMarginTop) {
        buttonClasses += ' button-margin-top';
    }

    if (props.buttonMarginLeft) {
        buttonClasses += ' button-margin-left';
    }

    if (props.buttonMarginRight) {
        buttonClasses += ' button-margin-right';
    }

    return (
        <button className={buttonClasses} type='button' onClick={props.clickFunction}>{props.buttonText}</button>
    );
}

export default Button;