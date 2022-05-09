import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../appRoutes';
import { selectIsLoggedIn, selectJwtIsAdmin } from '../redux/loginSlice';
import { AppDispatch, RootState } from '../redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useRequireAuth = (requireAdmin = false) => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const isAdmin = useAppSelector(selectJwtIsAdmin);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn || (requireAdmin && !isAdmin))
            navigate(appRoutes.login);
    }, [isLoggedIn, isAdmin, navigate, requireAdmin])
}