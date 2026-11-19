import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './index.ts'

// Les hooks de react-redux, typés une fois pour toute l'application
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
