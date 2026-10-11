import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { MAPPINGS, type RectangleMapping } from "./Mappings";

const scratchObject3D = new THREE.Object3D();
const scratchColor = new THREE.Color();

export type VoxelData = {
    position: [number, number, number];
    color: string;
};

// --- CONFIGURAÇÃO AUTOMÁTICA DAS PARTES DO CORPO ---
export type BodyPartDef = {
    name: string;
    offsetX: number; // Posição 3D
    offsetY: number;
    offsetZ: number;
    w: number; // Dimensões do bloco
    h: number;
    d: number;
    faces: {
        top: RectangleMapping;
        bottom: RectangleMapping;
        right: RectangleMapping;
        front: RectangleMapping;
        left: RectangleMapping;
        back: RectangleMapping;
    };
};

const BODY_PARTS: BodyPartDef[] = [
    {
        name: "HEAD",
        offsetX: -4,
        offsetY: 24,
        offsetZ: -4,
        w: 8,
        h: 8,
        d: 8,
        faces: {
            top: MAPPINGS[0],
            bottom: MAPPINGS[1],
            right: MAPPINGS[2],
            front: MAPPINGS[3],
            left: MAPPINGS[4],
            back: MAPPINGS[5],
        },
    },
    {
        name: "BODY",
        offsetX: -4,
        offsetY: 12,
        offsetZ: -2,
        w: 8,
        h: 12,
        d: 4,
        faces: {
            top: MAPPINGS[6],
            bottom: MAPPINGS[7],
            right: MAPPINGS[8],
            front: MAPPINGS[9],
            left: MAPPINGS[10],
            back: MAPPINGS[11],
        },
    },
    {
        name: "RIGHT_ARM",
        offsetX: -8,
        offsetY: 12,
        offsetZ: -2,
        w: 4,
        h: 12,
        d: 4,
        faces: {
            top: MAPPINGS[12],
            bottom: MAPPINGS[13],
            right: MAPPINGS[14],
            front: MAPPINGS[15],
            left: MAPPINGS[16],
            back: MAPPINGS[17],
        },
    },
    {
        name: "LEFT_ARM",
        offsetX: 4,
        offsetY: 12,
        offsetZ: -2,
        w: 4,
        h: 12,
        d: 4,
        faces: {
            top: MAPPINGS[18],
            bottom: MAPPINGS[19],
            right: MAPPINGS[20],
            front: MAPPINGS[21],
            left: MAPPINGS[22],
            back: MAPPINGS[23],
        },
    },
    {
        name: "RIGHT_LEG",
        offsetX: -4,
        offsetY: 0,
        offsetZ: -2,
        w: 4,
        h: 12,
        d: 4,
        faces: {
            top: MAPPINGS[24],
            bottom: MAPPINGS[25],
            right: MAPPINGS[26],
            front: MAPPINGS[27],
            left: MAPPINGS[28],
            back: MAPPINGS[29],
        },
    },
    {
        name: "LEFT_LEG",
        offsetX: 0,
        offsetY: 0,
        offsetZ: -2,
        w: 4,
        h: 12,
        d: 4,
        faces: {
            top: MAPPINGS[30],
            bottom: MAPPINGS[31],
            right: MAPPINGS[32],
            front: MAPPINGS[33],
            left: MAPPINGS[34],
            back: MAPPINGS[35],
        },
    },
];

export function VoxelCharacter({ voxelData }: { voxelData: VoxelData[] }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        voxelData.forEach((voxel, index) => {
            scratchObject3D.position.set(...voxel.position);
            scratchObject3D.updateMatrix();
            meshRef.current!.setMatrixAt(index, scratchObject3D.matrix);

            scratchColor.set(voxel.color);
            meshRef.current!.setColorAt(index, scratchColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [voxelData]);

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, voxelData.length]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial />
        </instancedMesh>
    );
}

// --- NOVO EXTRATOR UNIVERSAL ---
export function generateVoxelModel(canvas: HTMLCanvasElement): VoxelData[] {
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const voxels: VoxelData[] = [];

    // Set para evitar voxels duplicados nas quinas caso sobrem arestas
    const seenPositions = new Set<string>();

    const getColor = (u: number, v: number) => {
        if (u < 0 || u >= canvas.width || v < 0 || v >= canvas.height)
            return null;
        const index = (v * canvas.width + u) * 4;
        if (imgData.data[index + 3] === 0) return null; // Ignora se o pixel for transparente
        return `rgb(${imgData.data[index]}, ${imgData.data[index + 1]}, ${imgData.data[index + 2]})`;
    };

    BODY_PARTS.forEach((part) => {
        Object.entries(part.faces).forEach(([faceName, mapping]) => {
            // Varre o retângulo 2D dessa face
            for (let localY = 0; localY < mapping.height; localY++) {
                for (let localX = 0; localX < mapping.width; localX++) {
                    // Pega a cor diretamente da imagem 100x40 de saída
                    const u = mapping.destX + localX;
                    const v = mapping.destY + localY;
                    const color = getColor(u, v);

                    // Como os 'excludedPixels' já vazaram o canvas, eles retornam null aqui
                    if (!color) continue;

                    let x = 0,
                        y = 0,
                        z = 0;

                    // Mapeia o pixel 2D para a coordenada 3D da face correta
                    switch (faceName) {
                        case "top":
                            x = localX;
                            y = part.h - 1;
                            z = localY;
                            break;
                        case "bottom":
                            x = localX;
                            y = 0;
                            z = localY;
                            break;
                        case "right":
                            x = 0;
                            y = part.h - 1 - localY;
                            z = localX;
                            break;
                        case "front":
                            x = localX;
                            y = part.h - 1 - localY;
                            z = part.d - 1;
                            break;
                        case "left":
                            x = part.w - 1;
                            y = part.h - 1 - localY;
                            z = part.d - 1 - localX;
                            break;
                        case "back":
                            x = part.w - 1 - localX;
                            y = part.h - 1 - localY;
                            z = 0;
                            break;
                    }

                    // Adiciona o offset da parte do corpo para montar o personagem
                    const finalX = x + part.offsetX;
                    const finalY = y + part.offsetY;
                    const finalZ = z + part.offsetZ;

                    const posKey = `${finalX},${finalY},${finalZ}`;

                    // Registra apenas se esse bloco ainda não existir (previne "Z-fighting")
                    if (!seenPositions.has(posKey)) {
                        seenPositions.add(posKey);
                        voxels.push({
                            position: [finalX, finalY, finalZ],
                            color,
                        });
                    }
                }
            }
        });
    });

    return voxels;
}
