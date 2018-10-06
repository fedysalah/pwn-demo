export const retrieveSpeakers = () => {
    return fetch('/api/speakers')
        .then(r => r.json())
}