interface TreeNode {
    id: number
    parentId: number | null
    children?: TreeNode[]
    [key: string]: any
}

export function buildTreeWithMap<T extends TreeNode>(items: T[]): T[] {
    const itemMap = new Map<number, T>()
    const tree: T[] = []

    // 第一遍：创建映射
    items.forEach((item) => {
        itemMap.set(item.id, { ...item, children: [] })
    })

    // 第二遍：构建树
    items.forEach((item) => {
        if (item.parentId === null) {
            tree.push(itemMap.get(item.id)!)
        } else {
            const parent = itemMap.get(item.parentId)
            if (parent) {
                parent.children!.push(itemMap.get(item.id)!)
            } else {
                tree.push(itemMap.get(item.id)!)
            }
        }
    })

    // 排序
    const sortTree = (nodes: T[]): T[] => {
        return nodes
            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
            .map((node) => ({
                ...node,
                children: node.children ? sortTree(node.children as T[]) : [],
            }))
    }

    return sortTree(tree)
}
