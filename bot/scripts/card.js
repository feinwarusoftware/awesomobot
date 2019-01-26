"use strict";

const path = require("path");
const fs = require("fs");

const discord = require("discord.js");
const jimp = require("jimp");

const Command = require("../script");
const { similarity, jimp: { printCenter, printCenterCenter } } = require("../../utils");

const cards = require("../assets/cards/cards.json");

let sp16Font = null;
let sp18Font = null;
let sp25Font = null;
let sp27Font = null;
let sp60Font = null;

let frameOverlays = null;
let frameOutlines = null;
let frameTops = null;
let typeIcons = null;
let miscIcons = null;

function camelPad(str) {
  return str
  // Look for long acronyms and filter out the last letter
    .replace(/([A-Z]+)([A-Z][a-z])/g, " $1 $2")
  // Look for lower-case letters followed by upper-case letters
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
  // Look for lower-case letters followed by numbers
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
  // Remove any white space left around the word
    .trim();
}

// note, the base stats are upgrade 1
const getUpgradeStats = (currentCard, upgrade) => {
  if (upgrade < 1 || upgrade > 70) {
    console.log("oooof");
    return {};
  }
  const stats = {
    upgrade
  };
  for (let k in currentCard) {
    if (k.startsWith("Power") === true && currentCard[k] !== null && currentCard[k] !==
            "") {
      stats[k] = currentCard[k];
    }
    // exceptions cos redlynx gay
    if (k === "ChargedPowerRadius") {
      stats["PowerRange"] = currentCard[k];
    }
  }
  stats.Health = parseInt(currentCard.Health);
  if (isNaN(stats.Health)) {
    console.log("of");
    return {};
  }
  stats.Damage = parseInt(currentCard.Damage);
  if (isNaN(stats.Damage)) {
    console.log("oof");
    return {};
  }
  if (currentCard.Type === "Spell") {
    if (currentCard.Image === "SpellCockMagicCard") {
      stats["PowerTarget"] = 1;
    }
    return stats;
  }
  for (let i = 0; i < upgrade - 1; i++) {
    if (currentCard.TechTree2.Slots[i].id !== undefined) {
      stats.ability = true;
      continue;
    }
    if (currentCard.TechTree2.Slots[i].property === "MaxHealth") {
      stats.Health += currentCard.TechTree2.Slots[i].value;
    }
    if (currentCard.TechTree2.Slots[i].property === "Damage") {
      stats.Damage += currentCard.TechTree2.Slots[i].value;
    }
    if (currentCard.TechTree2.Slots[i].property.indexOf("Abs") !== -1) {
      const propertyAbs = currentCard.TechTree2.Slots[i].property;
      const property = propertyAbs.slice(0, propertyAbs.length - 3);
      if (stats[property] === undefined) {
        console.log("ooof");
        return {};
      } else {
        stats[property] += currentCard.TechTree2.Slots[i].value;
      }
    }
  }
  let levelModifier = 0;
  if (upgrade > 5) {
    levelModifier++;
  }
  if (upgrade > 15) {
    levelModifier++;
  }
  if (upgrade > 25) {
    levelModifier++;
  }
  if (upgrade > 40) {
    levelModifier++;
  }
  if (upgrade > 55) {
    levelModifier++;
  }
  for (let i = 0; i < levelModifier; i++) {
    for (let j = 0; j < currentCard.TechTree2.Evolve[i].Slots.length; j++) {
      if (currentCard.TechTree2.Evolve[i].Slots[j].property === "MaxHealth") {
        stats.Health += currentCard.TechTree2.Evolve[i].Slots[j].value;
      }
      if (currentCard.TechTree2.Evolve[i].Slots[j].property === "Damage") {
        stats.Damage += currentCard.TechTree2.Evolve[i].Slots[j].value;
      }
      if (currentCard.TechTree2.Evolve[i].Slots[j].property.indexOf("Abs") !== -1) {
        const propertyAbs = currentCard.TechTree2.Evolve[i].Slots[j].property;
        const property = propertyAbs.slice(0, propertyAbs.length - 3);
        if (stats[property] === undefined) {
          console.log("ooooof");
          return {};
        } else {
          stats[property] += currentCard.TechTree2.Evolve[i].Slots[j].value;
        }
      }
    }
  }
  return stats;
};

const getLevelStats = (currentCard, level) => {
  if (level < 1 || level > 7) {
    console.log("oooooof");
    return {};
  }
  if (level === 1) {
    return getUpgradeStats(currentCard, 1);
  }
  let upgradeModifier = 0;
  if (level === 2) {
    upgradeModifier += 5;
  }
  if (level === 3) {
    upgradeModifier += 15;
  }
  if (level === 4) {
    upgradeModifier += 25;
  }
  if (level === 5) {
    upgradeModifier += 40;
  }
  if (level === 6) {
    upgradeModifier += 55;
  }
  if (level === 7) {
    upgradeModifier += 70;
  }
  const stats = getUpgradeStats(currentCard, upgradeModifier);
  stats.level = level;
  if (currentCard.Type === "Spell") {
    for (let i = 0; i < level - 1; i++) {
      for (let j = 0; j < currentCard.TechTree2.Evolve[i].Slots.length; j++) {
        if (currentCard.TechTree2.Evolve[i].Slots[j].property === "MaxHealth") {
          stats.Health += currentCard.TechTree2.Evolve[i].Slots[j].value;
        }
        if (currentCard.TechTree2.Evolve[i].Slots[j].property === "Damage") {
          stats.Damage += currentCard.TechTree2.Evolve[i].Slots[j].value;
        }
        if (currentCard.TechTree2.Evolve[i].Slots[j].property.indexOf("Abs") !== -1) {
          const propertyAbs = currentCard.TechTree2.Evolve[i].Slots[j].property;
          const property = propertyAbs.slice(0, propertyAbs.length - 3);
          if (stats[property] === undefined) {
            console.log("ooooof");
            return {};
          } else {
            stats[property] += currentCard.TechTree2.Evolve[i].Slots[j].value;
          }
        }
      }
    }
  } else {
    const currentLevel = currentCard.TechTree2.Evolve[level - 2];
    for (let i = 0; i < currentLevel.Slots.length; i++) {
      if (currentLevel.Slots[i].property === "MaxHealth") {
        stats.Health += currentLevel.Slots[i].value;
      }
      if (currentLevel.Slots[i].property === "Damage") {
        stats.Damage += currentLevel.Slots[i].value;
      }
      if (currentLevel.Slots[i].property.indexOf("Abs") !== -1) {
        const propertyAbs = currentLevel.Slots[i].property;
        const property = propertyAbs.slice(0, propertyAbs.length - 3);
        if (stats[property] === undefined || property === "PowerTarget") {
          if (property === "PowerTarget") {
            stats[property] = level;
          } else {
            console.log("ooooooof");
            return {};
          }
        } else {
          stats[property] += currentLevel.Slots[i].value;
        }
      }
    }
  }
  return stats;
};

const getMaxUpgradeStats = (currentCard, level) => {
  if (level < 1 || level > 7) {
    console.log("oooooof");
    return {};
  }

  if (currentCard.Type === "Spell" || level === 7) {

    return getLevelStats(currentCard, level);
  }

  let upgradeModifier = 0;
  if (level === 1) {
    upgradeModifier += 5;
  }
  if (level === 2) {
    upgradeModifier += 15;
  }
  if (level === 3) {
    upgradeModifier += 25;
  }
  if (level === 4) {
    upgradeModifier += 40;
  }
  if (level === 5) {
    upgradeModifier += 55;
  }
  if (level === 6) {
    upgradeModifier += 70;
  }

  return getUpgradeStats(currentCard, upgradeModifier);
};

const card = new Command({

  name: "Phone Destroyer Cards",
  description: "View any card from phone destroyer, rendered in real time with full stats!",
  help: "```\n[prefix]card <card name> <level / upgrade level>```\n*Replace items in triangle brackets with:*\n\n**card name:** Any existing Phone Destroyer card's name! If not spelt correctly, AWESOM-O will try to match the name.\n\n**level:** Simply put an l followed by 2, 3, 4, 5, 6 or 7 in this field and the card will display information from that level! You can also do ff to see the starts of a card in a friendly match! *(Common - lvl 4/Rare - lvl 3/Epic - lvl2/Legendary - lvl1)*\n\n**upgrade level:** Put a u followed by any number from 2 - 70 to see the specific stats of your card at a specific upgrade level! You can also do m followed by 1 - 7 to show the max upgrade for that level.\n\n**Example:** [prefix]card Towelie 6 **or** [prefix]card Towelie u42.",
  thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099660711821312/card.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "card",

  featured: false,

  preload: true,

  cb: async function (client, message, guild) {

    // deep copy cards so we can replace shit
    // without worrying about gay object shit
    const cardsCopy = JSON.parse(JSON.stringify(cards));

    // legacy command support

    // card <name>
    // card <name> <level>
    // card <name> l<level>
    // card <name> u<upgrade>

    let name = null;

    let level = null;
    let upgrade = null;

    // 5 = card(4) + space(1).
    const args = message.content.slice(guild.prefix.length + 5);
    if (args === "") {

      return message.reply(`usage: ${guild.prefix}card <name> (l)[level=1]/u[upgrade]`);
    }

    const split = args.split(" ");

    // ***WARNING*** - this does change later in the code as a workaround,
    // good luck to all the poor souls trying to debug this cancer
    let last = split[split.length - 1];

    // assume level/upgrade is set, and if not, reset this value later
    name = split.slice(0, split.length - 1).join(" ");

    // determine the upgrade and level to display

    //level
    if (last.startsWith("l") && name !== "") {

      level = parseInt(last.slice(1));

      if (isNaN(level)) {

        level = null;
      } else {

        if (level < 1 || level > 7) {

          return message.reply("level out of bounds");
        }
      }
    }

    // upgrade
    if (last.startsWith("u") && name !== "") {

      upgrade = parseInt(last.slice(1));

      if (isNaN(upgrade)) {

        upgrade = null;
      } else {

        if (upgrade < 1 || upgrade > 70) {

          return message.reply("upgrade out of bounds");
        }
      }
    }

    // max upgrade
    if (last.startsWith("m") && name !== "") {

      level = parseInt(last.slice(1));

      if (isNaN(level)) {

        level = null;
      } else {

        if (level < 1 || level > 7) {

          return message.reply("level out of bounds");
        }
      }
    }

    // default to level checking for last param
    if (level === null && upgrade === null) {

      level = parseInt(last);

      // default to 1
      if (isNaN(level)) {

        // for some later checks teehee,
        // i know this is cancer, ill refactor it at some point
        last = last === "ff" || last === "art" ? last : "gay";
        //last = last === "ff" ? "ff" : last === "art" ? "art" : "gay";

        level = 1;
        name = split.join(" ");
      }

      // make sure the last word isnt a number by coincidence
      // this will not work if the last word is a number between 1 and 7
      if (level < 1 || level > 7 || last === name) {

        level = 1;
        name = split.join(" ");
      }
    }

    // find the card by % match

    const threshold = 0.0;

    let index = null;
    let current = threshold;

    for (let [i, v] of cardsCopy.entries()) {

      let dist = null;

      if (v.Name instanceof Array) {

        for (let vname of v.Name) {

          dist = similarity(vname.toLowerCase(), name.toLowerCase());

          if (dist > current) {

            current = dist;
            index = i;
          }
        }
      } else {

        dist = similarity(v.Name.toLowerCase(), name.toLowerCase());

        if (dist > current) {

          current = dist;
          index = i;
        }
      }
    }

    if (index === null) {

      return message.reply("card not found");
    }

    const card = cardsCopy[index];

    if (last === "art" && name !== "") {

      return message.channel.send("", {
        file: path.join(__dirname, "..", "assets", "cards", "art", `${card.Image}.jpg`)
      }).catch(err => {

        message.channel.send(`error sending card art: ${err}`);
      });
    }

    // friendly-fight/challenge stats
    // ignore this if the command is -card ff,
    // and assume 'ff' is a card name instead
    // this needs to be called after card search
    // as we need the rarity of the card
    if (last === "ff" && name !== "") {

      level = Math.abs(card.Rarity - 4);
    }

    let stats = null;
    if (level === null) {

      stats = getUpgradeStats(card, upgrade);
    } else {

      if (last.startsWith("m") && name !== "") {

        stats = getMaxUpgradeStats(card, level);

        level = null;
        upgrade = stats.upgrade;
      } else {

        stats = getLevelStats(card, level);
      }
    }

    for (let stat in stats) {

      if (stat === "Damage" || stat == "Health") {

        continue;
      }

      if (stat === "PowerHeroDamage") {

        // scale based on base stats
        stats[stat] = stats["PowerDamage"] * (card.PowerHeroDamage / card.PowerDamage);
      }

      if (stat === "PowerMaxHPGain") {

        card.Description = card.Description.replace("{PowerMaxHealthBoost}", typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
        continue;
      }

      card.Description = card.Description.replace(`{${stat}}`, typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
    }

    if (card.Description.includes("{PowerDurationMin}-{PowerDurationMax}")) {

      card.Description = card.Description.replace("{PowerDurationMin}-{PowerDurationMax}", `${Math.round(stats["PowerDuration"] * 100) / 100 - 1}-${Math.round(stats["PowerDuration"] * 100) / 100 + 1} seconds`);
    }
    if (card.Name instanceof Array ? card.Name[0] === "Cock Magic" : card.Name === "Cock Magic") {

      card.Description = card.Description.replace("{PowerTargetAmount}", level);
    }
    if (card.Name instanceof Array ? card.Name[0] === "Marcus" : card.Name === "Marcus") {

      card.Description = card.Description.replace("{PowerHeroDamage}", card.PowerDamage);
    }
    if (card.Name instanceof Array ? card.Name[0] === "Marine Craig" : card.Name === "Marine Craig") {

      card.Description = card.Description.replace("{PowerHeroPoison}", card.PowerPoisonAmount);
    }
    if (card.Name instanceof Array ? card.Name[0] === "Chicken Coop" : card.Name === "Chicken Coop") {

      card.Description = card.Description.replace("{PowerInterval.1}", "3.5");
    }
    if (card.Name instanceof Array ? card.Name[0] === "Shieldmaiden Wendy" : card.Name === "Shieldmaiden Wendy") {

      card.Description = card.Description.slice(0, card.Description.length - 1) + " seconds.";
    }
    if (card.Name instanceof Array ? card.Name[0] === "Youth Pastor Craig" : card.Name === "Youth Pastor Craig") {

      card.Description = card.Description.slice(0, card.Description.length - 1) + " seconds.";
    }

    /* --- pasted old code --- */

    // Get the frame outline.
    const frameWidth = 305;
    const frameHeight = 418;

    let x, y, z, w;

    switch (card.Rarity) {
    case 0: // common
      y = 0;
      switch (card.Theme) {
      case "Adv":
        x = frameWidth;
        break;
      case "Sci":
        x = frameWidth * 2;
        break;
      case "Mys":
        x = frameWidth * 3;
        break;
      case "Fan":
        x = frameWidth * 4;
        break;
      case "Gen":
        x = 0;
        break;
      default:
        message.reply("theme not found");
        return;
      }
      break;
    default:
      y = frameHeight;
      switch (card.Theme) {
      case "Adv":
        x = frameWidth;
        break;
      case "Sci":
        x = frameWidth * 2;
        break;
      case "Mys":
        x = frameWidth * 3;
        break;
      case "Fan":
        x = frameWidth * 4;
        break;
      case "Gen":
        x = 0;
        break;
      default:
        message.reply("theme not found");
        return;
      }
      break;
    }

    z = frameWidth;
    w = frameHeight;

    // Get the frame top.
    const topWidth = 338;
    const topHeight = 107;

    let fx, fy, fz, fw;

    fx = 0;

    switch (card.Rarity) {
    case 0: // common
      fy = undefined;
      break;
    case 1:
      fy = 0;
      break;
    case 2:
      fy = topHeight;
      break;
    case 3:
      fy = topHeight * 2;
      break;
    default:
      message.reply("rarity not found");
      return;
    }

    fz = topWidth;
    fw = topHeight;

    // Get the icon.
    const iconWidth = 116;
    const iconHeight = 106;

    let ix, iy, iz, iw;

    switch (card.CharacterType) {
    case "Tank":
      iy = 0;
      break;
    case undefined:
      iy = iconHeight * 2;
      break;
    case "Assassin":
      iy = iconHeight * 4;
      break;
    case "Ranged":
      iy = iconHeight * 6;
      break;
    case "Melee":
      iy = iconHeight * 8;
      break;
    case "Totem":
      iy = iconHeight * 10;
      break;
    }

    switch (card.Rarity) {
    case 0: // common
      switch (card.Theme) {
      case "Gen":
        ix = 0;
        break;
      case "Adv":
        ix = iconWidth;
        break;
      case "Sci":
        ix = iconWidth * 2;
        break;
      case "Mys":
        ix = iconWidth * 3;
        break;
      case "Fan":
        ix = iconWidth * 4;
        break;
      }
      break;
    case 1:
      iy += iconHeight;
      ix = 0;
      break;
    case 2:
      iy += iconHeight;
      ix = iconWidth;
      break;
    case 3:
      iy += iconHeight;
      ix = iconWidth * 2;
      break;
    }

    iz = iconWidth;
    iw = iconHeight;

    // Get the overlay.
    const overlayWidth = 305;
    const overlayHeight = 418;

    let ox, oy, oz, ow;

    oy = 0;

    switch (card.CharacterType) {
    case undefined:
      ox = overlayWidth;
      break;
    default:
      ox = 0;
      break;
    }

    oz = overlayWidth;
    ow = overlayHeight;

    // Card theme icons.
    const themeIconWidth = 36;
    const themeIconHeight = 24;

    let tx, ty, tz, tw;

    ty = 0;

    switch (card.Theme) {
    case "Gen":
      tx = 0;
      break;
    case "Adv":
      tx = themeIconWidth;
      break;
    case "Sci":
      tx = themeIconWidth * 2;
      break;
    case "Mys":
      tx = themeIconWidth * 3;
      break;
    case "Fan":
      tx = themeIconWidth * 4;
      break;
    default:
      message.reply("theme not found");
      return;
    }

    tz = themeIconWidth;
    tw = themeIconHeight;

    // Crystal things.
    const crystalSheet = {
      x: 0,
      y: 24,
      width: 180,
      height: 76 // 36 + 4 + 36
    };

    const crystalWidth = 36;
    const crystalHeight = 36;

    let cx, cy, cz, cw;

    cy = crystalSheet.y;

    switch (card.Rarity) {
    case 0: // common
      switch (card.Theme) {
      case "Gen":
        cx = 0;
        break;
      case "Adv":
        cx = crystalWidth;
        break;
      case "Sci":
        cx = crystalWidth * 2;
        break;
      case "Mys":
        cx = crystalWidth * 3;
        break;
      case "Fan":
        cx = crystalWidth * 4;
        break;
      default:
        message.reply("theme not found");
        return;
      }
      break;
    case 1:
      cy += crystalHeight + 4;
      cx = 17;
      break;
    case 2:
      cy += crystalHeight + 4;
      cx = 34 + crystalWidth;
      break;
    case 3:
      cy += crystalHeight + 4;
      cx = 34 + crystalWidth * 2;
      break;
    default:
      message.reply("rarity not found");
      return;
    }

    cz = crystalWidth;
    cw = crystalHeight;

    if (card.Rarity === 3) {
      cz += 17;
    }
    /* --- end of old code --- */

    // Make the image.
    const bgWidth = 455;
    const bgHeight = 630;

    // image overlaying stuff.
    let bg = await new jimp(800, 1200);
    let cardArt = await jimp.read(path.join(__dirname, "..", "assets", "cards", "art", card.Image + ".jpg"));
    let frameOverlay = frameOverlays
      .clone()
      .crop(ox, oy, oz, ow)
      .resize(bgWidth, bgHeight);
    let frameOutline = frameOutlines
      .clone()
      .crop(x, y, z, w)
      .resize(bgWidth, bgHeight);
    let typeIcon = typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
    let themeIcon = miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
    let crystal = miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

    let frameTop;
    if (fy !== undefined) {
      frameTop = frameTops
        .clone()
        .crop(fx, fy, fz, fw)
        .resize(bgWidth + 49, 200);
    }

    bg.composite(
      cardArt,
      bg.bitmap.width / 2 - cardArt.bitmap.width / 2,
      bg.bitmap.height / 2 - cardArt.bitmap.height / 2
    );
    bg.composite(
      frameOverlay,
      bg.bitmap.width / 2 - frameOverlay.bitmap.width / 2,
      bg.bitmap.height / 2 - frameOverlay.bitmap.height / 2
    );
    bg.composite(
      frameOutline,
      bg.bitmap.width / 2 - frameOutline.bitmap.width / 2,
      bg.bitmap.height / 2 - frameOutline.bitmap.height / 2
    );

    if (fy !== undefined) {
      bg.composite(
        frameTop,
        bg.bitmap.width / 2 - frameTop.bitmap.width / 2 - 8,
        240
      );
    }

    bg.composite(typeIcon, 130, 182);
    bg.composite(
      themeIcon,
      bg.bitmap.width / 2 - themeIcon.bitmap.width / 2 - 168,
      843
    );

    // 3 = legendary
    let xoffset = 0;
    if (card.Rarity === 3) {
      xoffset = 25;
    }

    bg.composite(
      crystal,
      bg.bitmap.width / 2 - themeIcon.bitmap.width / 2 - 168 - xoffset,
      745
    );

    if (card.Name instanceof Array) {
      printCenter(bg, sp25Font, 20, 315, card.Name[0]);
    } else {
      printCenter(bg, sp25Font, 20, 315, card.Name);
    }

    printCenter(bg, sp60Font, -168, 350, card.ManaCost.toString());

    if (ox === 0) {
      printCenter(bg, sp27Font, -168, 515, stats.Health.toString());
      printCenter(bg, sp27Font, -168, 640, stats.Damage.toString());
    }

    printCenter(bg, sp16Font, 17, 358, level === null ? `u ${upgrade}` : `lvl ${level}`);

    printCenterCenter(bg, sp18Font, 20, 510, card.Description, 325);

    //bg.autocrop(0.002, false);
    bg.crop(135, 165, 526, 769);

    // save + post
    const saveDate = Date.now();

    bg.write(path.join(__dirname, "temp", `pd-${saveDate}.png`), async () => {

      const embed = new discord.RichEmbed();

      // card name
      if (card.Name instanceof Array) {

        embed.setAuthor(card.Name[0]);
      } else {

        embed.setAuthor(card.Name);
      }

      let embedColour = null;
      switch (card.Theme) {
      case "Adv":
        embedColour = "#4f80ba";
        break;
      case "Fan":
        embedColour = "#d34f5f";
        break;
      case "Sci":
        embedColour = "#db571d";
        break;
      case "Mys":
        embedColour = "#4b9b38";
        break;
      case "Gen":
        embedColour = "#857468";
        break;
      default:
        embedColour = "#857468";
      }
      embed.setColor(embedColour);

      embed.setDescription("");

      embed.description += "**General Information**\n";

      embed.description += `Cast Area: ${card.CastArea}\n`;

      if (card.CharacterType !== "Totem") {

        embed.description += `Max Speed: ${Math.round(card.MaxVelocity * 100) / 100}\n`;
        embed.description += `Time To Reach Max Speed: ${Math.round(card.TimeToReachMaxVelocity * 100) / 100}\n`;
        embed.description += `Agro Range Multiplier: ${Math.round(card.AgroRangeMultiplier * 100) / 100}\n\n`;
      } else {

        embed.description += "\n";
      }

      let hasPower = false;
      for (let field in card) {

        if (field.startsWith("Power") && card[field] !== null) {

          hasPower = true;
          break;
        }
      }

      // enforcer jimmy aura range
      if (hasPower || card.Name[0] === "Enforcer Jimmy") {

        embed.description += "**Power Information? - Yes**\n";

        for (let field in stats) {

          if (field === "PowerRange" && stats[field] === 0) {

            continue;
          }

          if (field.startsWith("Power")) {

            embed.description += `${field === "PowerRange" ? field : camelPad(field.slice(5, field.length))}: ${typeof stats[field] === "number" ? Math.round(stats[field] * 100) / 100 : stats[field]}\n`;
          }
        }

        if (/*card.ChargedPowerRadius !== 0 && */card.ChargedPowerRegen !== 0) {

          embed.description += `Charged Power Regen: ${Math.round(card.ChargedPowerRegen * 100) / 100}\n\n`;
        } else {

          embed.description += "\n";
        }

      } else {

        embed.description += "**Power Information? - No**\n\n";
      }

      if (card.Type === "Character" && card.CanAttack && card.CharacterType !== "Totem") {
        // card that can attack

        embed.description += "**Can Attack? - Yes**\n";

        embed.description += `Attack Range: ${Math.round(card.AttackRange * 100) / 100}\n`;
        embed.description += `Knockback: ${Math.round(parseInt(card.KnockbackImpulse) * 100) / 100} at ${Math.round(card.KnockbackAngleDeg * 100) / 100}°\n\n`;

      } else {
        // spell, totem or card that cant attack

        embed.description += "**Can Attack? - No**\n\n";
      }

      if (card.AOEAttackType !== "No" && card.Type !== "Spell") {
        // aoe attacks

        embed.description += "**AOE Attacks? - Yes**\n";

        embed.description += `AOE Damage Percentage: ${Math.round(card.AOEDamagePercentage * 100) / 100}\n`;
        embed.description += `AOE Knockback Percentage: ${Math.round(card.AOEKnockbackPercentage * 100) / 100}\n`;
        embed.description += `AOE Radius: ${Math.round(card.AOERadius * 100) / 100}\n\n`;

      } else {
        // no aoe

        embed.description += "**AOE Attacks? - No**\n\n";
      }

      embed.description += `Full Stats: https://sppd.feinwaru.com/${card.Image}`;

      embed.setFooter("© 2018 Copyright: Feinwaru Software ");

      // ***ATTACK INFO***

      // -can attack
      // -attack range
      // -time in between attacks
      // -pre attack delay
      // -knockback impulse
      // -aoe attack type
      // -aoe damage percentage
      // -aoe radius
      // -aoe knockback percentage

      // ***POWER INFO***

      // -targeting ...
      // -power duration

      // ***SPEED INFO***

      // -time to max velocity
      // -max velocity

      // ***TOTEM ONLY***

      // -health loss

      // ***SPELL ONLY***



      // *** ??? ***

      // -requirements ...
      // -child unit limit

      // *Name
      // CanAttack
      // *Description
      // *Image
      // -ManaCost
      // -Damage
      // -Health
      // HealthLoss - CharacterType: totem
      // Type - if !Character, CharacterType === undefined
      // Targeting ... - power radius
      // CharacterType
      // AttackRange
      // TimeToMaxVelocity
      // MaxVelocity
      // TimeInBetweenAttacks
      // PowerDuration
      // -PowerPower
      // -Rarity
      // -Theme
      // Requirements
      // AOEAttackType
      // AOEDamagePercentage
      // AOERadius
      // AOEKnockbackPercentage
      // PreAttackDelay
      // CastArea - ownside/anywhere
      // ChildUnitLimit

      await message.channel.send("", {
        file: path.join(__dirname, "temp", `pd-${saveDate}.png`)
      });

      message.channel.send(embed);

      fs.unlink(path.join(__dirname, "temp", `pd-${saveDate}.png`), error => {
        if (error !== null && error !== undefined) {

          throw `could not delete: pd-${saveDate}.png`;
        }
      });
    });
  },

  load: function () {
    return new Promise((resolve, reject) => {

      const promises = [];

      promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-16.fnt"))
        .then(font => {
          sp16Font = font;
        }));
      promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-18.fnt"))
        .then(font => {
          sp18Font = font;
        }));
      promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-25.fnt"))
        .then(font => {
          sp25Font = font;
        }));
      promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-27.fnt"))
        .then(font => {
          sp27Font = font;
        }));
      promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-60.fnt"))
        .then(font => {
          sp60Font = font;
        }));

      promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "frame-overlay.png"))
        .then(image => {
          frameOverlays = image;
        }));
      promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "frame-outline.png"))
        .then(image => {
          frameOutlines = image;
        }));
      promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "frame-top.png"))
        .then(image => {
          frameTops = image;
        }));
      promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "card-character-type-icons.png"))
        .then(image => {
          typeIcons = image;
        }));
      promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "card-theme-icons.png"))
        .then(image => {
          miscIcons = image;
        }));

      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
});

module.exports = card;
