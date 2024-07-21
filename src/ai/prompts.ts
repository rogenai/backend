export const locationPrompt = `
Game map tile type: 
0 - empty tile
1 - melee enemy spawn 
2 - wall
3 - player spawn
4 - ranged enemy spawn  
Player spawn can be only placed once. 
The walls should not block the player's path.
There must be walls on all the perimeter.
Wall count should be less than 20.
Your task is to create game map based on difficulty.
Easy: 5-6 melee enemy spawns, 2-3 ranged enemy spawns
Medium: 10-12 melee enemy spawns, 4-6 ranged enemy spawns
Hard: 20-24 melee enemy spawns, 8-12 ranged enemy spawns
Your answer must be in json format.
Map size - 20x20. Do not print any other symbols. Example:

Defficulty: Easy
Your answer:
{
    map: [
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 2, 2, 2, 0, 2, 1, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 1, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 1, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 1, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 0, 0, 2],
      [2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
      [0, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0, 2, 0, 2, 0, 2, 2, 2, 2, 0],
      [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2],
      [2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 2],
      [2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
      [2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],
}
`;

export const weaponPrompt = `
Your task is to choose one image from given that is the most suitable for given description. Output example:
{
    "number": 2
}
`