const treeify = require('object-treeify')

export class Tree {
  nodes: Record<string, Tree> = {}

  display(logger: any = console.log): void {
    const addNodes = function (nodes: any): Record<string, any> {
      const tree: Record<string, any> = {}
      for (const p of Object.keys(nodes as object)) {
        tree[p] = addNodes(nodes[p].nodes)
      }

      return tree
    }

    const tree = addNodes(this.nodes)
    logger(treeify(tree))
  }

  insert(child: string, value: Tree = new Tree()): this {
    this.nodes[child] = value
    return this
  }

  search(key: string): Tree | undefined {
    for (const child of Object.keys(this.nodes)) {
      if (child === key) {
        return this.nodes[child]
      }

      const c = this.nodes[child].search(key)
      if (c) return c
    }
  }
}

export default function tree(): Tree {
  return new Tree()
}
