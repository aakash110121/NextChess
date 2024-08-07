export default function PointsGained(difficulty:number, gameResult:string): number {
    const pointsTable: { [key: number]: { [key: string]: number } } = {
        1: { w: 2, l: -14, d: -3 },
        2: { w: 4, l: -10, d: -1 },
        3: { w: 8, l: -8, d: 0 },
        4: { w: 10, l: -4, d: 1 },
        5: { w: 14, l: -2, d: 3 }
    };

    return pointsTable[difficulty]?.[gameResult] ?? 0;
}