const world = '🗺️';

export function hello(word: string = world): string {

  return `Hello ${world}!`;
}

export function killme(): void {

  console.log('memory leak teehee');
}
