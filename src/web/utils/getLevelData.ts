const getLevelData = (xp: number) => {
  if (xp === 0) {
    return {
      level: 0,
      progress: 0
    };
  }

  const levels = [
    0,
    1,
    250,
    400,
    550,
    700,
    850,
    1000,
    1200,
    1400,
    1600,
    1800,
    2000,
    2250,
    2500,
    2750,
    3000,
    3300,
    3600,
    4000,
    4500
  ];

  let count = 0;
  let level = 0;
  let progress = 0;

  for (let i = 0; i < levels.length; i++) {
    count += levels[i];

    if (xp < count) {
      level = i - 1;
      progress = 1 - (count - xp) / levels[i];
      break;
    }
  }

  if (level === 0 && count !== 0) {
    xp -= count;

    level = Math.floor(xp / 5000) + levels.length - 1;
    progress = (xp % 5000) / 5000;
  }

  if (level > 70) {
    level = 70;
    progress = 1;
  }

  return {
    level,
    progress: progress * 100
  };
};

export default getLevelData;
