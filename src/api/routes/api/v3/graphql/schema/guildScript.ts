export default `
  type GuildScript {
    object_id: ID,
    permissions: IGuildScriptPerms
  }

  type GuildScriptInput {
    permissions: IGuildScriptPermsInput
  }

  type IGuildScriptPerms {
    enabled: Boolean,
    members: IPermNode,
    channels: IPermNode,
    roles: IPermNode
  }

  type IGuildScriptPermsInput {
    enabled: Boolean,
    members: IPermNodeInput,
    channels: IPermNodeInput,
    roles: IPermNodeInput
  }

  type IPermNode {
    whitelist: Boolean,
    list: [String]
  }

  type IPermNodeInput {
    whitelist: Boolean,
    list: [String]
  }
`;
