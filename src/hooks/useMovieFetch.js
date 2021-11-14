import { useState, useEffect } from "react";
import API from '../API';
// Helpers
import { isPersistedState } from "../helpers";


export const useMovieFetch = movieId => {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetching is the movieId changes
    useEffect(() => {

        // If we needed this func for something else we need to move it outside the useEffect and wrap it in a useCallback to avoid an infinite loop
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setError(false);

                const movie = await API.fetchMovie(movieId);
                const credits = await API.fetchCredits(movieId);

                // Get directors only
                const directors = credits.crew.filter(
                    member => member.job === 'Director'
                );

                setState({
                    ...movie,
                    actors: credits.cast,
                    directors
                })

                setLoading(false);

            } catch (error) {
                setError(true);
            }
        };

        // Checking the sessionStorage
        const sessionState = isPersistedState(movieId);

        if (sessionState) {
            setState(sessionState);
            setLoading(false);
            return;
        }

        fetchMovie();

    }, [movieId])

    // Write to sessionStorage
    useEffect(() => {
        sessionStorage.setItem(movieId, JSON.stringify(state));
    },[movieId, state])


    return { state, loading, error }
};
