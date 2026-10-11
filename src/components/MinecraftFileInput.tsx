import "../styles/MinecraftUI.css";
import uploadIcon from "../assets/upload-icon.svg";

interface FileInputProps {
    message: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

function FileInput({ message, onChange, style }: FileInputProps) {
    return (
        <div style={style}>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={onChange}
                style={{ display: "none" }}
            ></input>

            <label
                htmlFor="file-upload"
                className="mc-button d-flex w-100 h-100 justify-content-center align-items-center flex-column gap-3"
                style={{ "--mc-px": "3px" } as React.CSSProperties}
            >
                <img src={uploadIcon}></img>
                <span style={{ fontSize: "2.5rem" }}>{message}</span>
            </label>
        </div>
    );
}

export default FileInput;
