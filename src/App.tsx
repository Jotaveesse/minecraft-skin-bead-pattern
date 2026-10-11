import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { INPUT_H, INPUT_W, OUTPUT_H, OUTPUT_W, lookup } from "./Mappings";
import FileInput from "./components/MinecraftFileInput";
import MinecraftButton from "./components/MinecraftButton";
import { generateVoxelModel, VoxelCharacter, type VoxelData } from "./Model";
import sculkAnimated from "./assets/sculk_animated.webp";

function App() {
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [is3DView, setIs3DView] = useState(false);
    const [voxelData, setVoxelData] = useState<VoxelData[]>([]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            if (img.width !== INPUT_W || img.height !== INPUT_H) {
                alert(`The image must have ${INPUT_W}x${INPUT_H} pixels.`);
                setImageFile(null);
                return;
            }

            setImageFile(file);
            setIs3DView(false);

            const outCanvas = outputCanvasRef.current;
            if (!outCanvas) return;
            const outCtx = outCanvas.getContext("2d");
            if (!outCtx) return;

            const inCanvas = document.createElement("canvas");
            inCanvas.width = INPUT_W;
            inCanvas.height = INPUT_H;
            const inCtx = inCanvas.getContext("2d");
            if (!inCtx) return;

            inCtx.drawImage(img, 0, 0, INPUT_W, INPUT_H);
            const inData = inCtx.getImageData(0, 0, INPUT_W, INPUT_H);
            const srcPixels = new Uint32Array(inData.data.buffer);

            const outData = outCtx.createImageData(OUTPUT_W, OUTPUT_H);
            const destPixels = new Uint32Array(outData.data.buffer);

            for (let i = 0; i < destPixels.length; i++) {
                const srcIndex = lookup[i];
                if (srcIndex < srcPixels.length && srcIndex !== -1) {
                    destPixels[i] = srcPixels[srcIndex];
                }
            }

            outCtx.putImageData(outData, 0, 0);
        };
    };

    const handleDeleteImage = () => {
        setImageFile(null);
        setIs3DView(false);
        setVoxelData([]);
    };

    const handleDownloadImage = () => {
        if (!imageFile) return;
        const outCanvas = outputCanvasRef.current;
        if (!outCanvas) return;

        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = OUTPUT_W * 16;
        scaledCanvas.height = OUTPUT_H * 16;
        const scaledCtx = scaledCanvas.getContext("2d");
        if (!scaledCtx) return;

        scaledCtx.imageSmoothingEnabled = false;
        scaledCtx.drawImage(
            outCanvas,
            0,
            0,
            scaledCanvas.width,
            scaledCanvas.height,
        );

        const imageName = imageFile.name.replace(/\.[^/.]+$/, "");
        const link = document.createElement("a");
        link.download = imageName + "_beads.png";
        link.href = scaledCanvas.toDataURL("image/png");
        link.click();
    };

    const handleView3D = () => {
        if (!imageFile || !outputCanvasRef.current) return;

        if (!is3DView) {
            const data = generateVoxelModel(outputCanvasRef.current);
            setVoxelData(data);
        }
        setIs3DView(!is3DView);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center flex-column px-5 py-4 gap-3"
            style={{
                height: "100dvh",
                width: "100dvw",
                backgroundImage: `url(${sculkAnimated})`,
                backgroundSize: "250px",
                imageRendering: "pixelated",
            }}
        >
            <FileInput
                message="Upload your skin"
                onChange={handleImageUpload}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    backgroundColor: "#c6c6c6",
                    display: imageFile ? "none" : "block",
                }}
            />

            <div
                className="mc-panel"
                style={
                    {
                        display: imageFile ? "flex" : "none",
                        flexGrow: 1,
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        "--mc-px": "3px",
                    } as React.CSSProperties
                }
            >
                {/* CANVAS 2D PIXELADO */}
                <canvas
                    ref={outputCanvasRef}
                    width={OUTPUT_W}
                    height={OUTPUT_H}
                    style={{
                        display: is3DView ? "none" : "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated",
                    }}
                />

                {/* CANVAS 3D VOXEL */}
                {is3DView && (
                    <Canvas flat camera={{ position: [0, 16, 40], fov: 50 }}>
                        <color attach="background" args={["#6f6f6f"]} />
                        <VoxelCharacter voxelData={voxelData} />
                        <OrbitControls target={[0, 16, 0]} />
                    </Canvas>
                )}
            </div>

            <div className="d-flex gap-2">
                <MinecraftButton text="Delete" onClick={handleDeleteImage} />
                <MinecraftButton
                    text="Download"
                    onClick={handleDownloadImage}
                />
                <MinecraftButton
                    text={is3DView ? "See Pattern" : "See Assembled"}
                    onClick={handleView3D}
                />
            </div>
        </div>
    );
}

export default App;
