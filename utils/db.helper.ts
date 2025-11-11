import { ObjectLiteral, type SelectQueryBuilder } from 'typeorm'

export const conditionUtils = <T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, objs: Record<string, unknown>) => {
    Object.keys(objs).forEach((key) => {
        if (objs[key] !== undefined && objs[key] !== null) {
            queryBuilder.andWhere(`${key} = :${key}`, { [key]: objs[key] })
        }
    })
    return queryBuilder
}
