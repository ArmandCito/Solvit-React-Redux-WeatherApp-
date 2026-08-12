import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Pre-typed version of useDispatch: components get AppDispatch
// (which knows about thunks) instead of the plain generic Dispatch.
export const useAppDispatch: () => AppDispatch = useDispatch;

// Pre-typed version of useSelector: components get autocomplete and
// type-checking on `state` without importing RootState everywhere.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
