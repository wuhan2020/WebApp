declare module '*.css' {
    const map: { [key: string]: string };

    export default map;
}

declare module '*.png' {
    const path: string;

    export default path;
}
