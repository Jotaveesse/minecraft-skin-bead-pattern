interface ButtonProps {
    text: string;
    onClick?: () => void;
    color?: string;
}

const Button = ({ text, onClick, color }: ButtonProps) => {
    return (
        <button
            type="button"
            className={`btn ${color ? `btn-${color}` : "btn-primary"} px-4 fs-4`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
