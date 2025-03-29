export function clamp(
  value: number,
  lowerBound: number,
  upperBound: number
): number {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

// export function shuffle<T>(array: T[]): T[] {
//   const newArray = [...array];
//   let counter = newArray.length;

//   while (counter > 0) {
//     let index = Math.floor(Math.random() * counter);
//     counter--;
//     [newArray[counter], newArray[index]] = [newArray[index], newArray[counter]];
//   }

//   return newArray;
// }

export function objectMove<T>(
  object: Record<string, T>,
  from: T,
  to: T
): Record<string, T> {
  "worklet";
  const newObject = { ...object };

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    } else if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

interface ListItem {
  id: string;
}

export function listToObject(list: ListItem[]): Record<string, number> {
  const object: Record<string, number> = {};

  for (let i = 0; i < list.length; i++) {
    object[list[i].id] = i;
  }

  return object;
}
