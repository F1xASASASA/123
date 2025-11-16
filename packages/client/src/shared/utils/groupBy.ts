export default function groupBy<T>(array: T[], callback: (item: T) => string) {
    return array.reduce(
        (result, currentItem) => {
            const groupByValue = callback(currentItem)

            if (!result[groupByValue]) {
                result[groupByValue] = []
            }

            result[groupByValue].push(currentItem)
            return result
        },
        {} as Record<string, T[]>,
    )
}
