export default function displayMatchType(match: string, type: string) {
  const matches = match.split(";");
  switch (type) {
    case "command":
      return `-${matches.join(" or -")}`
    case "startswith":
      return `message starts with "${matches.join('" or "')}"`;
    case "contains":
      return `message must contain "${matches.join('" or "')}"`;
    case "exactmatch":
      return `must must only contain "${matches.join('" or "')}"`;
    default:
      console.error(`${type} is not a valid match-type`);
      return;
  }
}
