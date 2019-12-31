export default `
  type Script {
    _id: ID

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
    data: IData

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

  type ScriptInput {
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

  type IDataInput {
    action: String
    args: [IArgsInput]
  }

  type IArgs {
    field: String
    value: String
  }

  type IArgsInput {
    field: String
    value: String
  }
`;
