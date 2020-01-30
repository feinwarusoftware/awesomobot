"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
  type GuildScript {
    object_id: ID,
    permissions: IGuildScriptPerms
  }

  input GuildScriptInput {
    permissions: IGuildScriptPermsInput
  }

  type IGuildScriptPerms {
    enabled: Boolean,
    members: IPermNode,
    channels: IPermNode,
    roles: IPermNode
  }

  input IGuildScriptPermsInput {
    enabled: Boolean,
    members: IPermNodeInput,
    channels: IPermNodeInput,
    roles: IPermNodeInput
  }

  type IPermNode {
    whitelist: Boolean,
    list: [String]
  }

  input IPermNodeInput {
    whitelist: Boolean,
    list: [String]
  }
`;
//# sourceMappingURL=guildScript.js.map