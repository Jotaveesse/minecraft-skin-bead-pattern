import type { CSSProperties } from "react";
import "../styles/MinecraftUI.css";

interface MinecraftButtonProps {
    text: string;
    onClick?: () => void;
    color?: string;
    disabled?: boolean;
}

const MinecraftButton = ({
    text,
    onClick,
    color,
    disabled,
}: MinecraftButtonProps) => {
    const style: CSSProperties | undefined = color
        ? { backgroundColor: color }
        : undefined;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={color ? "mc-button mc-button--custom" : "mc-button"}
        >
            {text}
        </button>
    );
};

export default MinecraftButton;
