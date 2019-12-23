interface IPermNode {
  whitelist: boolean,
  list: string[]
}

interface IGuildScriptPerms {
  enabled: boolean,
  members: IPermNode,
  channels: IPermNode,
  roles: IPermNode
}

export default IGuildScriptPerms;
