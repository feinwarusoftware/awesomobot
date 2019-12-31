export default `
  type Guild {
    _id: ID,

    discord_id: String,
    prefix: String,
    premium: Boolean,
    member_perms: [IMemberPerm],
    script_perms: [IGuildScriptPerms],
    scripts: [GuildScript]
  }

  type GuildInput {
    discord_id: String,
    prefix: String,
    premium: Boolean,
    member_perms: [IMemberPermInput],
    script_perms: [IGuildScriptPermsInput],
    scripts: [GuildScriptInput]
  }

  type IMemberPerm {
    member_id: String,
    list: [String]
  }

  type IMemberPermInput {
    member_id: String,
    list: [String]
  }
`;
