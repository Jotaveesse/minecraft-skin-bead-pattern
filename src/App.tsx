import { useRef, useState } from "react";
import { INPUT_H, INPUT_W, OUTPUT_H, OUTPUT_W, lookup } from "./Mappings";
import FileInput from "./components/FileInput";
import Button from "./components/Button";

function App() {
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            if (img.width !== INPUT_W || img.height !== INPUT_H) {
                alert(
                    `A imagem deve ter exatamente ${INPUT_W}x${INPUT_H} pixels.`,
                );
                setImageFile(null);
                return;
            }

            setImageFile(file);

            const outCanvas = outputCanvasRef.current;
            if (!outCanvas) return;
            const outCtx = outCanvas.getContext("2d");
            if (!outCtx) return;

            // 1. Create hidden in-memory canvas for the INPUT
            const inCanvas = document.createElement("canvas");
            inCanvas.width = INPUT_W;
            inCanvas.height = INPUT_H;
            const inCtx = inCanvas.getContext("2d");
            if (!inCtx) return;

            // Draw input image and extract its pixels
            inCtx.drawImage(img, 0, 0, INPUT_W, INPUT_H);
            const inData = inCtx.getImageData(0, 0, INPUT_W, INPUT_H);
            const srcPixels = new Uint32Array(inData.data.buffer);

            const outData = outCtx.createImageData(OUTPUT_W, OUTPUT_H);
            const destPixels = new Uint32Array(outData.data.buffer);

            const maxIter = destPixels.length;

            for (let i = 0; i < maxIter; i++) {
                const srcIndex = lookup[i];

                if (srcIndex < srcPixels.length) {
                    destPixels[i] = srcPixels[srcIndex];
                }
            }

            // 4. Render to the visible output canvas
            outCtx.putImageData(outData, 0, 0);
        };
    };

    const handleDeleteImage = () => {
        setImageFile(null);
    };

    const handleDownloadImage = () => {
        if (!imageFile) return;
        //scale image by 4x

        const outCanvas = outputCanvasRef.current;
        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = OUTPUT_W * 16;
        scaledCanvas.height = OUTPUT_H * 16;

        const scaledCtx = scaledCanvas.getContext("2d");
        if (!scaledCtx) return;

        if (outCanvas) {
            scaledCtx.imageSmoothingEnabled = false;
            scaledCtx.drawImage(
                outCanvas,
                0,
                0,
                scaledCanvas.width,
                scaledCanvas.height,
            );
        }

        const imageName = imageFile.name.replace(/\.[^/.]+$/, "");
        const link = document.createElement("a");
        link.download = imageName + "_beads.png";
        link.href = scaledCanvas.toDataURL("image/png");
        link.click();
    };

    const handleView3D = () => {
        const outCanvas = outputCanvasRef.current;
        if (!outCanvas) return;

        const dataUrl = outCanvas.toDataURL("image/png");
        const newWindow = window.open("", "_blank");
        if (newWindow) {
            newWindow.document.write(
                `<img src="${dataUrl}" alt="Skin 3D View" />`,
            );
            newWindow.document.title = "Skin 3D View";
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center flex-column px-5 py-4 gap-3"
            style={{
                height: "100dvh",
                width: "100dvw",
            }}
        >
            <FileInput
                message="Faça upload da sua skin"
                onChange={handleImageUpload}
                style={{
                    aspectRatio: `${OUTPUT_W}/${OUTPUT_H}`,
                    flexGrow: 1,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: imageFile ? "none" : "block",
                }}
            />

            <canvas
                ref={outputCanvasRef}
                width={OUTPUT_W}
                height={OUTPUT_H}
                style={{
                    display: imageFile ? "block" : "none",
                    aspectRatio: `${OUTPUT_W}/${OUTPUT_H}`,
                    flexGrow: 1,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    imageRendering: "pixelated", // Keeps 64x64 pixelated and sharp
                    border: "1px solid #ccc",
                    backgroundColor: "#b0afaf",
                }}
            ></canvas>

            <div className="btn-group" role="group">
                <Button
                    text="Deletar"
                    onClick={handleDeleteImage}
                    color="danger"
                />
                <Button
                    text="Download"
                    onClick={handleDownloadImage}
                    color="primary"
                />
                <Button
                    text="Ver em 3D"
                    onClick={handleView3D}
                    color="success"
                />
            </div>
        </div>
    );
}

export default App;
