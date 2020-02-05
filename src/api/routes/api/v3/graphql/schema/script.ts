// Note: the username field is taken from the discord api,
// its the username of the author

export default `
  type Scripts {
    list: [Script]
    total: Int
  }

  type Script {
    _id: ID

    author_id: String
    username: String

    name: String
    description: String
    help: String
    thumbnail: String
    marketplace_enabled: Boolean

    type: String
    match_type: String
    match: String

    code: String
    data: IData

    local: Boolean
    featured: Boolean
    preload: Boolean
    verified: Boolean
    user_verified: Boolean
    likes: Int
    guild_count: Int
    use_count: Int

    created_with: String
    created_at: String
    updated_at: String
  }

  input ScriptInput {
    author_id: String

    name: String
    description: String
    help: String
    thumbnail: String
    marketplace_enabled: Boolean

    type: String
    match_type: String
    match: String

    code: String
    data: IDataInput

    local: Boolean
    featured: Boolean
    preload: Boolean
    verified: Boolean
    likes: Int
    guild_count: Int
    use_count: Int

    created_with: String
    created_at: String
    updated_at: String
  }

  type IData {
    action: String
    args: [IArgs]
  }

  input IDataInput {
    action: String
    args: [IArgsInput]
  }

  type IArgs {
    field: String
    value: String
  }

  input IArgsInput {
    field: String
    value: String
  }
`;
