import { useState, useEffect } from 'react';
// API
import API from '../API'
// Helpers
import { isPersistedState } from '../helpers';



const initialState = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
};



export const useHomeFetch = () => {

    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [state, setState] = useState(initialState); // This state will hold the movies
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    

    // Get the movies from the api functuion
    const fetchMovies = async (page, searchTerm = "") => {
        try {
            setError(false);
            setLoading(true);

            const movies = await API.fetchMovies(searchTerm, page);
            

            setState(prev => ({
                ...movies,
                results:
                    page > 1 ? [...prev.results, ...movies.results] : [...movies.results] // Load more movies functionality
            }))

        } catch (error) {
            setError(true);
        }
        setLoading(false);
    };

    // Initial and searchTerm changes
    useEffect(() => {
        // If we have session State and no seach term w are setting the state from session instead of fetching
        if (!searchTerm) {
            const sessionState = isPersistedState('homeState');

            if (sessionState) {
                setState(sessionState);
                return;
            }
        }

        setState(initialState);

        fetchMovies(1, searchTerm);
    }, [searchTerm]);


    // Load More
    useEffect(() => {
        if (!isLoadingMore) return;

        fetchMovies(state.page + 1, searchTerm);
        setIsLoadingMore(false);

    }, [isLoadingMore, searchTerm, state.page])


    // Write state to sessionStorage
    useEffect(() => {
        if (!searchTerm) {sessionStorage.setItem('homeState', JSON.stringify(state));}
    }, [searchTerm, state])


    return { state, loading, error, setSearchTerm, searchTerm, setIsLoadingMore };
};