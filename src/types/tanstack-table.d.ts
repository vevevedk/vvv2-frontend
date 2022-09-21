
import { RankingInfo } from "@tanstack/match-sorter-utils"

import {
    FilterFn,
    RowData,
} from "@tanstack/react-table"

declare module "@tanstack/table-core" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        enableSelection?: boolean
    }

    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}