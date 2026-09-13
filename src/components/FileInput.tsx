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
                className="btn btn-dark text-light d-flex w-100 h-100 justify-content-center align-items-center flex-column p-4"
            >
                <i className="bi bi-upload" style={{ fontSize: "5rem" }}></i>
                <span style={{ fontSize: "2.5rem" }}>{message}</span>
            </label>
        </div>
    );
}

export default FileInput;
