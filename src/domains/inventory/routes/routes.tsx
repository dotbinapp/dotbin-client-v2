import {lazy} from 'react'

export const STOCKS_ROUTE_PATH = '/stock'
export const StocksPage = lazy(() => import('../pages/Stock.page'))