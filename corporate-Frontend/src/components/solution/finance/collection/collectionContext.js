import React, { createContext, useReducer } from 'react';

const initContext = { exId: '', customerId: '', page: '' , collectId:''};
export const CollectionContext = createContext({});

const collectionReducer = (state, action) => {
    switch (action.type) {
        case "setExId":
            return {
                ...state,
                exId: action.payload
            };
        case "setCustomerId":
            return {
                ...state,
                customerId: action.payload
            };
        case "setPage":
            return {
                ...state,
                page: action.payload
            };
        case "setCollectId":
            return {
                ...state,
                collectId: action.payload
            }
        default:
            return state;
    }
}

export const CollectionProvider = ({ children }) => {
    const [collectionState, collectionDispatch] = useReducer(
        collectionReducer,
        initContext
    );

    const collection = collectionState

    const setExId = payload =>
        collectionDispatch({ type: "setExId", payload })

    const setCustomerId = payload =>
        collectionDispatch({ type: "setCustomerId", payload })

    const setPage = payload =>
        collectionDispatch({ type: "setPage", payload })

    const setCollectId = payload =>
        collectionDispatch({ type: "setCollectId", payload })

    return (
        <CollectionContext.Provider value={{ collection, setExId, setCustomerId, setPage, setCollectId }}>
            {children}
        </CollectionContext.Provider>
    )
}
