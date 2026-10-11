type RectangleMapping = {
    srcX: number;
    srcY: number;
    width: number;
    height: number;
    destX: number;
    destY: number;
    // A Set of local 1D indices (relative to the rectangle) to skip
    excludedPixels?: Set<number>;
};

const INPUT_W = 64;
const INPUT_H = 64;
const OUTPUT_W = 100;
const OUTPUT_H = 40;

const HEAD_TOP: RectangleMapping = {
    srcX: 8,
    srcY: 0,
    width: 8,
    height: 8,
    destX: 62,
    destY: 0,
    excludedPixels: new Set<number>([
        0, 1, 3, 4, 6, 7, 8, 15, 24, 31, 32, 39, 48, 55, 56, 57, 59, 60, 62, 63,
    ]),
};

const HEAD_BOTTOM: RectangleMapping = {
    srcX: 16,
    srcY: 0,
    width: 8,
    height: 8,
    destX: 72,
    destY: 0,
    excludedPixels: new Set<number>([
        0, 1, 3, 4, 6, 7, 8, 15, 24, 31, 32, 39, 48, 55, 56, 57, 59, 60, 62, 63,
    ]),
};

const HEAD_RIGHT: RectangleMapping = {
    srcX: 0,
    srcY: 8,
    width: 8,
    height: 8,
    destX: 52,
    destY: 10,
    excludedPixels: new Set<number>([
        0, 2, 5, 7, 8, 15, 24, 31, 32, 39, 48, 55, 56, 58, 61, 63,
    ]),
};

const HEAD_FRONT: RectangleMapping = {
    srcX: 8,
    srcY: 8,
    width: 8,
    height: 8,
    destX: 62,
    destY: 10,
    excludedPixels: new Set<number>([2, 5, 16, 23, 40, 47, 58, 61]),
};

const HEAD_LEFT: RectangleMapping = {
    srcX: 16,
    srcY: 8,
    width: 8,
    height: 8,
    destX: 72,
    destY: 10,
    excludedPixels: new Set<number>([
        0, 2, 5, 7, 8, 15, 24, 31, 32, 39, 48, 55, 56, 58, 61, 63,
    ]),
};

const HEAD_BACK: RectangleMapping = {
    srcX: 24,
    srcY: 8,
    width: 8,
    height: 8,
    destX: 82,
    destY: 10,
    excludedPixels: new Set<number>([2, 5, 16, 23, 40, 47, 58, 61]),
};

const BODY_TOP: RectangleMapping = {
    srcX: 20,
    srcY: 16,
    width: 8,
    height: 4,
    destX: 24,
    destY: 0,
    excludedPixels: new Set<number>([3, 4, 8, 15, 16, 23, 27, 28]),
};

const BODY_BOTTOM: RectangleMapping = {
    srcX: 28,
    srcY: 16,
    width: 8,
    height: 4,
    destX: 34,
    destY: 0,
    excludedPixels: new Set<number>([3, 4, 8, 15, 16, 23, 27, 28]),
};

const BODY_RIGHT: RectangleMapping = {
    srcX: 16,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 18,
    destY: 6,
    excludedPixels: new Set<number>([
        0, 3, 4, 7, 8, 11, 20, 23, 24, 27, 36, 39, 40, 43, 44, 47,
    ]),
};

const BODY_FRONT: RectangleMapping = {
    srcX: 20,
    srcY: 20,
    width: 8,
    height: 12,
    destX: 24,
    destY: 6,
    excludedPixels: new Set<number>([
        0, 1, 2, 5, 6, 7, 24, 31, 32, 39, 56, 63, 64, 71, 88, 89, 90, 93, 94,
        95,
    ]),
};

const BODY_LEFT: RectangleMapping = {
    srcX: 28,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 34,
    destY: 6,
    excludedPixels: new Set<number>([
        0, 3, 4, 7, 8, 11, 20, 23, 24, 27, 36, 39, 40, 43, 44, 47,
    ]),
};

const BODY_BACK: RectangleMapping = {
    srcX: 32,
    srcY: 20,
    width: 8,
    height: 12,
    destX: 40,
    destY: 6,
    excludedPixels: new Set<number>([
        0, 1, 2, 5, 6, 7, 24, 31, 32, 39, 56, 63, 64, 71, 88, 89, 90, 93, 94,
        95,
    ]),
};

const RIGHT_ARM_TOP: RectangleMapping = {
    srcX: 44,
    srcY: 16,
    width: 4,
    height: 4,
    destX: 6,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const RIGHT_ARM_BOTTOM: RectangleMapping = {
    srcX: 48,
    srcY: 16,
    width: 4,
    height: 4,
    destX: 12,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const RIGHT_ARM_RIGHT: RectangleMapping = {
    srcX: 40,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 0,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const RIGHT_ARM_FRONT: RectangleMapping = {
    srcX: 44,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 6,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const RIGHT_ARM_LEFT: RectangleMapping = {
    srcX: 48,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 12,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const RIGHT_ARM_BACK: RectangleMapping = {
    srcX: 52,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 18,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const LEFT_ARM_TOP: RectangleMapping = {
    srcX: 36,
    srcY: 48,
    width: 4,
    height: 4,
    destX: 32,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const LEFT_ARM_BOTTOM: RectangleMapping = {
    srcX: 40,
    srcY: 48,
    width: 4,
    height: 4,
    destX: 38,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const LEFT_ARM_RIGHT: RectangleMapping = {
    srcX: 32,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 26,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const LEFT_ARM_FRONT: RectangleMapping = {
    srcX: 36,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 32,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const LEFT_ARM_LEFT: RectangleMapping = {
    srcX: 40,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 38,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const LEFT_ARM_BACK: RectangleMapping = {
    srcX: 44,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 44,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const RIGHT_LEG_TOP: RectangleMapping = {
    srcX: 4,
    srcY: 16,
    width: 4,
    height: 4,
    destX: 58,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const RIGHT_LEG_BOTTOM: RectangleMapping = {
    srcX: 8,
    srcY: 16,
    width: 4,
    height: 4,
    destX: 64,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const RIGHT_LEG_RIGHT: RectangleMapping = {
    srcX: 0,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 52,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const RIGHT_LEG_FRONT: RectangleMapping = {
    srcX: 4,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 58,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const RIGHT_LEG_LEFT: RectangleMapping = {
    srcX: 8,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 64,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const RIGHT_LEG_BACK: RectangleMapping = {
    srcX: 12,
    srcY: 20,
    width: 4,
    height: 12,
    destX: 70,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const LEFT_LEG_TOP: RectangleMapping = {
    srcX: 20,
    srcY: 48,
    width: 4,
    height: 4,
    destX: 84,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const LEFT_LEG_BOTTOM: RectangleMapping = {
    srcX: 24,
    srcY: 48,
    width: 4,
    height: 4,
    destX: 90,
    destY: 22,
    excludedPixels: new Set<number>([1, 2, 13, 14]),
};

const LEFT_LEG_RIGHT: RectangleMapping = {
    srcX: 16,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 78,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const LEFT_LEG_FRONT: RectangleMapping = {
    srcX: 20,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 84,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const LEFT_LEG_LEFT: RectangleMapping = {
    srcX: 24,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 90,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 1, 2, 3, 4, 7, 16, 19, 20, 23, 24, 27, 28, 31, 40, 43, 44, 45, 46,
        47,
    ]),
};

const LEFT_LEG_BACK: RectangleMapping = {
    srcX: 28,
    srcY: 52,
    width: 4,
    height: 12,
    destX: 96,
    destY: 28,
    excludedPixels: new Set<number>([
        0, 3, 8, 11, 12, 15, 32, 35, 36, 39, 44, 47,
    ]),
};

const MAPPINGS: RectangleMapping[] = [
    HEAD_TOP,
    HEAD_BOTTOM,
    HEAD_RIGHT,
    HEAD_FRONT,
    HEAD_LEFT,
    HEAD_BACK,
    BODY_TOP,
    BODY_BOTTOM,
    BODY_RIGHT,
    BODY_FRONT,
    BODY_LEFT,
    BODY_BACK,
    RIGHT_ARM_TOP,
    RIGHT_ARM_BOTTOM,
    RIGHT_ARM_RIGHT,
    RIGHT_ARM_FRONT,
    RIGHT_ARM_LEFT,
    RIGHT_ARM_BACK,
    LEFT_ARM_TOP,
    LEFT_ARM_BOTTOM,
    LEFT_ARM_RIGHT,
    LEFT_ARM_FRONT,
    LEFT_ARM_LEFT,
    LEFT_ARM_BACK,
    RIGHT_LEG_TOP,
    RIGHT_LEG_BOTTOM,
    RIGHT_LEG_RIGHT,
    RIGHT_LEG_FRONT,
    RIGHT_LEG_LEFT,
    RIGHT_LEG_BACK,
    LEFT_LEG_TOP,
    LEFT_LEG_BOTTOM,
    LEFT_LEG_RIGHT,
    LEFT_LEG_FRONT,
    LEFT_LEG_LEFT,
    LEFT_LEG_BACK,
];

const getIndex = (x: number, y: number, width: number) => y * width + x;

const lookup = (function buildLookupTable() {
    const lookup = new Int32Array(OUTPUT_W * OUTPUT_H).fill(-1);

    MAPPINGS.forEach((rect) => {
        for (let localY = 0; localY < rect.height; localY++) {
            for (let localX = 0; localX < rect.width; localX++) {
                // Calculate the local index within this specific rectangle
                const localIndex = localY * rect.width + localX;

                // Check our arbitrary exclusion Set
                if (
                    rect.excludedPixels &&
                    rect.excludedPixels.has(localIndex)
                ) {
                    continue; // Skip this pixel
                }

                const srcIndex = getIndex(
                    rect.srcX + localX,
                    rect.srcY + localY,
                    INPUT_W,
                );

                const destIndex = getIndex(
                    rect.destX + localX,
                    rect.destY + localY,
                    OUTPUT_W,
                );

                if (destIndex < lookup.length) {
                    lookup[destIndex] = srcIndex;
                }
            }
        }
    });
    console.log(lookup);

    return lookup;
})();

export { lookup, INPUT_W, INPUT_H, OUTPUT_W, OUTPUT_H, MAPPINGS };
export type { RectangleMapping };
