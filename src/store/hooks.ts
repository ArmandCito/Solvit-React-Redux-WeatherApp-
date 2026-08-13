import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// componants get AppDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Pre-typed version of useSelector:
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
