export async function searchAddress(keywords: string) {
    const response = await fetch(
        '//restapi.amap.com/v3/place/text?' +
            new URLSearchParams({
                key: '8325164e247e15eea68b59e89200988b',
                keywords
            })
    );
    const { status, info, pois } = await response.json();

    if (status !== '1') throw new URIError(info);

    return pois.sort(({ name }) => (name === keywords ? -1 : 1));
}
