export const retrieveTalks = () => {
    return fetch('/api/talks')
        .then(r => r.json())
}